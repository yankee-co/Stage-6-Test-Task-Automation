import { test, expect } from '@playwright/test';

const booker = {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '985689955',
};

test('Core car rental booking flow — search to checkout', async ({ page }) => {

    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    await page.goto('https://www.booking.com/cars/index.en-gb.html');
    await page.getByRole('combobox', { name: 'Pick-up location' }).pressSequentially('New York', { delay: 80 });
    await page.getByRole('option', { name: 'John F. Kennedy International' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForLoadState('networkidle');

    const closeSignInDialog = page.getByTestId('signin-modal-close');
    if (await closeSignInDialog.isVisible()) {
        await closeSignInDialog.click();
    }

    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.getByRole('group').getByLabel('View deal').first().click(),
    ]);

    await newPage.waitForLoadState('networkidle');

    await newPage.getByTestId('go-to-extras-button').click();
    await newPage.waitForLoadState('networkidle');

    await newPage.getByTestId('checkoutButton').click();
    await newPage.waitForLoadState('networkidle');

    // Fill contact details
    await newPage.getByTestId('email-field').fill(booker.email);
    await newPage.getByTestId('firstName-field').fill(booker.firstName);
    await newPage.getByTestId('lastName-field').fill(booker.lastName);
    await newPage.getByTestId('telephoneNumber-number-field').fill(booker.phone);

    // Fill booker personal details
    await newPage.getByTestId('bookerDetailsFirstName-field').fill(booker.firstName);
    await newPage.getByTestId('bookerDetailsLastName-field').fill(booker.lastName);
    await newPage.getByTestId('bookerDetailsTelephoneNumber-number-field').fill(booker.phone);

    // Fill billing address
    await newPage.getByTestId('billingAddressAddress-field').fill('350 Fifth Avenue');
    await newPage.getByTestId('billingAddressCity-field').fill('New York');
    await newPage.getByTestId('billingAddressPostcode-field').fill('10118');

    // Select Google Pay and verify it is available
    const paymentFrame = newPage.locator('iframe[title="Payment"]').contentFrame();
    await paymentFrame.getByTestId('GOOGLE_PAY_DI').first().click();
    await expect(paymentFrame.getByRole('button', { name: 'Google Pay' })).toBeVisible();

    // Verify Book Now button is enabled and click it
    const bookNowButton = newPage.getByRole('button', { name: /book now/i });
    await expect(bookNowButton).toBeEnabled();
});