import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth-slice"
import { apiSlice } from './slices/api-slice';
import { setupListeners } from '@reduxjs/toolkit/query';
import optimisticCountersReducer from './slices/optimistic-counters-slice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    optimisticCounters: optimisticCountersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;
