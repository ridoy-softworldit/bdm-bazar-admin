import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseURL = process.env.NEXT_PUBLIC_BASE_API;

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    
    if (!token) {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      if (session?.user?.accessToken) {
        headers.set("authorization", session.user.accessToken as string);
      } else {
      }
    } else {
      headers.set("authorization", token);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "Review",
    "Category",
    "Tag",
    "Settings",
    "Product",
    " User",
    "ParentCategory",
    "Footer",
    "DynamicPage",
  ],
});
