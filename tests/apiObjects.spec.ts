import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.restful-api.dev/objects';
const HEADERS = { 'Accept': 'application/json', 'Content-Type': 'application/json' };

test.describe.configure({ mode: 'serial' });

test.describe('API /objects', () => {

    test('GET /objects — returns a non-empty array', async ({ request }) => {
        const response = await request.get(BASE_URL, { headers: HEADERS });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
    });

    test('POST → GET → DELETE lifecycle', async ({ request }) => {
        const payload = {
            name: 'Test Laptop',
            data: {
                year: 2024,
                price: 1299.99,
                'CPU model': 'Intel Core i9',
                'Hard disk size': '1 TB',
            },
        };

        // POST — create object
        const createResponse = await request.post(BASE_URL, { data: payload, headers: HEADERS });
        expect(createResponse.status()).toBe(200);

        const created = await createResponse.json();
        expect(created.id).toBeDefined();
        expect(created.name).toBe(payload.name);
        expect(created.data.price).toBe(payload.data.price);

        const id = created.id;

        // GET — verify created object exists
        const getResponse = await request.get(`${BASE_URL}/${id}`, { headers: HEADERS });
        expect(getResponse.status()).toBe(200);

        const fetched = await getResponse.json();
        expect(fetched.id).toBe(id);
        expect(fetched.name).toBe(payload.name);

        // DELETE — remove object
        const deleteResponse = await request.delete(`${BASE_URL}/${id}`, { headers: HEADERS });
        expect(deleteResponse.status()).toBe(200);

        const deleteBody = await deleteResponse.json();
        expect(deleteBody.message).toContain(id);

        // GET — verify object no longer exists
        const getAfterDelete = await request.get(`${BASE_URL}/${id}`, { headers: HEADERS });
        expect(getAfterDelete.status()).toBe(404);
    });

});
