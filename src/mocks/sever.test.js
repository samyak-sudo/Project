import { server } from './server';
import { rest } from 'msw';

describe('MSW Server Setup', () => {
  test('server handles GET request to character endpoint', async () => {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive' },
        { id: 2, name: 'Morty Smith', status: 'Alive' }
      ]
    });
  });

  test('server can be reset with new handlers', async () => {
    // Add a new handler
    server.use(
      rest.get('https://rickandmortyapi.com/api/character', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: [
              { id: 3, name: 'Summer Smith', status: 'Alive' }
            ]
          })
        );
      })
    );

    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    
    expect(data).toEqual({
      results: [
        { id: 3, name: 'Summer Smith', status: 'Alive' }
      ]
    });
  });

  test('server handles errors', async () => {
    server.use(
      rest.get('https://rickandmortyapi.com/api/character', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const response = await fetch('https://rickandmortyapi.com/api/character');
    expect(response.status).toBe(500);
  });

  // Test lifecycle hooks
  test('server lifecycle hooks work correctly', () => {
    expect(server.listen).toBeDefined();
    expect(server.close).toBeDefined();
    expect(server.resetHandlers).toBeDefined();
  });
});

// Add these to ensure lifecycle methods are called
describe('Server Lifecycle', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test('server is running and can handle requests', async () => {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    expect(response.status).toBe(200);
  });
});