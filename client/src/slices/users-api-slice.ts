import { apiSlice } from "./api-slice";
import { API_BASE_URL } from '../utils/api-config';


// const USERS = `${API_BASE_URL}/api/users`
// const USERS = `${API_BASE_URL}/users`
const USERS = "/users"


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: `${USERS}`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS}/login`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS}/logout`,
                method: "POST",
            }),
        }),
        fetchUserAccount: builder.mutation({
            query: (data) => ({
                url: `${USERS}/me`,
                method: "GET",
                body: data,
            }),
        }),
        changeUserPassword: builder.mutation({
            query: (data) => ({
                url: `${USERS}`,
                method: "PUT",
                body: data,
            }),
        }),
        deactivateUserAccount: builder.mutation({
            query: (data) => ({
                url: `${USERS}/deactivate`,
                method: "POST",
                body: data,
            }),
        }),
        checkEmailAvailability: builder.mutation({
            query: (email) => ({
                url: `${USERS}/check-email/${email}`,
                method: "GET",
            }),
        }),
    })
})


export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useChangeUserPasswordMutation,
    useDeactivateUserAccountMutation,
    useCheckEmailAvailabilityMutation,
    useFetchUserAccountMutation,
} = userApiSlice;