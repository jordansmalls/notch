import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../utils/api-config';

// Define the base query function
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['UserUrls'],
  endpoints: (builder) => ({
  }),
});