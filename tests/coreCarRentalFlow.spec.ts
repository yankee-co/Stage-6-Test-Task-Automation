import { test, expect, type Page } from '@playwright/test';
import { CarRentalSearchPage } from './pages/CarRentalSearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { generateBookerData, generateBillingData } from './helpers/dataGenerator';

test.describe.configure({ mode: 'serial' });

test.describe('Core car rental booking flow — search to checkout', () => {
    let searchPage: CarRentalSearchPage;
    let checkoutPage: CheckoutPage;

    const booker = generateBookerData();
    const billing = generateBillingData();

    test.beforeAll(async ({ browser }) => {
        const page: Page = await browser.newPage();
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });
        searchPage = new CarRentalSearchPage(page);
    });

    test('should search for cars at JFK Airport', async () => {
        await searchPage.goto();
        await searchPage.searchLocation('New York');
        await searchPage.selectSuggestion('John F. Kennedy International');
        await searchPage.clickSearch();
    });

    test('should open a car deal in a new tab', async () => {
        await searchPage.closeSignInModalIfVisible();
        const newPage = await searchPage.openFirstDeal();
        checkoutPage = new CheckoutPage(newPage);
        await expect(checkoutPage.extrasButton).toBeVisible();
    });

    test('should proceed through extras to checkout', async () => {
        await checkoutPage.proceedToExtras();
        await checkoutPage.proceedToCheckout();
        await expect(checkoutPage.emailField).toBeVisible();
    });

    test('should fill in contact details', async () => {
        await checkoutPage.fillContactDetails(booker);
        await expect(checkoutPage.emailField).toHaveValue(booker.email);
    });

    test('should fill in booker personal details', async () => {
        await checkoutPage.fillBookerDetails(booker);
    });

    test('should fill in billing address', async () => {
        await checkoutPage.fillBillingAddress(billing);
    });

    test('should select Google Pay and confirm it is available', async () => {
        await checkoutPage.selectGooglePay();
        await expect(checkoutPage.googlePayButton).toBeVisible();
    });

    test('should enable the Book Now button', async () => {
        await expect(checkoutPage.bookNowButton).toBeEnabled();
    });
});
