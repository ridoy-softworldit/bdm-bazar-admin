// "use client";
// import { useState, useEffect } from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import {
//   CircleChevronUp,
//   CircleChevronDown,
//   ChevronDown,
//   Search,
//   Calendar,
// } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { useGetAllOrdersQuery } from "@/redux/featured/order/orderApi";

// type OrderStatus =
//   | "Pending"
//   | "Confirmed"
//   | "Processing"
//   | "Picked"
//   | "Shipped"
//   | "Delivered"
//   | "Cancelled";

// type Order = {
//   order_id: string;
//   created: string;
//   createdDate: Date; // নতুন: ফিল্টারের জন্য Date অবজেক্ট
//   customer: string;
//   total: number;
//   profit: number;
//   profit_percent: number;
//   status: OrderStatus;
// };

// const ORDER_STATUSES: OrderStatus[] = [
//   "Pending",
//   "Confirmed",
//   "Processing",
//   "Picked",
//   "Shipped",
//   "Delivered",
//   "Cancelled",
// ];

// const OrderPage = () => {
//   const { data: orderData = [] } = useGetAllOrdersQuery();
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
//   const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
//   const [searchValue, setSearchValue] = useState("");

//   // নতুন: Date Range Filter
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [ordersByStatus, setOrdersByStatus] = useState<
//     Record<OrderStatus, Order[]>
//   >({
//     Pending: [],
//     Confirmed: [],
//     Processing: [],
//     Picked: [],
//     Shipped: [],
//     Delivered: [],
//     Cancelled: [],
//   });

//   useEffect(() => {
//     if (!orderData || orderData.length === 0) return;

//     const transformOrder = (raw: any): Order => ({
//       order_id: raw._id,
//       created: new Date(raw.createdAt).toLocaleString(),
//       createdDate: new Date(raw.createdAt), // ফিল্টারের জন্য
//       customer:
//         `${raw.customerInfo.firstName} ${raw.customerInfo.lastName}` ||
//         "Unknown",
//       total: raw.totalAmount || 0,
//       profit: raw.orderInfo?.profit || 0,
//       profit_percent: raw.orderInfo?.profitPercent || 0,
//       status: raw.orderInfo?.status || "Pending",
//     });

//     const transformed = orderData.map(transformOrder);

//     const grouped: Record<OrderStatus, Order[]> = {
//       Pending: [],
//       Confirmed: [],
//       Processing: [],
//       Picked: [],
//       Shipped: [],
//       Delivered: [],
//       Cancelled: [],
//     };

//     transformed.forEach((order) => {
//       if (ORDER_STATUSES.includes(order.status))
//         grouped[order.status].push(order);
//       else grouped["Pending"].push(order);
//     });

//     setOrdersByStatus(grouped);
//     setCurrentOrders(grouped["Pending"]);
//   }, [orderData]);

//   // নতুন: ফিল্টারিং ফাংশন
//   const applyFilters = (orders: Order[]) => {
//     return orders
//       .filter((item) =>
//         item.order_id.toLowerCase().includes(searchValue.toLowerCase())
//       )
//       .filter((item) => {
//         if (!startDate && !endDate) return true;
//         const orderDate = item.createdDate;
//         const start = startDate ? new Date(startDate) : null;
//         const end = endDate ? new Date(endDate) : null;

//         if (start && end) {
//           return (
//             orderDate >= start &&
//             orderDate <= new Date(end.setHours(23, 59, 59, 999))
//           );
//         }
//         if (start) return orderDate >= start;
//         if (end) return orderDate <= new Date(end.setHours(23, 59, 59, 999));
//         return true;
//       });
//   };

//   // ট্যাব চেঞ্জ হলে ফিল্টার প্রয়োগ
//   useEffect(() => {
//     const filtered = applyFilters(ordersByStatus[activeTab] || []);
//     setCurrentOrders(filtered);
//   }, [activeTab, ordersByStatus, searchValue, startDate, endDate]);

//   const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
//     const currentStatus = Object.keys(ordersByStatus).find((status) =>
//       ordersByStatus[status as OrderStatus].some((o) => o.order_id === orderId)
//     ) as OrderStatus;

