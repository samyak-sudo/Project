import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(logger),
  // DevTools is automatically enabled in development
})

export const setupStore = preloadedState => {
    return configureStore({
      reducer: rootReducer,
      preloadedState
    })
  }
export default store