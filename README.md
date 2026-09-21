# LedgerFlow AR Automation Prototype

This is a **dummy frontend prototype** created to demonstrate the proposed contract capture, role-based approval, tax configuration, and invoice automation flows.

All customers, contracts, invoices, users, calculations, and actions use mock data. There is currently no backend, database, authentication, PDF generation, or production tax engine.

Although this is only a demonstration site, its React and Tailwind CSS setup and feature-based structure can be used as the frontend foundation for developing the complete project later.

## Setup

### Requirements

- Node.js 24 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

Any email and password can be used on the prototype login screen. Select a demo role to preview its permitted navigation and workflow.

### Production build

```bash
npm run build
npm run preview
```

## Demo roles

- **Admin** — access to all modules and workspace settings
- **Finance / Ops User** — access to overview, contracts, and invoices
- **Approver** — access to the approval queue

## Project structure

```text
src/
├── components/       # Shared UI and application layout
├── data/             # Mock contracts and invoices
├── features/
│   ├── contracts/    # Contract screens and creation wizard
│   └── invoices/     # Invoice screens and generation flow
├── pages/            # Login, overview, approvals, settings, and users
├── App.jsx           # Top-level state and screen composition
└── main.jsx          # React entry point
```

## Moving toward production

The mock data and simulated actions can later be replaced with API services, real authentication and authorization, persisted form state, validated tax rules, document storage, approval audit trails, and PDF/invoice delivery services.