//     if (!currentStatus || newStatus === currentStatus) return;

//     const updatedOrder = ordersByStatus[currentStatus].find(
//       (o) => o.order_id === orderId
//     );
//     if (!updatedOrder) return;

//     const newOrder = { ...updatedOrder, status: newStatus };

//     const updatedOrdersByStatus = {
//       ...ordersByStatus,
//       [currentStatus]: ordersByStatus[currentStatus].filter(
//         (o) => o.order_id !== orderId
//       ),
//       [newStatus]: [newOrder, ...ordersByStatus[newStatus]],
//     };

//     setOrdersByStatus(updatedOrdersByStatus);
//     setActiveTab(newStatus);
//     setExpandedOrder(null);
//   };

//   // Clear Filter
//   const clearDateFilter = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
//         <div className="relative w-full sm:w-1/3 bg-white">
//           <input
//             type="text"
//             placeholder="Search by order id"
//             className="w-full rounded-md px-4 py-2 text-sm"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//           />
//           <Search
//             size={18}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
//           />
//         </div>

//         {/* নতুন: Date Range Filter */}
//         {/* <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 text-sm border border-gray-300"
//             />
//             <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//           <span className="text-gray-500">to</span>
//           <div className="relative">
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 text-sm border border-gray-300"
//             />
//             <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//           {(startDate || endDate) && (
//             <button
//               onClick={clearDateFilter}
//               className="text-xs text-red-600 hover:text-red-800 underline"
//             >
//               Clear
//             </button>
//           )}
//         </div> */}
//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
//             />
//             {/* <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             /> */}
//           </div>
//           <span className="text-gray-500">to</span>
//           <div className="relative">
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
//             />
//             {/* <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             /> */}
//           </div>
//           {(startDate || endDate) && (
//             <button
//               onClick={clearDateFilter}
//               className="text-xs text-red-600 hover:text-red-800 underline"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       <Tabs.Root
//         value={activeTab}
//         onValueChange={(val) => setActiveTab(val as OrderStatus)}
//       >
//         <Tabs.List className="flex overflow-x-auto">
//           {ORDER_STATUSES.map((status) => (
//             <Tabs.Trigger
//               key={status}
//               value={status}
//               className="flex-1 h-[45px] px-4 bg-white text-sm text-center hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-2 data-[state=active]:border-violet-500"
//             >
//               {status} ({applyFilters(ordersByStatus[status] || []).length})
//             </Tabs.Trigger>
//           ))}
//         </Tabs.List>

