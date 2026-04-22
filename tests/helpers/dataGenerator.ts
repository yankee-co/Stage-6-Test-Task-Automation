import { faker } from '@faker-js/faker';

export interface BookerData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface BillingData {
    address: string;
    city: string;
    postcode: string;
}

export interface ObjectPayload {
    name: string;
    data: {
        year: number;
        price: number;
        'CPU model': string;
        'Hard disk size': string;
    };
}

export function generateBookerData(): BookerData {
    return {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.helpers.arrayElement(['50', '63', '66', '67', '68', '73', '93', '95', '96', '97', '98', '99']) + faker.string.numeric(7),
    };
}

export function generateBillingData(): BillingData {
    return {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postcode: faker.location.zipCode(),
    };
}

export function generateObjectPayload(): ObjectPayload {
    return {
        name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
        data: {
            year: faker.number.int({ min: 2020, max: 2025 }),
            price: faker.number.float({ min: 500, max: 3000, fractionDigits: 2 }),
            'CPU model': faker.helpers.arrayElement([
                'Intel Core i5',
                'Intel Core i7',
                'Intel Core i9',
                'AMD Ryzen 7',
                'AMD Ryzen 9',
            ]),
            'Hard disk size': faker.helpers.arrayElement(['256 GB', '512 GB', '1 TB', '2 TB']),
        },
    };
}
