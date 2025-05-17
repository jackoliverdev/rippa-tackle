"use client";

import { useState, useEffect } from "react";
import { 
  Package, ShoppingCart, Award, Star, TrendingUp, 
  User, Calendar, Fish, CheckCircle, Clock
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
import { Bar, Line } from 'react-chartjs-2';
import { RecentOrders } from "@/components/app/profile/RecentOrders";

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

type Order = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned" | "On Hold" | "Refunded";
  total: number;
  items: OrderItem[];
  payment: {
    method: string;
    status: "Paid" | "Pending" | "Refunded" | "Failed";
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
  compareAtPrice?: number;
};

// Customer dashboard component
export function CustomerDashboardDemo() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState({
    currentPoints: 345,
    pointsToNextReward: 155,
    totalPointsEarned: 890,
    pointsRedeemed: 545,
    pointValue: 0.01, // £0.01 per point
    nextRewardThreshold: 500
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products from API for recommendations
        const allProducts = await getAllProducts();
        
        if (allProducts.length > 0) {
          setProducts(allProducts.slice(0, 4));
          
          // Generate sample orders for the customer
          const sampleOrders: Order[] = [
            {
              id: "ORD-8762",
              date: "12/07/2023",
              status: "Processing",
              total: 158.99,
              items: allProducts.slice(0, 2).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              payment: {
                method: "Credit Card",
                status: "Paid"
              }
            },
            {
              id: "ORD-8733",
              date: "28/06/2023",
              status: "Delivered",
              total: 125.49,
              items: allProducts.slice(2, 4).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              payment: {
                method: "PayPal",
                status: "Paid"
              }
            },
            {
              id: "ORD-8635",
              date: "20/05/2023",
              status: "Delivered",
              total: 76.50,
              items: allProducts.slice(9, 11).map(product => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0]?.url,
                price: Number(product.price),
                quantity: 1,
                sku: `RT-${product.id.substring(0, 6)}`
              })),
              payment: {
                method: "PayPal",
                status: "Paid"
              }
            }
          ];
          
          setOrders(sampleOrders);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare chart data for loyalty points
  const pointsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{ 
      label: 'Loyalty Points Earned', 
      data: [50, 120, 80, 160, 230, 145, 105], 
      backgroundColor: 'rgba(29, 78, 216, 0.7)',
      borderColor: 'rgb(29, 78, 216)',
      borderWidth: 1 
    }],
  };
  
  // Prepare chart data for order history
  const ordersChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{ 
      label: 'Purchases (£)', 
      data: [0, 45, 0, 112, 76, 125, 158], 
      fill: false, 
      borderColor: 'rgb(16, 185, 129)', 
      tension: 0.1 
    }],
  };

  // Get recent orders
  const recentOrders = orders.slice(0, 3);
  const recommendedProducts = products.slice(0, 4);

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
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Loyalty Points</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold">{loyaltyPoints.currentPoints}</p>
                  <span className="text-xs text-blue-600 font-medium">= £{(loyaltyPoints.currentPoints * loyaltyPoints.pointValue).toFixed(2)}</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Award className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">To Next Reward</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold">{loyaltyPoints.pointsToNextReward}</p>
                  <div className="flex items-center text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+15 this week</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Star className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Fishing Sessions</p>
                <p className="text-lg font-bold">8</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Personal Bests</p>
                <p className="text-lg font-bold">3</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Fish className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <div className="mb-4">
        <RecentOrders />
      </div>
      
      {/* Recommended Products - Similar to BestSellers */}
      <div className="mb-4">
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Recommended For You</h3>
              <Link href="/products" className="text-xs text-blue-600 hover:underline">View All Products</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {recommendedProducts.map((product) => {
                const productPrice = Number(product.price);
                const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - productPrice) / product.compareAtPrice) * 100) : 0;
                
                return (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-32">
                      {product.images && product.images[0] ? (
                        <Image 
                          src={product.images[0].url} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {discount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          {product.compareAtPrice ? (
                            <>
                              <span className="font-bold text-blue-700 text-sm">£{productPrice.toFixed(2)}</span>
                              <span className="ml-1 text-xs line-through text-gray-500">£{product.compareAtPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="font-bold text-blue-700 text-sm">£{productPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/products/${product.slug}`}
                        className="mt-2 flex items-center justify-center text-xs font-medium bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors w-full"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Account Summary */}
      <Card>
        <CardContent className="py-3">
          <h3 className="text-sm font-semibold mb-2">Account Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-semibold">Profile</h4>
              </div>
              <p className="text-xs text-gray-500 mt-1">Your profile is 85% complete</p>
              <Link href="/app/profile" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                Complete Profile
              </Link>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <h4 className="text-sm font-semibold">Order History</h4>
              </div>
              <p className="text-xs text-gray-500 mt-1">You've placed 12 orders to date</p>
              <Link href="/app/orders" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                View Order History
              </Link>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="text-sm font-semibold">Fishing Achievements</h4>
              </div>
              <p className="text-xs text-gray-500 mt-1">Complete 2 more achievements to advance!</p>
              <Link href="#" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                View Achievements
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 