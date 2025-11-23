// In your reviewsApi file
import { baseApi } from "@/redux/api/baseApi";
import { Review } from "@/types/Reviews";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<Review[], void>({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      transformResponse: (response: { data: Review[] }) => response.data,
      providesTags: ["Review"],
    }),
    getSingleReview: builder.query<Review, string>({
      query: (id) => ({
        url: `/review/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Review }) => response.data,
    }),
    createReview: builder.mutation<Review, Partial<Review>>({
      query: (review) => ({
        url: "/review/create-review",
        method: "POST",
        body: review,
      }),
    }),
    // Fix: Update the mutation to accept status directly
    updateReviewStatus: builder.mutation<
      { message: string; data: Review }, // Return type should include message
      { id: string; status: "pending" | "approved" | "rejected" } // Correct parameter type
    >({
      query: ({ id, status }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: { status }, // Send status in the body
      }),
      transformResponse: (response: { message: string; data: Review }) =>
        response,
      invalidatesTags: ["Review"],
    }),
    // Fix: সম্পূর্ণ Review আপডেট করার mutation
    updateReview: builder.mutation<
      { message: string; data: Review },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: { message: string; data: Review }) =>
        response,
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { message: string }) => response,
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetSingleReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;
