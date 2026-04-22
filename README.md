# Car Rental QA Automation Suite

End-to-end UI and API test suite built with **Playwright** and **TypeScript**, covering the Booking.com car rental flow and a public REST API.

---

## Test Coverage

### UI — Core Car Rental Flow (`tests/coreCarRentalFlow.spec.ts`)

Automates the full happy-path booking flow on [Booking.com/cars](https://www.booking.com/cars/index.en-gb.html):

1. Search for a car at John F. Kennedy International Airport (New York)
2. Dismiss sign-in modal if present
3. Open the first available deal (handles new tab)
4. Proceed through Extras page to Checkout
5. Fill in contact details, booker personal details, and billing address
6. Select Google Pay as payment method and verify its availability
7. Assert the Book Now button is enabled

> **Note on bot detection:** Booking.com actively detects browser automation. The suite masks `navigator.webdriver` via `addInitScript` and runs with `workers: 1` to prevent simultaneous sessions from triggering rate limiting. Real browser binaries (Edge, Chrome) yield the most reliable results for the UI test.

---

### API — REST Objects (`tests/apiObjects.spec.ts`)

Tests against the public API at `https://api.restful-api.dev/objects`:

| Test | Method | Endpoint | Assertion |
|---|---|---|---|
| Returns a non-empty array | GET | `/objects` | Status 200, array with items |
| Full lifecycle | POST | `/objects` | Status 200, `id` returned, data matches |
| | GET | `/objects/{id}` | Status 200, object matches created payload |
| | DELETE | `/objects/{id}` | Status 200, message contains `id` |
| | GET | `/objects/{id}` | Status 404 after deletion |

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

## Project Structure

```
├── tests/
│   ├── coreCarRentalFlow.spec.ts   # UI E2E test — full booking flow
│   └── apiObjects.spec.ts          # API tests — GET, POST, DELETE lifecycle
├── playwright.config.ts            # Playwright configuration
├── package.json
└── README.md
```

---

## Configuration Highlights

- **Browsers:** Edge, Chrome, Chromium, Firefox, WebKit — all run both UI and API tests
- **Headed mode:** enabled — reduces bot detection on live booking sites
- **Trace:** Collected on first retry for failed tests
- **Screenshots:** Captured on failure
- **Retries:** 2 retries on CI, 0 locally
