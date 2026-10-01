# Cloud Sync setup (Firebase) — one time, free

This connects every till (and later your phones) to ONE live database, so a sale or stock scan on any device shows on all of them in real time.

## Create a free Firebase project (~10 minutes, in your browser)

1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Click **Add project** → give it a name (e.g. `3sverse-pos`) → continue (you can disable Google Analytics) → **Create project**.
3. In the left menu open **Build → Firestore Database** → **Create database** → choose **Start in test mode** (you can tighten rules later) → pick a location → **Enable**.
4. Click the gear icon (top-left) → **Project settings** → scroll to **Your apps** → click the **`</>` (Web)** icon → register an app (any nickname) → it shows a `firebaseConfig = { … }` snippet. **Copy that whole `{ … }` block.**

## Connect the POS

1. Open 3S Verse POS → **Setup → Cloud Sync (Firebase)**.
2. Paste the copied config into the box.
3. Set a **Store ID** — any short word, e.g. `mainshop`. **Use the exact same Store ID on every device of this shop** (every till, and the phone app later).
4. Click **Connect Cloud**. The top bar shows **☁️ Cloud: live**.

Repeat steps 1–4 on each till using the **same config and same Store ID**. They now sync live.

## Security note
"Test mode" lets anyone with your config read/write for 30 days. For real use, in Firestore **Rules** restrict access (e.g. require auth, or lock to your store doc). Tell me and I'll give you exact rules. Also: the shared data document has a Firestore 1 MB size limit — fine for thousands of products/sales; very large histories should be archived periodically (Export to Excel / JSON backup).

The phone app (next stage) uses the **same** Firebase config + Store ID, so phone scans sync to the tills instantly.