//         {ORDER_STATUSES.map((status) => (
//           <Tabs.Content
//             key={status}
//             value={status}
//             className="grow bg-white p-5 rounded-b-md"
//           >
//             <div className="overflow-x-auto">
//               <Table className="min-w-[678px]">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-gray-400"></TableHead>
//                     <TableHead className="text-gray-400">ORDER ID</TableHead>
//                     <TableHead className="text-gray-400">CREATED</TableHead>
//                     <TableHead className="text-gray-400">CUSTOMER</TableHead>
//                     <TableHead className="text-gray-400">TOTAL</TableHead>
//                     <TableHead className="text-gray-400">PROFIT</TableHead>
//                     <TableHead className="text-gray-400">STATUS</TableHead>
//                     <TableHead />
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentOrders.map((item) => (
//                     <TableRow key={item.order_id}>
//                       <TableCell className="text-center">
//                         <button
//                           className="rounded-full border p-1 text-gray-500"
//                           onClick={() =>
//                             setExpandedOrder(
//                               expandedOrder === item.order_id
//                                 ? null
//                                 : item.order_id
//                             )
//                           }
//                         >
//                           {expandedOrder === item.order_id ? (
//                             <CircleChevronUp />
//                           ) : (
//                             <CircleChevronDown />
//                           )}
//                         </button>
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {item.order_id}
//                       </TableCell>
//                       <TableCell>{item.created}</TableCell>
//                       <TableCell>{item.customer}</TableCell>
//                       <TableCell>৳{item.total}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <span>৳{item.profit}</span>
//                           <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-md font-semibold">
//                             {item.profit_percent}%
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <button
//                               className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
//                                 item.status === "Pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : item.status === "Confirmed"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : item.status === "Processing"
//                                   ? "bg-purple-100 text-purple-800"
//                                   : item.status === "Picked"
//                                   ? "bg-indigo-100 text-indigo-800"
//                                   : item.status === "Shipped"
//                                   ? "bg-cyan-100 text-cyan-800"
//                                   : item.status === "Delivered"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}
//                             >
//                               {item.status}
//                             </button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent>
//                             {ORDER_STATUSES.map((statusOption) => (
//                               <DropdownMenuItem
//                                 key={statusOption}
//                                 onSelect={() =>
//                                   handleStatusChange(
//                                     item.order_id,
//                                     statusOption
//                                   )
//                                 }
//                               >
//                                 {statusOption}
//                               </DropdownMenuItem>
//                             ))}
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </Tabs.Content>
//         ))}
//       </Tabs.Root>

//       {/* বাকি মডাল কোড অপরিবর্তিত */}
//       {expandedOrder && (
//         <div className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50">
//           <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setExpandedOrder(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               ✕
//             </button>

//             {(() => {
//               const rawOrder = orderData.find(
//                 (o: any) => o._id === expandedOrder
//               );
//               if (!rawOrder) return <p>Order not found.</p>;

//               return (
//                 <div className="space-y-6">
//                   <div className="flex flex-col sm:flex-row justify-between items-center">
//                     <h2 className="text-xl font-semibold">
//                       Order <span className="font-bold">{rawOrder._id}</span>
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {new Date(rawOrder.createdAt).toLocaleString()}
//                     </p>
//                   </div>

//                   <div className="flex flex-col sm:flex-row justify-between gap-6">
//                     <div className="bg-[#F3F4F6] sm:w-2/3 p-4 rounded-lg shadow-sm">
//                       <h3 className="font-medium mb-2">Customer Information</h3>
//                       <div className="text-sm space-y-1">
//                         <p>
//                           <span className="font-semibold">Name:</span>{" "}
//                           {rawOrder.customerInfo.firstName}{" "}
//                           {rawOrder.customerInfo.lastName}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Email:</span>{" "}
//                           {rawOrder.customerInfo.email}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Phone:</span>{" "}
//                           {rawOrder.customerInfo.phone}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Address:</span>{" "}
//                           {rawOrder.customerInfo.address},{" "}
//                           {rawOrder.customerInfo.city},{" "}
//                           {rawOrder.customerInfo.postalCode},{" "}
//                           {rawOrder.customerInfo.country}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="bg-[#F3F4F6] sm:w-1/3 p-4 rounded-lg shadow-sm">
//                       <h3 className="font-medium mb-2">Payment</h3>
//                       <div className="text-sm space-y-1">
//                         <p>
//                           <span className="font-semibold">Method:</span>{" "}
//                           {rawOrder.paymentInfo}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Total:</span> ৳
//                           {rawOrder.totalAmount}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
//                     <h3 className="font-medium mb-2">Order Items</h3>
//                     <div className="overflow-x-auto">
//                       <Table className="min-w-[600px]">
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Product</TableHead>
//                             <TableHead>Tracking</TableHead>
//                             <TableHead>Quantity</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead>Total</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {(rawOrder.orderInfo || []).map(
//                             (item: any, idx: number) => (
//                               <TableRow key={idx}>
//                                 <TableCell>
//                                   {item.productInfo || "N/A"}
//                                 </TableCell>
//                                 <TableCell>
//                                   {item.trackingNumber || "—"}
//                                 </TableCell>
//                                 <TableCell>{item.quantity}</TableCell>
//                                 <TableCell className="capitalize">
//                                   {item.status}
//                                 </TableCell>
//                                 <TableCell>
//                                   ৳{item.totalAmount?.total || 0}
//                                 </TableCell>
//                               </TableRow>
//                             )
//                           )}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })()}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderPage;

"use client";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CircleChevronUp,
  CircleChevronDown,
  Search,
  Calendar,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/featured/order/orderApi";
import { useGetSingleProductQuery } from "@/redux/featured/products/productsApi";

// Model অনুযায়ী Status
const ORDER_STATUSES = [
  "pending",
  "processing",
  "at-local-facility",
  "out-for-delivery",
  "completed",
  "cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type Order = {
  order_id: string;
  created: string;
  createdDate: Date;
  customer: string;
  total: number;
  profit: number;
  profit_percent: number;
  status: OrderStatus;
};

// Helper: Capitalize & format status
const formatStatus = (status: string) =>
  status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Helper: Status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "at-local-facility":
      return "bg-indigo-100 text-indigo-800";
    case "out-for-delivery":
      return "bg-cyan-100 text-cyan-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Component to fetch and display product name
const ProductName = ({ productId }: { productId: string }) => {
  const { data: product } = useGetSingleProductQuery(productId);
  return <span>{product?.description?.name || "Loading..."}</span>;
};

const OrderPage = () => {
  const { data: orderData = [] } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [ordersByStatus, setOrdersByStatus] = useState<
    Record<OrderStatus, Order[]>
  >({
    pending: [],
    processing: [],
    "at-local-facility": [],
    "out-for-delivery": [],
    completed: [],
    cancelled: [],
  });

  // Transform & Group Orders
  useEffect(() => {
    if (!orderData || orderData.length === 0) return;

    const transformOrder = (raw: any): Order => ({
      order_id: raw._id,
      created: new Date(raw.createdAt).toLocaleString(),
      createdDate: new Date(raw.createdAt),
      customer:
        `${raw.customerInfo.firstName} ${raw.customerInfo.lastName}` ||
        "Unknown",
      total: raw.totalAmount || 0,
      profit: raw.orderInfo?.[0]?.profit || 0,
      profit_percent: raw.orderInfo?.[0]?.profitPercent || 0,
      status: (raw.orderInfo?.[0]?.status || "pending") as OrderStatus,
    });

    const transformed = orderData.map(transformOrder);

    const grouped: Record<OrderStatus, Order[]> = {
      pending: [],
      processing: [],
      "at-local-facility": [],
      "out-for-delivery": [],
      completed: [],
      cancelled: [],
    };

    transformed.forEach((order) => {
      if (ORDER_STATUSES.includes(order.status)) {
        grouped[order.status].push(order);
      } else {
        grouped.pending.push(order);
      }
    });

    setOrdersByStatus(grouped);
    setCurrentOrders(grouped[activeTab]);
  }, [orderData, activeTab]);

  // Apply Filters
  const applyFilters = (orders: Order[]) => {
    return orders
      .filter((item) =>
        item.order_id.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((item) => {
        if (!startDate && !endDate) return true;
        const orderDate = item.createdDate;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return (
            orderDate >= start &&
            orderDate <= new Date(end.setHours(23, 59, 59, 999))
          );
        }
        if (start) return orderDate >= start;
        if (end) return orderDate <= new Date(end.setHours(23, 59, 59, 999));
        return true;
      });
  };

  // Update filtered orders when tab/filter changes
  useEffect(() => {
    const filtered = applyFilters(ordersByStatus[activeTab] || []);
    setCurrentOrders(filtered);
  }, [activeTab, ordersByStatus, searchValue, startDate, endDate]);

  // Handle Status Change
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    const currentStatus = Object.keys(ordersByStatus).find((status) =>
      ordersByStatus[status as OrderStatus].some((o) => o.order_id === orderId)
    ) as OrderStatus;

    if (!currentStatus || newStatus === currentStatus) return;

    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();

      const order = ordersByStatus[currentStatus].find(
        (o) => o.order_id === orderId
      );
      if (!order) return;

      const updatedOrder = { ...order, status: newStatus };

      setOrdersByStatus((prev) => ({
        ...prev,
        [currentStatus]: prev[currentStatus].filter(
          (o) => o.order_id !== orderId
        ),
        [newStatus]: [updatedOrder, ...prev[newStatus]],
      }));

      setActiveTab(newStatus);
      setExpandedOrder(null);
    } catch (error) {
      alert("Failed to update status. Please try again.");
    }
  };

  // Clear Date Filter
  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      {/* Search + Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
        <div className="relative w-full sm:w-1/3 bg-white">
          <input
            type="text"
            placeholder="Search by order id"
            className="w-full rounded-md px-4 py-2 text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={clearDateFilter}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as OrderStatus)}
      >
        <Tabs.List className="flex overflow-x-auto">
          {ORDER_STATUSES.map((status) => (
            <Tabs.Trigger
              key={status}
              value={status}
              className="flex-1 h-[45px] px-4 bg-white text-sm text-center hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-2 data-[state=active]:border-violet-500"
            >
              {formatStatus(status)} (
              {applyFilters(ordersByStatus[status] || []).length})
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {ORDER_STATUSES.map((status) => (
          <Tabs.Content
            key={status}
            value={status}
            className="grow bg-white p-5 rounded-b-md"
          >
            <div className="overflow-x-auto">
              <Table className="min-w-[678px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400"></TableHead>
                    <TableHead className="text-gray-400">ORDER ID</TableHead>
                    <TableHead className="text-gray-400">CREATED</TableHead>
                    <TableHead className="text-gray-400">CUSTOMER</TableHead>
                    <TableHead className="text-gray-400">TOTAL</TableHead>
                    <TableHead className="text-gray-400">PROFIT</TableHead>
                    <TableHead className="text-gray-400">STATUS</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((item) => (
                    <TableRow key={item.order_id}>
                      <TableCell className="text-center">
                        <button
                          className="rounded-full border p-1 text-gray-500"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === item.order_id
                                ? null
                                : item.order_id
                            )
                          }
                        >
                          {expandedOrder === item.order_id ? (
                            <CircleChevronUp />
                          ) : (
                            <CircleChevronDown />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.order_id}
                      </TableCell>
                      <TableCell>{item.created}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>৳{item.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>৳{item.profit}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-md font-semibold">
                            {item.profit_percent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {formatStatus(item.status)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {ORDER_STATUSES.map((statusOption) => (
                              <DropdownMenuItem
                                key={statusOption}
                                onSelect={() =>
                                  handleStatusChange(
                                    item.order_id,
                                    statusOption
                                  )
                                }
                              >
                                {formatStatus(statusOption)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      {/* Expanded Order Modal */}
      {expandedOrder && (
        <div className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setExpandedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              X
            </button>

            {(() => {
              const rawOrder = orderData.find(
                (o: any) => o._id === expandedOrder
              );
              if (!rawOrder) return <p>Order not found.</p>;

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Order <span className="font-bold">{rawOrder._id}</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(rawOrder.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="bg-[#F3F4F6] sm:w-2/3 p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-2">Customer Information</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {rawOrder.customerInfo.firstName}{" "}
                          {rawOrder.customerInfo.lastName}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {rawOrder.customerInfo.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {rawOrder.customerInfo.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {rawOrder.customerInfo.address},{" "}
                          {rawOrder.customerInfo.city},{" "}
                          {rawOrder.customerInfo.postalCode},{" "}
                          {rawOrder.customerInfo.country}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F3F4F6] sm:w-1/3 p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-2">Payment</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Method:</span>{" "}
                          {typeof rawOrder.paymentInfo === "string"
                            ? rawOrder.paymentInfo
                            : "Card"}
                        </p>
                        <p>
                          <span className="font-semibold">Total:</span> ৳
                          {rawOrder.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Tracking</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(rawOrder.orderInfo || []).map(
                            (item: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  {typeof item.productInfo === 'string' ? (
                                    <ProductName productId={item.productInfo} />
                                  ) : (
                                    item.productInfo?.description?.name || "N/A"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {item.trackingNumber || "—"}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                                      item.status
                                    )}`}
                                  >
                                    {formatStatus(item.status)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  ৳{item.totalAmount?.total || 0}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPage;
