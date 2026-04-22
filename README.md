# Car Rental QA Automation Suite

End-to-end UI and API test suite built with **Playwright**, **TypeScript**, and **Faker**, covering the Booking.com car rental flow and a public REST API.

---

## Test Coverage

### UI — Core Car Rental Flow (`tests/coreCarRentalFlow.spec.ts`)

Automates the full happy-path booking flow on [Booking.com/cars](https://www.booking.com/cars/index.en-gb.html).
Tests run in **serial mode** — each step is an isolated `test()` block sharing state via outer variables (Page Object instances, dynamically generated data).

| # | Test | Description |
|---|------|-------------|
| 1 | should search for cars at JFK Airport | Navigates, types location, selects JFK suggestion, submits search |
| 2 | should open a car deal in a new tab | Dismisses sign-in modal if present, opens first deal |
| 3 | should proceed through extras to checkout | Clicks through Extras → Checkout pages |
| 4 | should fill in contact details | Fills email, first/last name, phone with generated data |
| 5 | should fill in booker personal details | Fills booker section with the same generated data |
| 6 | should fill in billing address | Fills address, city, postcode with generated data |
| 7 | should select Google Pay and confirm it is available | Selects payment method and asserts button visible |
| 8 | should enable the Book Now button | Asserts final CTA is enabled |

> **Note on bot detection:** Booking.com actively detects browser automation. The suite masks `navigator.webdriver` via `addInitScript` and runs with `workers: 1`. Real browser binaries (Edge, Chrome) yield the most reliable results.

---

### API — REST Objects (`tests/apiObjects.spec.ts`)

Tests against the public API at `https://api.restful-api.dev/objects`.
Runs in **serial mode** with a shared `createdId` passed between steps.

| # | Test | Method | Endpoint | Assertion |
|---|------|--------|----------|-----------|
| 1 | GET /objects — returns a non-empty array | GET | `/objects` | Status 200, non-empty array |
| 2 | POST /objects — creates a new object | POST | `/objects` | Status 200, `id` defined, payload matches |
| 3 | GET /objects/:id — fetches the created object | GET | `/objects/{id}` | Status 200, data matches created payload |
| 4 | DELETE /objects/:id — removes the object | DELETE | `/objects/{id}` | Status 200, response contains `id` |
| 5 | GET /objects/:id — returns 404 after deletion | GET | `/objects/{id}` | Status 404 |

---

## Project Structure

```
├── tests/
│   ├── pages/
│   │   ├── CarRentalSearchPage.ts   # Page Object — search form, suggestions, first deal
│   │   └── CheckoutPage.ts          # Page Object — extras, checkout form, payment iframe
│   ├── api/
│   │   └── ObjectsApiClient.ts      # API client — getAll, create, getById, deleteById
│   ├── helpers/
│   │   ├── config.ts                # URL constants (BASE_URL, API_BASE_URL)
│   │   └── dataGenerator.ts         # Faker-based generators — booker (UA phone format), billing, object payload
│   ├── coreCarRentalFlow.spec.ts    # UI E2E — 8 serial tests
│   └── apiObjects.spec.ts           # API — 5 serial tests
├── playwright.config.ts             # Playwright configuration (baseURL, browsers, retries)
├── package.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Microsoft Edge](https://www.microsoft.com/edge) installed (required for UI tests)
- [Google Chrome](https://www.google.com/chrome) installed (required for UI tests)

---

## Installation

```bash
npm install
npx playwright install
```

---

## Running Tests

**All tests:**
```bash
npx playwright test
```

**UI test only:**
```bash
npx playwright test coreCarRentalFlow.spec.ts
```

**API tests only:**
```bash
npx playwright test apiObjects.spec.ts
```

**Debug mode** (step through UI test with Playwright Inspector):
```bash
npx playwright test coreCarRentalFlow.spec.ts --debug
```

**View HTML report** after a run:
```bash
npx playwright show-report
```

---

## Configuration

`playwright.config.ts` controls the UI base URL. The API base URL lives in `tests/helpers/config.ts`.
Both can be overridden via environment variables:

```bash
BASE_URL=https://www.booking.com npx playwright test
API_BASE_URL=https://api.restful-api.dev npx playwright test
```

Other highlights:
- **Browsers:** Edge, Chrome, Chromium, Firefox, WebKit
- **Trace:** collected on first retry for failed tests
- **Screenshots:** captured on failure
- **Retries:** 2 on CI, 0 locally
