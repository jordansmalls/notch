import { apiSlice } from "./api-slice";
import { API_BASE_URL } from '../utils/api-config';
import { logout } from "./auth-slice";


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
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout())
                } catch (err) {
                    console.error("Logout failed:", err);
                }
            }
        }),
        fetchUserAccount: builder.mutation({
            query: (data) => ({
                url: `${USERS}/me`,
                method: "GET",
                body: data,
            }),
        }),
        changeUserPassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
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
        // keyed by the signed-in user's id, like the counters list
        fetchUsage: builder.query<{ month: string; requests: number }, string>({
            query: () => ({
                url: `${USERS}/usage`,
                method: "GET",
            }),
        }),
        checkEmailAvailability: builder.mutation({
            query: (email) => ({
                url: `${USERS}/check-email/${email}`,
                method: "GET",
            }),
        }),
        deleteUserAccount: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: `${USERS}`,
                method: "DELETE"
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout())
                } catch (err) {
                    console.error("Account deletion/cleanup failed:", err)
                }
            }
        })
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
    useFetchUsageQuery,
    useDeleteUserAccountMutation,
} = userApiSlice;