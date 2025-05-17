"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Clock, ExternalLink, ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProducts } from "@/lib/products-service";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

// Define types for order data
type OrderItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
};

// Function to calculate order total from items
const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from Supabase
        const allProducts = await getAllProducts();
        
        if (allProducts.length > 0) {
          // Create items for first order - Nash bed, bait and t-shirt
          const firstOrderItems: OrderItem[] = [
            {
              id: allProducts[0]?.id || "item-1",
              name: "Nash Scope Ops 4 Fold Sleep System MKII",
              image: allProducts[0]?.images?.[0]?.url,
              price: 488.00,
              quantity: 1
            },
            {
              id: allProducts[1]?.id || "item-2",
              name: "Nashbait Smoking/Fizzing Stickmix - Monster Shrimp, Scopex Squid, Citruz",
              image: allProducts[1]?.images?.[0]?.url,
              price: 11.00,
              quantity: 1
            },
            {
              id: allProducts[2]?.id || "item-3",
              name: "Make It Happen T-Shirt Box Logo",
              image: allProducts[2]?.images?.[0]?.url,
              price: 22.00,
              quantity: 1
            }
          ];
          
          // Create items for third order - boilie bait and clothing
          const thirdOrderItems: OrderItem[] = [
            {
              id: allProducts[3]?.id || "item-4",
              name: "20kg Bulk Boilie Bait Deal (£8.50 per kilo)",
              image: allProducts[3]?.images?.[0]?.url,
              price: 231.00,
              quantity: 1
            },
            {
              id: allProducts[4]?.id || "item-5",
              name: "Black Nash Tackle Hoody - Small",
              image: allProducts[4]?.images?.[0]?.url,
              price: 25.00,
              quantity: 1
            }
          ];
          
          // Create items for second order (with whatever products are available)
          const secondOrderItems: OrderItem[] = allProducts.slice(5, 8).map(product => ({
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.url,
            price: Number(product.price),
            quantity: 1
          }));
          
          // Create items for fourth order (cancelled)
          const fourthOrderItems: OrderItem[] = allProducts.slice(8, 9).map(product => ({
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.url,
            price: 89.99, // Fixed price for the cancelled order
            quantity: 1
          }));
          
          // Create items for fifth order (shipped)
          const fifthOrderItems: OrderItem[] = allProducts.slice(9, 11).map(product => ({
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.url,
            price: Number(product.price),
            quantity: 1
          }));
          
          // Calculate totals based on items
          const firstOrderTotal = calculateOrderTotal(firstOrderItems);
          const secondOrderTotal = calculateOrderTotal(secondOrderItems);
          const thirdOrderTotal = calculateOrderTotal(thirdOrderItems);
          const fourthOrderTotal = calculateOrderTotal(fourthOrderItems);
          const fifthOrderTotal = calculateOrderTotal(fifthOrderItems);
          
          // Create sample orders with calculated totals
          const sampleOrders: Order[] = [
            {
              id: "ORD-7821",
              date: "14/06/2023",
              status: "Delivered",
              total: firstOrderTotal,
              items: firstOrderItems
            },
            {
              id: "ORD-6542",
              date: "23/05/2023",
              status: "Delivered",
              total: secondOrderTotal,
              items: secondOrderItems
            },
            {
              id: "ORD-5433",
              date: "02/04/2023",
              status: "Delivered",
              total: thirdOrderTotal,
              items: thirdOrderItems
            },
            {
              id: "ORD-4289",
              date: "15/03/2023",
              status: "Cancelled",
              total: fourthOrderTotal,
              items: fourthOrderItems
            },
            {
              id: "ORD-3178",
              date: "28/02/2023",
              status: "Shipped",
              total: fifthOrderTotal,
              items: fifthOrderItems
            }
          ];
          
          setOrders(sampleOrders);
        }
      } catch (error) {
        console.error("Error fetching products for orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Toggle order details expansion
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const isOrderExpanded = (orderId: string) => expandedOrders.includes(orderId);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === null || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-yellow-100 text-yellow-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={statusFilter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter(null)}
            className={statusFilter === null ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "Processing" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("Processing")}
            className={statusFilter === "Processing" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Processing
          </Button>
          <Button 
            variant={statusFilter === "Shipped" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("Shipped")}
            className={statusFilter === "Shipped" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Shipped
          </Button>
          <Button 
            variant={statusFilter === "Delivered" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("Delivered")}
            className={statusFilter === "Delivered" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Delivered
          </Button>
          <Button 
            variant={statusFilter === "Cancelled" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("Cancelled")}
            className={statusFilter === "Cancelled" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Cancelled
          </Button>
        </div>
      </div>
      
      {/* Orders list */}
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
        <div className="text-center py-8">
          {searchTerm || statusFilter ? (
            <p className="text-gray-500 mb-4">No orders match your search criteria.</p>
          ) : (
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          )}
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order header */}
              <div 
                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="font-medium">{order.id}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {order.date}
                  </div>
                  <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-bold">£{order.total.toFixed(2)}</div>
                  {isOrderExpanded(order.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {/* Order details (expandable) */}
              {isOrderExpanded(order.id) && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item: OrderItem) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm truncate">{item.name}</h5>
                          <div className="flex text-sm text-gray-500 mt-0.5">
                            <span>£{item.price.toFixed(2)} x {item.quantity}</span>
                            <span className="mx-1">•</span>
                            <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-gray-500">Subtotal:</span>
                      <span className="text-sm font-medium">£{order.total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Order Details
                        </Link>
                      </Button>
                      
                      {order.status !== "Cancelled" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 