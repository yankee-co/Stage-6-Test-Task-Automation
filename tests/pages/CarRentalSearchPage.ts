import { type Page, type Locator } from '@playwright/test';

export class CarRentalSearchPage {
    private readonly pickUpLocationInput: Locator;
    private readonly searchButton: Locator;
    private readonly signInModalClose: Locator;
    private readonly firstDealButton: Locator;

    constructor(private readonly page: Page) {
        this.pickUpLocationInput = page.getByRole('combobox', { name: 'Pick-up location' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.signInModalClose = page.getByTestId('signin-modal-close');
        this.firstDealButton = page.getByRole('group').getByLabel('View deal').first();
    }

    async goto(): Promise<void> {
        await this.page.goto('/cars/index.en-gb.html');
    }

    async searchLocation(location: string): Promise<void> {
        await this.pickUpLocationInput.pressSequentially(location, { delay: 80 });
    }

    async selectSuggestion(name: string): Promise<void> {
        await this.page.getByRole('option', { name }).click();
    }

    async clickSearch(): Promise<void> {
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async closeSignInModalIfVisible(): Promise<void> {
        if (await this.signInModalClose.isVisible()) {
            await this.signInModalClose.click();
        }
    }

    async openFirstDeal(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.firstDealButton.click(),
        ]);
        await newPage.waitForLoadState('networkidle');
        return newPage;
    }
}
