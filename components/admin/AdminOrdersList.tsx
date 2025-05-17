"use client";
import { useState, useEffect } from "react";
import { 
  ShoppingCart, Clock, Search, Filter, Plus, 
  Check, X, AlertTriangle, Calendar, Package, User, CreditCard, MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProducts } from "@/lib/products-service";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent
} from "@/components/ui/card";

// Define types for order data
type OrderItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  sku?: string;
};

type CustomerInfo = {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  phone?: string;
};

type PaymentInfo = {
  method: "Credit Card" | "PayPal" | "Apple Pay" | "Google Pay";
  status: "Paid" | "Pending" | "Refunded" | "Failed";
  transactionId: string;
};

type ShippingInfo = {
  method: "Standard" | "Express" | "Next Day";
  cost: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
};

type Order = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned" | "On Hold" | "Refunded";
  total: number;
  items: OrderItem[];
  customer: CustomerInfo;
  payment: PaymentInfo;
  shipping: ShippingInfo;
  notes?: string;
};

// Function to calculate order total from items
const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState("all");
  
  // Define more filter options
  const [sortBy, setSortBy] = useState("newest");
  const [perPage, setPerPage] = useState("10");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from Supabase
        const allProducts = await getAllProducts();
        
        if (allProducts.length > 0) {
          // Generate sample customers
          const customers: CustomerInfo[] = [
            {
              id: "cust-1",
              name: "John Smith",
              email: "john.smith@example.com",
              address: "123 Carp Lane",
              city: "London",
              postcode: "SW1A 1AA",
              phone: "07700 900123"
            },
            {
              id: "cust-2",
              name: "Emma Wilson",
              email: "emma.wilson@example.com",
              address: "45 Fishing Road",
              city: "Manchester",
              postcode: "M1 1AA",
              phone: "07700 900456"
            },
            {
              id: "cust-3",
              name: "Michael Brown",
              email: "michael.brown@example.com",
              address: "78 Angler Street",
              city: "Birmingham",
              postcode: "B1 1AA",
              phone: "07700 900789"
            },
            {
              id: "cust-4",
              name: "Sarah Davis",
              email: "sarah.davis@example.com",
              address: "91 Lake View",
              city: "Glasgow",
              postcode: "G1 1AA",
              phone: "07700 900101"
            },
            {
              id: "cust-5",
              name: "David Taylor",
              email: "david.taylor@example.com",
              address: "15 River Close",
              city: "Liverpool",
              postcode: "L1 1AA",
              phone: "07700 900202"
            },
          ];
          
          // Create sample order data
          const sampleOrders: Order[] = [
            {
              id: "ORD-7821",
              date: "14/06/2023",
              status: "Delivered",
              total: 521.00,
              items: [
                {
                  id: allProducts[0]?.id || "item-1",
                  name: "Nash Scope Ops 4 Fold Sleep System MKII",
                  image: allProducts[0]?.images?.[0]?.url,
                  price: 488.00,
                  quantity: 1,
                  sku: "NS-4FBS-001"
                },
                {
                  id: allProducts[1]?.id || "item-2",
                  name: "Nashbait Smoking/Fizzing Stickmix - Monster Shrimp",
                  image: allProducts[1]?.images?.[0]?.url,
                  price: 11.00,
                  quantity: 1,
                  sku: "NB-SFST-MS1"
                },
                {
                  id: allProducts[2]?.id || "item-3",
                  name: "Make It Happen T-Shirt Box Logo",
                  image: allProducts[2]?.images?.[0]?.url,
                  price: 22.00,
                  quantity: 1,
                  sku: "MIH-TS-BL1"
                }
              ],
              customer: customers[0],
              payment: {
                method: "Credit Card",
                status: "Paid",
                transactionId: "txn_12345"
              },
              shipping: {
                method: "Standard",
                cost: 4.99,
                trackingNumber: "RIP12345678UK",
                estimatedDelivery: "16/06/2023"
              }
            },
            {
              id: "ORD-6542",
              date: "23/05/2023",
              status: "Delivered",
              total: 129.97,
              items: allProducts.slice(3, 6).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[1],
              payment: {
                method: "PayPal",
                status: "Paid",
                transactionId: "txn_23456"
              },
              shipping: {
                method: "Express",
                cost: 7.99,
                trackingNumber: "RIP23456789UK",
                estimatedDelivery: "25/05/2023"
              }
            },
            {
              id: "ORD-5433",
              date: "02/04/2023",
              status: "Delivered",
              total: 256.00,
              items: [
                {
                  id: allProducts[3]?.id || "item-4",
                  name: "20kg Bulk Boilie Bait Deal (£8.50 per kilo)",
                  image: allProducts[3]?.images?.[0]?.url,
                  price: 231.00,
                  quantity: 1,
                  sku: "BB-20KG-001"
                },
                {
                  id: allProducts[4]?.id || "item-5",
                  name: "Black Nash Tackle Hoody - Small",
                  image: allProducts[4]?.images?.[0]?.url,
                  price: 25.00,
                  quantity: 1,
                  sku: "NT-HOOD-BLK-S"
                }
              ],
              customer: customers[2],
              payment: {
                method: "Credit Card",
                status: "Paid",
                transactionId: "txn_34567"
              },
              shipping: {
                method: "Standard",
                cost: 4.99,
                trackingNumber: "RIP34567890UK",
                estimatedDelivery: "04/04/2023"
              }
            },
            {
              id: "ORD-4289",
              date: "15/03/2023",
              status: "Cancelled",
              total: 89.99,
              items: allProducts.slice(8, 9).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: 89.99,
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[3],
              payment: {
                method: "Credit Card",
                status: "Refunded",
                transactionId: "txn_45678"
              },
              shipping: {
                method: "Standard",
                cost: 4.99
              },
              notes: "Customer cancelled order due to delivery time"
            },
            {
              id: "ORD-3178",
              date: "28/02/2023",
              status: "Processing",
              total: 76.50,
              items: allProducts.slice(9, 11).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[4],
              payment: {
                method: "Apple Pay",
                status: "Paid",
                transactionId: "txn_56789"
              },
              shipping: {
                method: "Next Day",
                cost: 9.99,
                estimatedDelivery: "01/03/2023"
              }
            },
            // Add a few more recent orders with different statuses
            {
              id: "ORD-9876",
              date: "10/07/2023",
              status: "Processing",
              total: 124.50,
              items: allProducts.slice(0, 2).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[0],
              payment: {
                method: "Credit Card",
                status: "Paid",
                transactionId: "txn_67890"
              },
              shipping: {
                method: "Standard",
                cost: 4.99,
                estimatedDelivery: "13/07/2023"
              }
            },
            {
              id: "ORD-8765",
              date: "05/07/2023",
              status: "Shipped",
              total: 199.98,
              items: allProducts.slice(2, 4).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[1],
              payment: {
                method: "PayPal",
                status: "Paid",
                transactionId: "txn_78901"
              },
              shipping: {
                method: "Express",
                cost: 7.99,
                trackingNumber: "RIP45678901UK",
                estimatedDelivery: "07/07/2023"
              }
            },
            {
              id: "ORD-7654",
              date: "01/07/2023",
              status: "On Hold",
              total: 345.00,
              items: allProducts.slice(4, 7).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[2],
              payment: {
                method: "Credit Card",
                status: "Pending",
                transactionId: "txn_89012"
              },
              shipping: {
                method: "Standard",
                cost: 4.99,
                estimatedDelivery: "05/07/2023"
              },
              notes: "Payment authorization pending"
            }
          ];
          
          setOrders(sampleOrders);
          setFilteredOrders(sampleOrders);
        }
      } catch (error) {
        console.error("Error fetching products for orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Update filtered orders when filters change
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter from tabs
    if (currentTab !== "all") {
      filtered = filtered.filter(order => order.status.toLowerCase() === currentTab.toLowerCase());
    }
    
    // Apply specific status filter (if set)
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = parseDate(order.date);
        
        switch (dateFilter) {
          case "today":
            return isSameDay(orderDate, today);
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return isSameDay(orderDate, yesterday);
          case "last7days":
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 7);
            return orderDate >= last7Days;
          case "last30days":
            const last30Days = new Date(today);
            last30Days.setDate(last30Days.getDate() - 30);
            return orderDate >= last30Days;
          default:
            return true;
        }
      });
    }
    
    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(order => {
        if (paymentFilter === "paid") return order.payment.status === "Paid";
        if (paymentFilter === "pending") return order.payment.status === "Pending";
        if (paymentFilter === "refunded") return order.payment.status === "Refunded";
        return true;
      });
    }
    
    // Apply sorting
    filtered = sortOrders(filtered, sortBy);
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter, paymentFilter, currentTab, sortBy]);
  
  // Helper function to parse UK date (DD/MM/YYYY)
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  // Helper function to sort orders
  const sortOrders = (ordersToSort: Order[], sortOption: string): Order[] => {
    const sorted = [...ordersToSort];
    
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
      case "oldest":
        return sorted.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
      case "highest":
        return sorted.sort((a, b) => b.total - a.total);
      case "lowest":
        return sorted.sort((a, b) => a.total - b.total);
      default:
        return sorted;
    }
  };
  
  // Helper to get status badge color
  const getStatusBadgeStyles = (status: string): string => {
    switch (status) {
      case "Processing": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Shipped": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Returned": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "On Hold": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "Refunded": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  // Helper to get payment status badge color
  const getPaymentBadgeStyles = (status: string): string => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Refunded": return "bg-gray-100 text-gray-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper to get payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Credit Card": return <CreditCard className="h-4 w-4" />;
      case "PayPal": return <div className="text-xs font-bold text-blue-600">P</div>;
      case "Apple Pay": return <div className="text-xs font-bold">A</div>;
      case "Google Pay": return <div className="text-xs font-bold">G</div>;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };
  
  // Calculate stats
  const totalOrders = orders.length;
  const processingOrders = orders.filter(order => order.status === "Processing").length;
  const shippedOrders = orders.filter(order => order.status === "Shipped").length;
  const deliveredOrders = orders.filter(order => order.status === "Delivered").length;
  const cancelledOrders = orders.filter(order => order.status === "Cancelled").length;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="text-2xl font-bold">{processingOrders}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Shipped</p>
                <p className="text-2xl font-bold">{shippedOrders}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-bold">{deliveredOrders}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold">{cancelledOrders}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <X className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs and Filter Controls */}
      <div className="bg-white border rounded-lg mb-6">
        <div className="border-b">
          <Tabs defaultValue="all" onValueChange={setCurrentTab}>
            <TabsList className="flex h-10 w-full rounded-none">
              <TabsTrigger value="all" className="flex-1 rounded-none">
                All Orders
              </TabsTrigger>
              <TabsTrigger value="processing" className="flex-1 rounded-none">
                Processing
              </TabsTrigger>
              <TabsTrigger value="shipped" className="flex-1 rounded-none">
                Shipped
              </TabsTrigger>
              <TabsTrigger value="delivered" className="flex-1 rounded-none">
                Delivered
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1 rounded-none">
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Filter Controls */}
        <div className="p-4 border-b grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Date filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 items-center">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Value</SelectItem>
                <SelectItem value="lowest">Lowest Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 items-center">
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Show per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="p-4 bg-slate-50">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 bg-white border rounded-lg">
          <AlertTriangle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-800 mb-1">No orders found</p>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter settings</p>
          <Button onClick={() => {
            setSearchTerm("");
            setStatusFilter(null);
            setDateFilter("all");
            setPaymentFilter("all");
            setCurrentTab("all");
          }}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Customer</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Payment</th>
                  <th scope="col" className="px-6 py-3">Total</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, Number(perPage)).map((order) => (
                  <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-blue-600">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{order.customer.name}</span>
                        <span className="text-xs text-gray-500">{order.customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusBadgeStyles(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                          {getPaymentIcon(order.payment.method)}
                        </div>
                        <Badge className={getPaymentBadgeStyles(order.payment.status)}>
                          {order.payment.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">£{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/admin/orders/${order.id}`} className="flex items-center w-full">
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Email Customer</DropdownMenuItem>
                          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredOrders.length, Number(perPage))} of {filteredOrders.length} orders
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={filteredOrders.length <= Number(perPage)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 