// import { setupServer } from 'msw/node';

// import { rest } from 'msw';

// export const server = setupServer(
//     rest.get('https://rickandmortyapi.com/api/character', (req, res, ctx) => {
//         return res(
//             ctx.status(200),
//             ctx.json({
//                 results: [
//                     { id: 1, name: 'Rick Sanchez', status: 'Alive' },
//                     { id: 2, name: 'Morty Smith', status: 'Alive' }
//                 ]
//             })
//         );
//     })
// );

// // Export these functions so they can be tested
// export const setupTests = () => {
//     beforeAll(() => server.listen());
//     afterEach(() => server.resetHandlers());
//     afterAll(() => server.close());
// };

// // Call the setup
// setupTests();

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw'; // Updated import for MSW v2

export const server = setupServer(
    http.get('https://rickandmortyapi.com/api/character', () => {
        return HttpResponse.json({
            results: [
                { id: 1, name: 'Rick Sanchez', status: 'Alive' },
                { id: 2, name: 'Morty Smith', status: 'Alive' }
            ]
        });
    })
);

export const setupTests = () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
};

setupTests();