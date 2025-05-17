"use client";
import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, Clock, ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getBestSellingProducts } from "@/lib/products-service";
import { Product } from "@/types/product";

// Define types for our order items
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
  status: string;
  total: number;
  items: OrderItem[];
};

export function RecentOrders() {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products from Supabase
        const allProducts = await getAllProducts();
        
        if (allProducts.length > 0) {
          // Create the first order
          const firstOrderItems = allProducts.slice(0, 3).map(product => ({
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.url,
            price: Number(product.price),
            quantity: 1
          }));
          
          // Create the second order with a different set of products
          const secondOrderItems = allProducts.slice(3, 6).map(product => ({
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.url,
            price: Number(product.price),
            quantity: 1
          }));
          
          // Create the third order with yet another set of products
          const thirdOrderItems = allProducts.slice(6, 8).map(product => ({
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.url,
            price: Number(product.price),
            quantity: product.id.charCodeAt(0) % 2 === 0 ? 2 : 1 // Vary quantities based on product ID
          }));
          
          // Create orders with fixed totals to match the screenshot
          const sampleOrders: Order[] = [
            {
              id: "ORD-7821",
              date: "14/06/2023",
              status: "Delivered",
              total: 543.00,
              items: firstOrderItems
            },
            {
              id: "ORD-6542",
              date: "23/05/2023",
              status: "Delivered",
              total: 129.97,
              items: secondOrderItems
            },
            {
              id: "ORD-5433",
              date: "02/04/2023",
              status: "Delivered",
              total: 129.00,
              items: thirdOrderItems
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

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const isOrderExpanded = (orderId: string) => expandedOrders.includes(orderId);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-5">
        <Package className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-blue-800">Recent Orders</h2>
      </div>

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
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
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
                  
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Order
                      </Button>
                    </Link>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Reorder
                    </Button>
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