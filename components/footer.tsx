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

      {/* Main footer */}
      <div className="bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: About */}
            <div>
              <div className="flex items-center mb-4">
                <Image 
                  src="/rippa_logo.png" 
                  alt="Rippa Tackle"
                  width={48} 
                  height={48}
                  className="h-12 w-12 mr-2" 
                />
                <span className="text-xl font-bold">
                  RIPPA <span className="text-blue-400">TACKLE</span>
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                The UK's premier fishing tackle and equipment supplier, providing quality gear for anglers since 2010.
              </p>
              <div className="flex space-x-3">
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
            </div>

            {/* Column 2: Shop */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 border-b border-slate-800 pb-2">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="/sale" className="text-gray-300 hover:text-blue-400 text-sm">Sale</Link></li>
                <li><Link href="/new-in" className="text-gray-300 hover:text-blue-400 text-sm">New In</Link></li>
                <li><Link href="/carp" className="text-gray-300 hover:text-blue-400 text-sm">Carp</Link></li>
                <li><Link href="/tackle" className="text-gray-300 hover:text-blue-400 text-sm">Tackle</Link></li>
                <li><Link href="/bait" className="text-gray-300 hover:text-blue-400 text-sm">Bait</Link></li>
                <li><Link href="/clothing" className="text-gray-300 hover:text-blue-400 text-sm">Clothing</Link></li>
                <li><Link href="/brands" className="text-gray-300 hover:text-blue-400 text-sm">Brands</Link></li>
              </ul>
            </div>

            {/* Column 3: Help */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 border-b border-slate-800 pb-2">Help & Info</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-blue-400 text-sm">About Us</Link></li>
                <li><Link href="/delivery" className="text-gray-300 hover:text-blue-400 text-sm">Delivery Information</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-blue-400 text-sm">Returns Policy</Link></li>
                <li><Link href="/faqs" className="text-gray-300 hover:text-blue-400 text-sm">FAQs</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 text-sm">Contact Us</Link></li>
                <li><Link href="/blogs" className="text-gray-300 hover:text-blue-400 text-sm">Blogs</Link></li>
                <li><Link href="/videos" className="text-gray-300 hover:text-blue-400 text-sm">Videos</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 border-b border-slate-800 pb-2">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">
                    Unit 7, Riverside Industrial Estate<br />
                    Harlow, Essex<br />
                    CM20 2QE
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">01279 123456</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">info@rippatackle.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-slate-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs text-gray-400 mb-2 md:mb-0">
              © {new Date().getFullYear()} Rippa Tackle. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-blue-400">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-blue-400">Terms & Conditions</Link>
              <Link href="/cookies" className="text-xs text-gray-400 hover:text-blue-400">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};