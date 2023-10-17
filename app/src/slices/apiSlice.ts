import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // Fill in your own server starting URL here
    baseUrl: '/'
  }),
  endpoints: (builder) => ({
    // fetch acls from server
    getACLs: builder.query<any, any>({
      query: (params) => {
        return {
          url: '/admin-ng/acl/acls.json',
          params: params
        }
      }
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetACLsQuery } = api
