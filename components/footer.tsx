import { FacebookIcon, InstagramIcon, YoutubeIcon, Mail, MapPin, Phone, Award, Gift, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Loyalty Program Section */}
      <div className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-2xl md:text-3xl font-bold">Join our loyalty program!</h3>
            </div>
            
            <p className="text-sm md:text-base mb-3">
              Earn 1 point for every pound spent - redeem points for discounts on future orders!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto mb-3">
              <div className="flex items-center justify-center bg-white px-2 py-1.5 rounded-full shadow-sm">
                <Star className="h-4 w-4 text-amber-500 mr-1.5 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">100 points = £5 discount</span>
              </div>
              
              <div className="flex items-center justify-center bg-white px-2 py-1.5 rounded-full shadow-sm">
                <Star className="h-4 w-4 text-amber-500 mr-1.5 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">200 points = £10 discount</span>
              </div>
              
              <div className="flex items-center justify-center bg-white px-2 py-1.5 rounded-full shadow-sm">
                <Star className="h-4 w-4 text-amber-500 mr-1.5 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">400 points = £20 discount</span>
              </div>
              
              <div className="flex items-center justify-center bg-white px-2 py-1.5 rounded-full shadow-sm">
                <Star className="h-4 w-4 text-amber-500 mr-1.5 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">1000 points = £50 discount</span>
              </div>
            </div>
            
            <div className="mt-3">
              <Link 
                href="/loyalty" 
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                <Gift className="h-4 w-4 mr-2" />
                Join Loyalty Program
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter signup bar */}
      <div className="w-full bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">JOIN OUR NEWSLETTER</h3>
              <p className="text-sm text-blue-100">Get the latest deals and fishing tips straight to your inbox</p>
            </div>
            <div className="w-full md:w-auto flex">
              <input
                type="email"
                placeholder="Your email address"
                className="py-2 px-4 rounded-l-md w-full md:w-64 focus:outline-none"
              />
              <button className="bg-slate-800 text-white py-2 px-6 rounded-r-md font-medium hover:bg-slate-700 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer - SIMPLIFIED */}
      <div className="bg-slate-900 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Column 1: About */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-3">
                <Image 
                  src="/rippa_logo.png" 
                  alt="Rippa Tackle"
                  width={40} 
                  height={40}
                  className="h-10 w-10 mr-2" 
                />
                <span className="text-lg font-bold">
                  RIPPA <span className="text-blue-400">TACKLE</span>
                </span>
              </div>
              <div className="flex space-x-3 mb-3">
                <Link href="#" className="bg-slate-800 hover:bg-blue-500 p-2 rounded-full transition-all duration-200">
                  <FacebookIcon className="h-4 w-4" />
                </Link>
                <Link href="#" className="bg-slate-800 hover:bg-blue-500 p-2 rounded-full transition-all duration-200">
                  <InstagramIcon className="h-4 w-4" />
                </Link>
                <Link href="#" className="bg-slate-800 hover:bg-blue-500 p-2 rounded-full transition-all duration-200">
                  <YoutubeIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400 mr-1.5 flex-shrink-0" />
                <span>info@rippatackle.com</span>
              </div>
            </div>

            {/* Column 2: Home */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-3 border-b border-slate-800 pb-1">Home</h3>
              <ul className="space-y-1">
                <li><Link href="/" className="text-gray-300 hover:text-blue-400 text-sm">Home</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-blue-400 text-sm">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 text-sm">Contact</Link></li>
                <li><Link href="/faqs" className="text-gray-300 hover:text-blue-400 text-sm">FAQs</Link></li>
              </ul>
            </div>

            {/* Column 3: Shop */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-3 border-b border-slate-800 pb-1">Shop</h3>
              <ul className="space-y-1">
                <li><Link href="/products" className="text-gray-300 hover:text-blue-400 text-sm">All Products</Link></li>
                <li><Link href="/sale" className="text-gray-300 hover:text-blue-400 text-sm">Sale</Link></li>
                <li><Link href="/new-in" className="text-gray-300 hover:text-blue-400 text-sm">New In</Link></li>
                <li><Link href="/brands" className="text-gray-300 hover:text-blue-400 text-sm">Brands</Link></li>
              </ul>
            </div>

            {/* Column 4: Content */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-3 border-b border-slate-800 pb-1">Content</h3>
              <ul className="space-y-1">
                <li><Link href="/blogs" className="text-gray-300 hover:text-blue-400 text-sm">Blogs</Link></li>
                <li><Link href="/videos" className="text-gray-300 hover:text-blue-400 text-sm">Videos</Link></li>
                <li><Link href="/fishing-tips" className="text-gray-300 hover:text-blue-400 text-sm">Fishing Tips</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-slate-800 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs text-gray-400 mb-1 md:mb-0">
              © {new Date().getFullYear()} Rippa Tackle. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-blue-400">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-blue-400">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};