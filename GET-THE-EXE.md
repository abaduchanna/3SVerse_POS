# How to get the 3S Verse POS .exe (no Node.js, no terminal)

Build the installer **once** in the cloud, then give that one `.exe` to any shop. The shop owner never builds anything — they just double-click the installer.

## Easiest way — free cloud build (about 5 minutes, all in your browser)

1. Go to <https://github.com> and create a free account (or sign in).
2. Click **+** (top-right) → **New repository**. Name it e.g. `3sverse-pos`. Click **Create repository**.
3. Click **uploading an existing file**.
4. Drag **everything inside this folder** (including the hidden `.github` folder) into the page, then **Commit changes**.
5. Open the **Actions** tab → wait ~3–5 min for the green tick.
6. Click the finished run → **Artifacts** → download **3SVerse-POS-Windows-EXE**.
7. Inside is **3SVerse-POS-Setup-1.0.0.exe** — your installer. Done.

## Alternative — build on a Windows PC
Double-click **BUILD-EXE.bat** (it installs Node if guided, then builds). Optional.

## What the shop owner does
1. Double-click **3SVerse-POS-Setup-1.0.0.exe** → Next → Finish.
2. Open **3S Verse POS**, complete the quick setup (business type, store name, admin PIN).
3. Log in with the admin PIN and start selling. Drive backup is automatic if Google Drive for Desktop is installed.
