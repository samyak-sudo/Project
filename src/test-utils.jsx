// import React from 'react'
// import { render } from '@testing-library/react'
// import { Provider } from 'react-redux'
// import { BrowserRouter } from 'react-router-dom'
// import { configureStore } from '@reduxjs/toolkit'
// // Import your reducers here
// // import characterReducer from './redux/features/characterSlice'

// export function renderWithProviders(
//   ui,
//   {
//     preloadedState = {},
//     store = configureStore({
//       reducer: {
//         // character: characterReducer,
//         // Add other reducers here
//       },
//       preloadedState
//     }),
//     ...renderOptions
//   } = {}
// ) {
//   function Wrapper({ children }) {
//     return (
//       <Provider store={store}>
//         <BrowserRouter>
//           {children}
//         </BrowserRouter>
//       </Provider>
//     )
//   }

//   return render(ui, { wrapper: Wrapper, ...renderOptions })
// }



import React from 'react'
import '@testing-library/jest-dom'


import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import characterReducer from './redux/character/characterReducer'
import searchReducer from './redux/search/searchReducer'


export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        character: characterReducer,
        search: searchReducer
      },
      preloadedState
    }),
    initialRoute = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        {/* <MemoryRouter initialEntries={[initialRoute]}> */}
          {children}
        {/* </MemoryRouter> */}
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}