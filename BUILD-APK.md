# Build the Android APK (real installable file) — free, in the cloud

This produces a real **`3SVerse-POS.apk`** you can install on Android phones. It's the same app as the phone PWA, wrapped natively with Capacitor, connected to the **same Firebase** so it syncs with the desktop tills.

> iPhone note: a real iPhone `.ipa` requires a Mac + a paid Apple Developer account ($99/yr), so it can't be built this way. iPhone users use the Add-to-Home-Screen PWA (see DEPLOY-PHONE.md).

## What to upload to your GitHub repo
1. The **`android-apk/`** folder (contains `package.json`, `capacitor.config.json`, and `www/` = the app).
2. The workflow file at **`.github/workflows/android.yml`**.

(Your existing desktop workflow `build.yml` stays — both run independently.)

### How to add the workflow in the browser
- Repo → **Add file → Create new file** → name it exactly `.github/workflows/android.yml` → paste the contents of the `android.yml` from this package → **Commit**.
- Upload the `android-apk` folder via **Add file → Upload files** (drag the whole folder).

## Get the APK
1. After committing, open the **Actions** tab → the run **"Build 3S Verse POS Android APK"** starts (first build takes ~5–8 min — it downloads Android tools).
2. Wait for the green ✓ → open the run → **Artifacts** → download **3SVerse-POS-Android-APK** (a zip containing `3SVerse-POS.apk`).

## Install on a phone
1. Copy the `.apk` to the phone (or download it directly on the phone).
2. Tap it. Android will ask to allow installing from this source → **Allow / Install anyway** (it's a debug-signed app, normal for sideloaded apps).
3. Open **3S Verse POS** → on first run paste the **same Firebase config + Store ID** as the desktop → sign in with an employee/admin account.
4. Tap **📷 Scan** — allow the **camera** permission the first time. Scan to sell or to receive stock; it syncs live with the tills.

## Notes
- This is a **debug** APK (fine for sideloading on your own phones). For the **Google Play Store** you need a *release-signed* APK/AAB with a keystore — tell me and I'll add signing + a release workflow.
- If the camera doesn't start on some devices, the scan dialog also lets you **type the barcode** manually.
