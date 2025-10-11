import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" style={{ color: '#fc086a' }} />
              <span className="text-2xl font-bold">
                <span style={{ color: 'hsl(var(--logo-primary))' }}>Nile</span>
                <span style={{ color: '#fca708' }}>Cart</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              South Sudan's premier online marketplace connecting buyers and sellers across the nation. 
              Discover quality products and grow your business with us.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Sign In / Sign Up
                </Link>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Become a Seller
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Seller Support
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Buyer Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                  Report a Problem
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  Juba, South Sudan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  +211 XXXXXX
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  support@nilecart.ss
                </span>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-2">Business Hours</h4>
              <p className="text-gray-300 text-xs">
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 NileCart. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Proudly serving South Sudan 🇸🇸 | Building the future of e-commerce in South Sudan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
