import { test, expect } from '@playwright/test';
import { ObjectsApiClient } from './api/ObjectsApiClient';
import { generateObjectPayload } from './helpers/dataGenerator';

test.describe.configure({ mode: 'serial' });

test.describe('API /objects', () => {
    const payload = generateObjectPayload();
    let createdId: string;

    test('GET /objects — returns a non-empty array', async ({ request }) => {
        const client = new ObjectsApiClient(request);
        const { status, body } = await client.getAll();

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
    });

    test('POST /objects — creates a new object', async ({ request }) => {
        const client = new ObjectsApiClient(request);
        const { status, body } = await client.create(payload);

        expect(status).toBe(200);
        expect(body.id).toBeDefined();
        expect(body.name).toBe(payload.name);
        expect((body.data as { price: number }).price).toBe(payload.data.price);

        createdId = body.id;
    });

    test('GET /objects/:id — fetches the created object', async ({ request }) => {
        const client = new ObjectsApiClient(request);
        const { status, body } = await client.getById(createdId);

        expect(status).toBe(200);
        expect(body!.id).toBe(createdId);
        expect(body!.name).toBe(payload.name);
    });

    test('DELETE /objects/:id — removes the object', async ({ request }) => {
        const client = new ObjectsApiClient(request);
        const { status, body } = await client.deleteById(createdId);

        expect(status).toBe(200);
        expect(body.message).toContain(createdId);
    });

    test('GET /objects/:id — returns 404 after deletion', async ({ request }) => {
        const client = new ObjectsApiClient(request);
        const { status } = await client.getById(createdId);

        expect(status).toBe(404);
    });
});
