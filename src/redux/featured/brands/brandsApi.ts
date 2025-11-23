import { baseApi } from "@/redux/api/baseApi";
import { IBrand } from "@/types/brands";

const brandsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllbrands: builder.query<IBrand[], void>({
      query: () => ({
        url: "/brand",
        method: "GET",
      }),
      transformResponse: (response: { data: IBrand[] }) => response.data,
    }),
    getSingleBrands: builder.query<IBrand, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
    }),
    createBrand: builder.mutation<IBrand, FormData>({
      query: (formData) => ({
        url: "/brand/create-brand",
        method: "POST",
        body: formData,
      }),
      // transformResponse: (response: { data: IBrand }) => response.data,
    }),
    updateBrand: builder.mutation<IBrand, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/brand/update-brand/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
    }),
  }),
});

export const {
  useGetAllbrandsQuery,
  useCreateBrandMutation,
  useGetSingleBrandsQuery,
  useUpdateBrandMutation,
} = brandsApi;
