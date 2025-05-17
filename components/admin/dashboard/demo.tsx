"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Flame, Package, ShoppingCart, CreditCard, CircleOff, 
  User, TrendingUp, TrendingDown, Percent, DollarSign
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllProducts } from "@/lib/products-service";
import Image from "next/image";
import Link from "next/link";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Types definitions
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

type PaymentMethod = "Credit Card" | "PayPal" | "Apple Pay" | "Google Pay";

type Order = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned" | "On Hold" | "Refunded";
  total: number;
  items: OrderItem[];
  customer: CustomerInfo;
  payment: {
    method: PaymentMethod;
    status: "Paid" | "Pending" | "Refunded" | "Failed";
    transactionId: string;
  };
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  images?: { url: string }[];
  category?: string;
  stock?: {
    level: number;
    threshold?: number;
  };
  isActive?: boolean;
  discount?: number;
  isFeatured?: boolean;
};

// Dashboard component
export function DashboardDemo() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStock: 0,
    outOfStock: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
  });

  // Get trend color/icon based on value
  const getTrendColor = (value: number): string => value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600";
  const getTrendIcon = (value: number) => value > 0 ? <TrendingUp className="h-3 w-3" /> : value < 0 ? <TrendingDown className="h-3 w-3" /> : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products from API
        const allProducts = await getAllProducts();
        
        if (allProducts.length > 0) {
          // Add mock stock data to products if not available
          const productsWithStock = allProducts.map((product, index) => {
            // Set stock levels based on product index for demo
            let stockLevel = 0;
            if (index % 10 === 0) {
              stockLevel = 0; // Out of stock for every 10th product
            } else if (index % 5 === 0) {
              stockLevel = Math.floor(Math.random() * 9) + 1; // Low stock (1-9) for every 5th product
            } else {
              stockLevel = Math.floor(Math.random() * 91) + 10; // Normal stock (10-100) for others
            }
            
            return {
              ...product,
              stock: {
                level: stockLevel,
                threshold: 10
              }
            };
          });
          
          setProducts(productsWithStock);
          
          // Generate customers
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
          
          // Create sample order data for the last 3 months (today is July)
          const sampleOrders: Order[] = [
            // July orders (current month)
            {
              id: "ORD-8762",
              date: "12/07/2023",
              status: "Processing",
              total: 158.99,
              items: productsWithStock.slice(0, 2).map(product => ({
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
                transactionId: "txn_11223"
              }
            },
            {
              id: "ORD-8761",
              date: "11/07/2023",
              status: "Processing",
              total: 231.50,
              items: [
                {
                  id: productsWithStock[3]?.id || "item-4",
                  name: "20kg Bulk Boilie Bait Deal (£8.50 per kilo)",
                  image: productsWithStock[3]?.images?.[0]?.url,
                  price: 231.00,
                  quantity: 1,
                  sku: "BB-20KG-001"
                }
              ],
              customer: customers[1],
              payment: {
                method: "PayPal",
                status: "Paid",
                transactionId: "txn_22334"
              }
            },
            {
              id: "ORD-8759",
              date: "09/07/2023",
              status: "Shipped",
              total: 67.98,
              items: productsWithStock.slice(6, 8).map(product => ({
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
                status: "Paid",
                transactionId: "txn_33445"
              }
            },
            {
              id: "ORD-8753",
              date: "05/07/2023",
              status: "Delivered",
              total: 99.99,
              items: productsWithStock.slice(8, 9).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: 99.99,
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[3],
              payment: {
                method: "Apple Pay",
                status: "Paid",
                transactionId: "txn_44556"
              }
            },
            {
              id: "ORD-8750",
              date: "03/07/2023",
              status: "Delivered",
              total: 45.50,
              items: productsWithStock.slice(9, 11).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[4],
              payment: {
                method: "Credit Card",
                status: "Paid",
                transactionId: "txn_55667"
              }
            },
            {
              id: "ORD-8746",
              date: "01/07/2023",
              status: "On Hold",
              total: 345.00,
              items: productsWithStock.slice(4, 7).map(product => ({
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
                transactionId: "txn_66778"
              }
            },
            
            // June orders (previous month)
            {
              id: "ORD-8733",
              date: "28/06/2023",
              status: "Delivered",
              total: 125.49,
              items: productsWithStock.slice(2, 4).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[0],
              payment: {
                method: "PayPal",
                status: "Paid",
                transactionId: "txn_77889"
              }
            },
            {
              id: "ORD-8721",
              date: "21/06/2023",
              status: "Delivered",
              total: 521.00,
              items: [
                {
                  id: productsWithStock[0]?.id || "item-1",
                  name: "Nash Scope Ops 4 Fold Sleep System MKII",
                  image: productsWithStock[0]?.images?.[0]?.url,
                  price: 488.00,
                  quantity: 1,
                  sku: "NS-4FBS-001"
                },
                {
                  id: productsWithStock[1]?.id || "item-2",
                  name: "Nashbait Smoking/Fizzing Stickmix - Monster Shrimp",
                  image: productsWithStock[1]?.images?.[0]?.url,
                  price: 11.00,
                  quantity: 1,
                  sku: "NB-SFST-MS1"
                },
                {
                  id: productsWithStock[2]?.id || "item-3",
                  name: "Make It Happen T-Shirt Box Logo",
                  image: productsWithStock[2]?.images?.[0]?.url,
                  price: 22.00,
                  quantity: 1,
                  sku: "MIH-TS-BL1"
                }
              ],
              customer: customers[1],
              payment: {
                method: "Credit Card",
                status: "Paid",
                transactionId: "txn_88990"
              }
            },
            {
              id: "ORD-8705",
              date: "14/06/2023",
              status: "Cancelled",
              total: 89.99,
              items: productsWithStock.slice(7, 8).map(product => ({
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
                transactionId: "txn_99001"
              }
            },
            
            // May orders (2 months ago)
            {
              id: "ORD-8650",
              date: "28/05/2023",
              status: "Delivered",
              total: 145.99,
              items: productsWithStock.slice(3, 6).map(product => ({
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
                status: "Paid",
                transactionId: "txn_00112"
              }
            },
            {
              id: "ORD-8635",
              date: "20/05/2023",
              status: "Delivered",
              total: 76.50,
              items: productsWithStock.slice(9, 11).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[0],
              payment: {
                method: "PayPal",
                status: "Paid",
                transactionId: "txn_11223"
              }
            },
            {
              id: "ORD-8612",
              date: "10/05/2023",
              status: "Returned",
              total: 177.99,
              items: productsWithStock.slice(4, 7).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              customer: customers[4],
              payment: {
                method: "Credit Card",
                status: "Refunded",
                transactionId: "txn_22334"
              }
            }
          ];
          
          setOrders(sampleOrders);
          
          // Calculate statistics from the orders and products data
          const totalRevenue = sampleOrders.reduce((sum, order) => 
            order.status !== "Cancelled" && order.status !== "Returned" ? sum + order.total : sum, 0);
          
          const processingOrders = sampleOrders.filter(order => order.status === "Processing").length;
          const shippedOrders = sampleOrders.filter(order => order.status === "Shipped").length;
          const deliveredOrders = sampleOrders.filter(order => order.status === "Delivered").length;
          const cancelledOrders = sampleOrders.filter(order => order.status === "Cancelled").length;
          const returnedOrders = sampleOrders.filter(order => order.status === "Returned").length;
          
          const totalOrders = sampleOrders.length;
          const totalCustomers = new Set(sampleOrders.map(order => order.customer.id)).size;
          
          // Calculate actual product stock stats based on our added stock data
          const lowStock = productsWithStock.filter(product => 
            product.stock && product.stock.level > 0 && product.stock.level < (product.stock.threshold || 10)).length;
          
          const outOfStock = productsWithStock.filter(product => 
            product.stock && product.stock.level === 0).length;
          
          // Calculate AOV (Average Order Value)
          const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          
          // Simulate conversion rate (typically would come from analytics)
          const conversionRate = 3.24; // 3.24%
          
          setStats({
            totalRevenue,
            totalOrders,
            totalCustomers,
            lowStock,
            outOfStock,
            avgOrderValue,
            conversionRate,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            returnedOrders
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare chart data for revenue and orders
  const revenueChartData = {
    labels: ['May', 'June', 'July'],
    datasets: [{ label: 'Revenue', data: [400.48, 736.49, 948.96], backgroundColor: 'rgba(29, 78, 216, 0.7)', borderColor: 'rgb(29, 78, 216)', borderWidth: 1 }],
  };
  
  const orderStatusChartData = {
    labels: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    datasets: [{
      label: 'Orders by Status',
      data: [stats.processingOrders, stats.shippedOrders, stats.deliveredOrders, stats.cancelledOrders, stats.returnedOrders],
      backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(139, 92, 246, 0.7)'],
      borderColor: ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(16, 185, 129)', 'rgb(239, 68, 68)', 'rgb(139, 92, 246)'],
      borderWidth: 1,
    }],
  };
  
  const dailySalesChartData = {
    labels: ['03/07', '04/07', '05/07', '06/07', '07/07', '08/07', '09/07', '10/07', '11/07', '12/07'],
    datasets: [{ label: 'Daily Sales', data: [45.50, 0, 99.99, 0, 0, 0, 67.98, 0, 231.50, 158.99], fill: false, borderColor: 'rgb(16, 185, 129)', tension: 0.1 }],
  };

  // Get recent orders and top selling products
  const recentOrders = orders.slice(0, 5);
  const topSellingProducts = products.slice(0, 5);

  if (loading) {
    return (
      <div className="py-6 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded max-w-sm mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Stats Row - 4 cards in a row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Revenue (30 days)</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold">£{stats.totalRevenue.toFixed(2)}</p>
                  <div className="flex items-center text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>12.5%</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Orders (30 days)</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold">{stats.totalOrders}</p>
                  <div className="flex items-center text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>8.3%</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Avg. Order Value</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold">£{stats.avgOrderValue.toFixed(2)}</p>
                  <div className="flex items-center text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>4.2%</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Conversion Rate</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold">{stats.conversionRate.toFixed(2)}%</p>
                  <div className="flex items-center text-xs font-medium text-red-600">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>1.1%</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Percent className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Stats Row - 3 cards in a row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Products</p>
                <p className="text-lg font-bold">{products.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Low Stock</p>
                <p className="text-lg font-bold">{stats.lowStock}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Flame className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Out of Stock</p>
                <p className="text-lg font-bold">{stats.outOfStock}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <CircleOff className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section - 2 cards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <CardContent className="py-3">
            <h3 className="text-sm font-semibold mb-2">Monthly Revenue</h3>
            <div className="h-52">
              <Bar
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { callback: (value: any) => `£${value}` }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <h3 className="text-sm font-semibold mb-2">Order Status</h3>
            <div className="h-52 flex items-center justify-center">
              <Doughnut
                data={orderStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Daily Sales Chart */}
      <div className="mb-4">
        <Card>
          <CardContent className="py-3">
            <h3 className="text-sm font-semibold mb-2">Daily Sales (Last 10 Days)</h3>
            <div className="h-40">
              <Line
                data={dailySalesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { callback: (value: any) => `£${value}` }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">View All</Link>
            </div>
            
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-md shadow-sm">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date} • {order.items.length} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                      order.status === "Shipped" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "Cancelled" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Top Selling Products</h3>
              <Link href="/admin/products" className="text-xs text-blue-600 hover:underline">View All</Link>
            </div>
            
            <div className="space-y-2">
              {topSellingProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    {product.images && product.images[0] ? (
                      <div className="w-10 h-10 bg-white rounded-md shadow-sm overflow-hidden flex items-center justify-center">
                        <Image 
                          src={product.images[0].url} 
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{Number(product.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {product.stock 
                        ? product.stock.level > 0 
                          ? `${product.stock.level} in stock` 
                          : 'Out of stock'
                        : 'Stock unknown'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer Summary */}
      <Card>
        <CardContent className="py-3">
          <h3 className="text-sm font-semibold mb-2">Customer Summary</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Total Customers</p>
              <p className="text-lg font-bold">{stats.totalCustomers}</p>
              <div className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>6.8%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Repeat Customers</p>
              <p className="text-lg font-bold">48%</p>
              <div className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>3.2%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Avg. Time to Purchase</p>
              <p className="text-lg font-bold">1.8 days</p>
              <div className="flex items-center text-xs font-medium text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span>0.3 days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 