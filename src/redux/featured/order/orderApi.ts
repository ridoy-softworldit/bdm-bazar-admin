// import { baseApi } from "@/redux/api/baseApi";
// import { Order } from "@/types/Order";
// import { OrderSummary } from "@/types/Order";

// const orderApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllOrders: builder.query<Order[], void>({
//       query: () => ({
//         url: "/order",
//         method: "GET",
//       }),
//       transformResponse: (response: { data: Order[] }) => response.data,
//     }),
//     getSingleOrder: builder.query<Order, string>({
//       query: (id) => ({
//         url: `/order/${id}`,
//         method: "GET",
//       }),
//       transformResponse: (response: { data: Order }) => response.data,
//     }),
//     getOrderSummary: builder.query<OrderSummary, void>({
//       query: () => {
//         return {
//           url: "/order/order-summary",
//           method: "GET",
//         };
//       },
//       transformResponse: (response: { data: OrderSummary }) => response.data,
//     }),

//     createOrder: builder.mutation<Order, Partial<Order>>({
//       query: (newOrder) => ({
//         url: "/order/create-order",
//         method: "POST",
//         body: newOrder,
//       }),
//       transformResponse: (response: { data: Order }) => response.data,
//     }),
//     getOrderRangeSummary: builder.query<
//       OrderSummary & { dateRange: { start: string; end: string } },
//       { start: string; end: string }
//     >({
//       query: ({ start, end }) => ({
//         url: "/order/order-range-summary",
//         method: "GET",
//         params: { start, end },
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//   }),
// });

// export const {
//   useGetAllOrdersQuery,
//   useGetSingleOrderQuery,
//   useCreateOrderMutation,
//   useGetOrderSummaryQuery,
//   useGetOrderRangeSummaryQuery,
// } = orderApi;

// src/redux/featured/order/orderApi.ts

import { baseApi } from "@/redux/api/baseApi";
import { Order } from "@/types/Order";
import { OrderSummary } from "@/types/Order";

// Model অনুযায়ী valid status
const VALID_STATUSES = [
  "pending",
  "processing",
  "at-local-facility",
  "out-for-delivery",
  "completed",
  "cancelled",
] as const;

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Orders
    getAllOrders: builder.query<Order[], void>({
      query: () => ({
        url: "/order",
        method: "GET",
      }),
      transformResponse: (response: { data: Order[] }) => response.data,
    }),

    // Get Single Order
    getSingleOrder: builder.query<Order, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Order }) => response.data,
    }),

    // Get Order Summary
    getOrderSummary: builder.query<OrderSummary, void>({
      query: () => ({
        url: "/order/order-summary",
        method: "GET",
      }),
      transformResponse: (response: { data: OrderSummary }) => response.data,
    }),

    // Create Order
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (newOrder) => ({
        url: "/order/create-order",
        method: "POST",
        body: newOrder,
      }),
      transformResponse: (response: { data: Order }) => response.data,
    }),

    // Get Order Range Summary
    getOrderRangeSummary: builder.query<
      OrderSummary & { dateRange: { start: string; end: string } },
      { start: string; end: string }
    >({
      query: ({ start, end }) => ({
        url: "/order/order-range-summary",
        method: "GET",
        params: { start, end },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    // Update Order Status (PATCH)
    updateOrderStatus: builder.mutation<
      void,
      { orderId: string; status: (typeof VALID_STATUSES)[number] }
    >({
      query: ({ orderId, status }) => ({
        url: `/order/change-status/${orderId}`,
        method: "PATCH",
        body: { status },
      }),

      // Optimistic Update
      async onQueryStarted({ orderId, status }, { dispatch, queryFulfilled }) {
        // Patch for getAllOrders
        const patchAll = dispatch(
          orderApi.util.updateQueryData("getAllOrders", undefined, (draft) => {
            const order = draft.find((o) => o._id === orderId);
            if (order) {
              order.orderInfo.forEach((info) => {
                info.status = status;
              });
            }
          })
        );

        // Patch for getSingleOrder (if cached)
        const patchSingle = dispatch(
          orderApi.util.updateQueryData("getSingleOrder", orderId, (draft) => {
            draft.orderInfo.forEach((info) => {
              info.status = status;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchAll.undo();
          patchSingle.undo();
        }
      },
    }),
  }),
});

// Export Hooks
export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useGetOrderSummaryQuery,
  useCreateOrderMutation,
  useGetOrderRangeSummaryQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
