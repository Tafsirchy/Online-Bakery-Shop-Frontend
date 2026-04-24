'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-brown text-cream pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="text-3xl font-serif font-bold tracking-tight">
            The Cozy <span className="text-caramel">Bakery</span>
          </Link>
          <p className="text-cream/70 leading-relaxed">
            Crafting artisanal delights with organic ingredients and traditional techniques. 
            Bringing the warmth of our oven to your doorstep.
          </p>
          <div className="flex gap-4">
            {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
              <a key={i} href="#" className="p-2 bg-white/5 hover:bg-caramel rounded-full transition-colors group">
                <Icon className="w-5 h-5 text-cream group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xl font-serif font-bold">Quick Links</h4>
          <ul className="space-y-3 text-cream/70">
            {['Home', 'Shop', 'Our Story', 'Categories', 'Special Offers'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-caramel transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-xl font-serif font-bold">Visit Us</h4>
          <ul className="space-y-4 text-cream/70">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-caramel flex-shrink-0" />
              <span>123 Baker Street, Artisanal District,<br />Dhaka, Bangladesh</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-caramel flex-shrink-0" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-caramel flex-shrink-0" />
              <span>hello@cozybakery.com</span>
            </li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div className="space-y-6">
          <h4 className="text-xl font-serif font-bold">Baking Hours</h4>
          <ul className="space-y-3 text-cream/70">
            <li className="flex justify-between">
              <span>Mon - Fri</span>
              <span className="text-cream font-medium">8 AM - 9 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday</span>
              <span className="text-cream font-medium">9 AM - 10 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span>
              <span className="text-cream font-medium">10 AM - 6 PM</span>
            </li>
          </ul>
          <div className="pt-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs italic text-center">
            "Fresh batches out every hour!"
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream/40">
        <p>© 2024 The Cozy Bakery. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cream transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
