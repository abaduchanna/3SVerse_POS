# 3S Verse POS System

A customer-ready Point of Sale for Pakistan. Single Windows `.exe`, fully offline-capable, with automatic Google Drive backup that syncs multiple terminals.

## Get the installer
See **GET-THE-EXE.md** (free cloud build in your browser — no Node.js). Then the shop owner just double-clicks `3SVerse-POS-Setup-1.0.0.exe`.

## Logins
- **Master / Admin** — full access. PIN set during setup (Setup → or Users → Admin).
- **Staff users** — created under the **Users** tab with a photo, PIN, and exactly the permissions you tick (Sales, Products, Customers, Reports, Returns, Discounts, Settings, Users). Enable/disable any user. Everyone logs in/out from the login screen; the cashier name is stamped on every invoice.

## Key features
- **Customers** (People) and **Users** (staff) are separate sections.
- **Per-category auto-SKU**: leave SKU blank and it generates `GRO-0001`, `DAI-0001`, etc. by category, following the series.
- **Barcode scanner**: scan on the Sale screen to add to cart and stock-out while selling (USB scanners act as a keyboard). Toggle in Setup.
- **Invoice numbers** follow a persistent series (e.g. `INV-1001`, `INV-1002`).
- **Returns & edits**: open any invoice → **Edit / Return** to return a line to inventory, **replace** a line with another product, or **return the whole invoice** (all items go back to stock).
- **Lost sales**: record items customers wanted but you couldn't sell (out of stock, price, etc.) — shown in Reports.
- **Display / Accessibility tab**: upload a **logo** (shown on invoice + login), pick **preset themes** or a **custom accent color**, and toggle **light/dark** (also via the 🌙/☀️ button in the top bar).
- **Pakistan GST** presets (18% standard + 17/16/10/5/0%) plus unlimited custom slabs; tax-inclusive or exclusive.
- **Black Copper 80mm** thermal printing + A4 option; **WhatsApp Business** invoice send.
- Dashboard, profit, tax-liability, sales-by-cashier, Z-report, CSV exports.

## Multi-terminal Google Drive sync — how it works & limits
Every till points at the **same Google account's Drive**. The app keeps **one shared data file** (`3sverse-data.json`) in a `3SVersePOS` folder and:
- **auto-saves** after each sale,
- **polls** the file every ~15s and reloads when another till has newer data,
- **merges sales** from all tills by ID so no sale is lost.

**Honest limitation:** this is *near-real-time* (a few seconds, bounded by how fast Google Drive for Desktop syncs the file between PCs), **not** instantaneous like a central server database. If two tills edit the *same* product's stock within the same few-second window, last-write-wins on that field (sales themselves are always preserved). For dozens of tills hammering simultaneously, a real server/cloud database is the right tool — tell me and I can wire one up.

## Data
Stored locally on each PC and mirrored to the shared Drive file. **Setup → Local Backup** also exports a manual JSON. All data — products, sales, customers, **users**, lost sales, settings, logo, theme — lives in that one file.

---

Developed by **www.3SVerse.com** — software, systems & operations.
