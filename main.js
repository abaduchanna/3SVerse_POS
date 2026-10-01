/* 3S Verse POS System - Electron main process */
const { app, BrowserWindow, dialog, ipcMain, shell, clipboard, nativeImage } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const BACKUP_NAME = '3sverse-data.json';
const APP_FOLDER = '3SVersePOS';

function findDriveRoot() {
  const home = os.homedir();
  const checks = [];
  for (let c = 68; c <= 90; c++) checks.push(path.join(String.fromCharCode(c) + ':\\', 'My Drive'));
  checks.push(path.join(home, 'My Drive'), path.join(home, 'Google Drive'), path.join(home, 'GoogleDrive'));
  for (const c of checks) { try { if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c; } catch (e) {} }
  return null;
}
function ensureAppFolder() { const root = findDriveRoot(); if (!root) return null; const f = path.join(root, APP_FOLDER); try { fs.mkdirSync(f, { recursive: true }); return f; } catch (e) { return null; } }
function readBackupFrom(folder) { try { const p = path.join(folder, BACKUP_NAME); if (!fs.existsSync(p)) return { exists: false }; const json = fs.readFileSync(p, 'utf8'); let exported = null; try { exported = JSON.parse(json).exported || null; } catch (e) {} return { exists: true, json, exported }; } catch (e) { return { exists: false }; } }

function createWindow() {
  const win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 1040, minHeight: 680,
    backgroundColor: '#141118', title: '3S Verse POS System', autoHideMenuBar: true,
    icon: path.join(__dirname, 'renderer', 'assets', 'icon.ico'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url && url.startsWith('http')) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

ipcMain.handle('drive:autoLocate', async () => { const folder = ensureAppFolder(); if (!folder) return { found: false, folder: null, backup: { exists: false } }; return { found: true, folder, backup: readBackupFrom(folder) }; });
ipcMain.handle('backup:save', async (e, { folder, json }) => { try { let t = folder || ensureAppFolder(); if (!t) return { ok: false }; fs.mkdirSync(t, { recursive: true }); fs.writeFileSync(path.join(t, BACKUP_NAME), json, 'utf8'); return { ok: true, folder: t }; } catch (err) { return { ok: false, error: String(err) }; } });
ipcMain.handle('backup:read', async (e, { folder }) => { const t = folder || ensureAppFolder(); if (!t) return null; const b = readBackupFrom(t); return b.exists ? b.json : null; });
ipcMain.handle('shell:open', async (e, url) => { if (url) shell.openExternal(url); return true; });

/* WhatsApp auto-send: copies the invoice image to the clipboard (reliable, native),
   opens WhatsApp Desktop on the chat, then pastes + sends via PowerShell SendKeys. */
ipcMain.handle('wa:send', async (e, { phone, caption, pngDataUrl }) => {
  try {
    const tmp = os.tmpdir();
    const stamp = Date.now();
    const imgPath = path.join(tmp, 'verse_wa_' + stamp + '.png');
    const capPath = path.join(tmp, 'verse_wa_' + stamp + '.txt');
    const b64 = (pngDataUrl || '').split(',')[1] || '';
    fs.writeFileSync(imgPath, Buffer.from(b64, 'base64'));
    fs.writeFileSync(capPath, caption || '', 'utf8');
    // Put the image on the clipboard via Electron (most reliable) so manual Ctrl+V always works too.
    try { const img = nativeImage.createFromPath(imgPath); if (!img.isEmpty()) clipboard.writeImage(img); } catch (x) {}
    if (process.platform !== 'win32') {
      shell.openExternal('https://wa.me/' + phone + '?text=' + encodeURIComponent(caption || ''));
      return { ok: true, mode: 'fallback' };
    }
    const ps = [
      "Start-Process ('whatsapp://send?phone=" + phone + "')",
      'Start-Sleep -Seconds 7',
      'Add-Type -AssemblyName System.Windows.Forms',
      '$ws=New-Object -ComObject WScript.Shell',
      "$ws.AppActivate('WhatsApp') | Out-Null",
      'Start-Sleep -Milliseconds 1200',
      "$ws.SendKeys('^v')",
      'Start-Sleep -Seconds 2',
      "$cap=Get-Content -Raw '" + capPath.replace(/'/g, "''") + "'",
      'if($cap){ [System.Windows.Forms.Clipboard]::SetText($cap); Start-Sleep -Milliseconds 500; $ws.SendKeys("^v"); Start-Sleep -Milliseconds 700 }',
      "$ws.SendKeys('{ENTER}')",
      'Start-Sleep -Milliseconds 800'
    ].join('\n');
    const scriptPath = path.join(tmp, 'verse_wa_' + stamp + '.ps1');
    fs.writeFileSync(scriptPath, ps, 'utf8');
    const child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath], { windowsHide: true });
    return new Promise((resolve) => {
      child.on('exit', (code) => { try { fs.unlinkSync(scriptPath); } catch (x) {} resolve({ ok: code === 0, code }); });
      child.on('error', (err) => resolve({ ok: false, error: String(err) }));
    });
  } catch (err) { return { ok: false, error: String(err) }; }
});

app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
