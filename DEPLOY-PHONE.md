# Put the POS on phones (Android & iPhone)

The `phone/` folder is an installable web app that uses the **same Firebase project** as the desktop POS, so phone scans sync to the tills instantly. It uses the phone **camera** to scan items in and out.

## 1. Host it (free) — GitHub Pages
You already have the project on GitHub. To serve the phone app:
1. Make sure the **`phone`** folder is uploaded to your repo (it contains `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`).
2. In the repo: **Settings → Pages** → under "Build and deployment" set **Source = Deploy from a branch**, **Branch = main**, folder **/(root)** → **Save**.
3. After a minute GitHub gives you a URL like `https://YOURNAME.github.io/3S-verse-POS/`.
4. The phone app is at **`https://YOURNAME.github.io/3S-verse-POS/phone/`**.

(Camera scanning needs HTTPS — GitHub Pages is HTTPS, so it works. Opening the file directly from a USB drive will NOT allow the camera.)

## 2. Open & install on the phone
1. On the phone browser (Chrome on Android, Safari on iPhone) open the `…/phone/` URL.
2. **Android Chrome:** tap the **⋮ menu → Add to Home screen / Install app**.
   **iPhone Safari:** tap **Share → Add to Home Screen**.
3. It now opens full-screen like an app.

## 3. Connect & use
1. First launch asks for the **Firebase config** and **Store ID** — paste the **same** ones you used on the desktop POS (Setup → Cloud Sync). 
2. Sign in with an **employee email & password** (or admin) — same accounts as the desktop, since they sync.
3. **Sell tab:** tap **📷 Scan to sell**, scan items, then **Charge (Cash)** — the sale appears on the tills instantly and reduces stock.
4. **Stock-In tab:** set qty, tap **📷 Scan to receive stock**, scan items — inventory goes up everywhere live.

## Notes
- The phone allows camera access the first time — tap **Allow**.
- Sell on the phone uses Cash (quick mobile checkout); full payment options stay on the desktop tills.
- Same honest limits as the desktop: it's near-real-time (a second or two) and the shared data document has Firestore's 1 MB limit — archive old sales periodically for very high volume.
