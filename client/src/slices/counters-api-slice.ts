import { apiSlice } from "./api-slice";
import { API_BASE_URL } from '../utils/api-config';


// const USERS = `${API_BASE_URL}/api/users`
// const USERS = `${API_BASE_URL}/users`
const COUNTERS = "/counters"

export interface Counter {
    _id: string;
    name: string;
    description: string;
    count: number;
    public_key: string;
    createdAt: string;
}


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCounter: builder.mutation({
            query: (data) => ({
                url: `${COUNTERS}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Counters"],
        }),
        // keyed by the signed-in user's id so one account never sees another's cached counters
        fetchUserCounters: builder.query<{ counters: Counter[] }, string>({
            query: () => ({
                url: `${COUNTERS}`,
                method: "GET",
            }),
            providesTags: ["Counters"],
        }),
        deleteCounter: builder.mutation({
            query: (id) => ({
                url: `${COUNTERS}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Counters"],
        }),
        updateCounter: builder.mutation({
            query: (data) => ({
                url: `${COUNTERS}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Counters"],
        }),
        resetCounter: builder.mutation({
            query: (id) => ({
                url: `${COUNTERS}/${id}/reset`,
                method: "POST"
            }),
            invalidatesTags: ["Counters"],
        }),
        fetchCurrentCount: builder.mutation({
            query: (public_key) => ({
                url: `${COUNTERS}/public/${public_key}`,
                method: "GET",
            })
        }),
        incrementCounter: builder.mutation({
            query: (public_key) => ({
                url: `${COUNTERS}/public/${public_key}`,
                method: "POST",
            })
        }),
        deleteAllCounters: builder.mutation<{ message: string; deletedCount: number }, void>({
            query: () => ({
            url: `${COUNTERS}`,
            method: "DELETE",
            }),
            invalidatesTags: ['Counters'],
        })
    })
})


export const {
    useCreateCounterMutation,
    useFetchUserCountersQuery,
    useDeleteCounterMutation,
    useResetCounterMutation,
    useFetchCurrentCountMutation,
    useIncrementCounterMutation,
    useUpdateCounterMutation,
    useDeleteAllCountersMutation,
} = userApiSlice;


// import { apiSlice } from "./api-slice";
// import { API_BASE_URL } from '../utils/api-config';


// // const USERS = `${API_BASE_URL}/api/users`
// // const USERS = `${API_BASE_URL}/users`
// const COUNTERS = "/counters"

// export const userApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     /**
//      * GET: Fetch all counters for the user
//      * Changed to .query for automatic caching and state management.
//      */
//     fetchUserCounters: builder.query({
//       query: () => ({
//         url: COUNTERS,
//         method: "GET",
//       }),
//       // 'Counters' tag allows this query to be re-run when mutations happen
//       providesTags: ["Counters"],
//     }),

//     /**
//      * POST: Create a new counter
//      */
//     createCounter: builder.mutation({
//       query: (data) => ({
//         url: COUNTERS,
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Counters"],
//     }),

//     /**
//      * DELETE: Remove a counter by ID
//      * Fixed the URL interpolation to send the real ID
//      */
//     deleteCounter: builder.mutation({
//       query: (id) => ({
//         url: `${COUNTERS}/${id}`,
//         method: "DELETE",
//       }),
//       // This triggers fetchUserCounters to run again, removing the item from UI
//       invalidatesTags: ["Counters"],
//     }),

//     /**
//      * POST: Reset counter value
//      */
//     resetCounter: builder.mutation({
//       query: (id) => ({
//         url: `${COUNTERS}/${id}/reset`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Counters"],
//     }),

//     /**
//      * GET: Public fetch for a specific count
//      */
//     fetchCurrentCount: builder.query({
//       query: (public_key) => ({
//         url: `${COUNTERS}/public/${public_key}`,
//         method: "GET",
//       }),
//     }),

//     /**
//      * POST: Increment the counter
//      */
//     incrementCounter: builder.mutation({
//       query: (public_key) => ({
//         url: `${COUNTERS}/public/${public_key}`,
//         method: "POST",
//       }),
//       // We invalidate 'Counters' so the private dashboard also shows the new number
//       invalidatesTags: ["Counters"],
//     }),
//   }),
// });

// export const {
//   useCreateCounterMutation,
//   useFetchUserCountersQuery, // Changed from Mutation to Query
//   useDeleteCounterMutation,
//   useResetCounterMutation,
//   useFetchCurrentCountQuery, // Changed from Mutation to Query
//   useIncrementCounterMutation,
// } = userApiSlice;