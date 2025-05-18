"use client";
import { FC } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Star, 
  Fish, 
  User, 
  ShoppingCart, 
  Tag, 
  Clock, 
  ArrowRight, 
  Calendar, 
  MapPin 
} from "lucide-react";
import { useUserProfile } from "@/hooks/app/useUserProfile";

export const RippaTackleDashboard: FC = () => {
  const { user, profile } = useUserProfile();
  
  // Get user names for welcome message
  const userName = user?.first_name || "Angler";
  
  // Demo data (replace with real data in production)
  const recentOrders = [
    { id: "ORD-12345", status: "Shipped", date: "23/05/2023", items: 3, total: "£89.95" },
    { id: "ORD-12344", status: "Delivered", date: "17/04/2023", items: 2, total: "£45.50" },
  ];
  
  const recommendedProducts = [
    { id: 1, name: "Premium Boilie Mix - Spicy Crab", price: "£12.99", category: "Bait" },
    { id: 2, name: "Rippa Carbon Spod Rod", price: "£89.99", category: "Rods" },
    { id: 3, name: "Mystery Tackle Box - Carp Edition", price: "£59.99", category: "Bundles" },
  ];
  
  const upcomingEvents = [
    { id: 1, name: "Summer Carp Cup", location: "Linear Fisheries", date: "18/06/2023" },
    { id: 2, name: "Rippa Night Session", location: "Brasenose One", date: "15/07/2023" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold mb-1">Welcome back, {userName}!</h2>
        <p className="text-lg text-slate-600 mb-2">
          Your one-stop dashboard for orders, products and fishing events.
        </p>
      </div>

      {/* Order Status & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b border-blue-50">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-500">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-blue-50 pb-3">
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "Delivered" 
                            ? "bg-green-100 text-green-700" 
                            : order.status === "Shipped" 
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-500">{order.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total}</p>
                      <p className="text-xs text-slate-500">{order.items} items</p>
                    </div>
                    <Link href={`/app/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <Link href="/app/orders" className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 font-medium">
              View all orders <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b border-blue-50">
            <Clock className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-3">
              <Link href="/app/orders" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 transition-colors">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Track Orders</span>
              </Link>
              <Link href="/shop/bundles" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 transition-colors">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Mystery Boxes</span>
              </Link>
              <Link href="/shop/sale" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 transition-colors">
                <Tag className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Special Offers</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations & Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Products */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b border-blue-50">
            <Star className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Recommended For You</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {recommendedProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between border-b border-blue-50 pb-2">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <span className="text-xs text-slate-500">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{product.price}</span>
                    <Link href={`/shop/product/${product.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 font-medium">
              Browse more products <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
        
        {/* Fishing Events */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b border-blue-50">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming events at the moment.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="border-b border-blue-50 pb-3">
                    <p className="font-medium text-sm">{event.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/events" className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 font-medium">
              View all events <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
        {['Carp Tackle', 'Baits & Mixes', 'Terminal Tackle', 'Clothing'].map((category, index) => (
          <Card key={index} className="border-blue-100 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Link href={`/shop/${category.toLowerCase().replace(' ', '-')}`} className="flex flex-col items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors">
                <Fish className="w-8 h-8" />
                <span className="font-semibold text-center mt-2">{category}</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* AI Assistant Banner */}
      <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-0 shadow-lg mt-4">
        <CardContent className="flex items-center justify-between py-6 px-6">
          <div>
            <h3 className="font-bold text-lg mb-1">Need help choosing the right gear?</h3>
            <p className="text-blue-100 max-w-md">Chat with our AI fishing assistant for personalised advice on rigs, baits, and tactics.</p>
          </div>
          <Link href="/fishing-assistant" className="bg-white text-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Get Advice
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}; 