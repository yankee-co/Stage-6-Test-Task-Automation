import { type Page, type Locator, type FrameLocator } from '@playwright/test';
import type { BookerData, BillingData } from '../helpers/dataGenerator';

export class CheckoutPage {
    readonly extrasButton: Locator;
    readonly emailField: Locator;
    readonly bookNowButton: Locator;
    private readonly checkoutButton: Locator;
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly phoneField: Locator;
    private readonly bookerFirstNameField: Locator;
    private readonly bookerLastNameField: Locator;
    private readonly bookerPhoneField: Locator;
    private readonly billingAddressField: Locator;
    private readonly billingCityField: Locator;
    private readonly billingPostcodeField: Locator;
    private readonly paymentFrame: FrameLocator;

    constructor(private readonly page: Page) {
        this.extrasButton = page.getByTestId('go-to-extras-button');
        this.checkoutButton = page.getByTestId('checkoutButton');
        this.emailField = page.getByTestId('email-field');
        this.firstNameField = page.getByTestId('firstName-field');
        this.lastNameField = page.getByTestId('lastName-field');
        this.phoneField = page.getByTestId('telephoneNumber-number-field');
        this.bookerFirstNameField = page.getByTestId('bookerDetailsFirstName-field');
        this.bookerLastNameField = page.getByTestId('bookerDetailsLastName-field');
        this.bookerPhoneField = page.getByTestId('bookerDetailsTelephoneNumber-number-field');
        this.billingAddressField = page.getByTestId('billingAddressAddress-field');
        this.billingCityField = page.getByTestId('billingAddressCity-field');
        this.billingPostcodeField = page.getByTestId('billingAddressPostcode-field');
        this.paymentFrame = page.locator('iframe[title="Payment"]').contentFrame();
        this.bookNowButton = page.getByRole('button', { name: /book now/i });
    }

    get googlePayButton(): Locator {
        return this.paymentFrame.getByRole('button', { name: 'Google Pay' });
    }

    async proceedToExtras(): Promise<void> {
        await this.extrasButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillContactDetails(data: BookerData): Promise<void> {
        await this.emailField.fill(data.email);
        await this.firstNameField.fill(data.firstName);
        await this.lastNameField.fill(data.lastName);
        await this.phoneField.fill(data.phone);
    }

    async fillBookerDetails(data: BookerData): Promise<void> {
        await this.bookerFirstNameField.fill(data.firstName);
        await this.bookerLastNameField.fill(data.lastName);
        await this.bookerPhoneField.fill(data.phone);
    }

    async fillBillingAddress(data: BillingData): Promise<void> {
        await this.billingAddressField.fill(data.address);
        await this.billingCityField.fill(data.city);
        await this.billingPostcodeField.fill(data.postcode);
    }

    async selectGooglePay(): Promise<void> {
        await this.paymentFrame.getByTestId('GOOGLE_PAY_DI').first().click();
    }
}
