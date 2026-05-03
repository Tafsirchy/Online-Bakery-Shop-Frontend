'use client';

// Force reload
import Link from 'next/link';
import { Mail, MapPin, Phone, ArrowRight, Clock } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Our Story', path: '/story' },
    { name: 'Categories', path: '/categories' },
    { name: 'Special Offers', path: '/shop' }
  ];

  // Colors
  const cozyColor = '#FFFBF2';

  return (
    <footer className="bg-brown text-cream pt-16 md:pt-24 pb-10 md:pb-12 overflow-hidden relative">
      {/* Background element */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-caramel/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
        {/* Brand section */}
        <div className="space-y-6 md:space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="space-y-4">
            <Link href="/" style={{ color: cozyColor }} className="text-3xl md:text-3xl font-serif font-bold tracking-tight inline-block">
              Bakery & <span className="text-caramel">Co.</span>
            </Link>
            <p className="text-cream/60 leading-relaxed text-sm max-w-xs mx-auto md:mx-0">
              Crafting artisanal delights with organic ingredients and traditional techniques. 
              Bringing the warmth of our oven to your doorstep every single morning.
            </p>
          </div>
          
          <div className="flex gap-4">
            {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 md:w-10 md:h-10 bg-white/5 hover:bg-caramel rounded-xl flex items-center justify-center transition-all duration-300 group shadow-sm border-none">
                <Icon className="w-5 h-5 md:w-5 md:h-5 text-cream/80 group-hover:text-white group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          <div className="relative inline-block md:block">
            <h4 style={{ color: cozyColor }} className="text-lg font-serif font-bold tracking-wide">Explore</h4>
            <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-caramel mx-auto md:mx-0 right-0 md:right-auto" />
          </div>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.path} 
                  className="text-cream/60 hover:text-caramel transition-all duration-300 flex items-center justify-center md:justify-start gap-2 group text-sm"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden md:block" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          <div className="relative inline-block md:block">
            <h4 style={{ color: cozyColor }} className="text-lg font-serif font-bold tracking-wide">Visit Us</h4>
            <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-caramel mx-auto md:mx-0 right-0 md:right-auto" />
          </div>
          <ul className="space-y-6">
            <li className="flex flex-col md:flex-row gap-4 items-center md:items-start group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-caramel/20 transition-colors">
                <MapPin className="w-5 h-5 text-caramel" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cream/40">Location</p>
                <p className="text-sm text-cream/70 leading-relaxed">123 Baker Street, Artisanal District,<br />Dhaka, Bangladesh</p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row gap-4 items-center md:items-start group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-caramel/20 transition-colors">
                <Phone className="w-5 h-5 text-caramel" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cream/40">Phone</p>
                <p className="text-sm text-cream/70">+880 1234 567890</p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row gap-4 items-center md:items-start group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-caramel/20 transition-colors">
                <Mail className="w-5 h-5 text-caramel" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cream/40">Email</p>
                <p className="text-sm text-cream/70">hello@bakeryandco.com</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Baking hours */}
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          <div className="relative inline-block md:block">
            <h4 style={{ color: cozyColor }} className="text-lg font-serif font-bold tracking-wide">Baking Hours</h4>
            <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-caramel mx-auto md:mx-0 right-0 md:right-auto" />
          </div>
          <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
            <ul className="space-y-3 relative z-10">
              {[
                { day: 'Mon - Fri', time: '8 AM - 9 PM' },
                { day: 'Sat - Sun', time: '9 AM - 10 PM' }
              ].map((item) => (
                <li key={item.day} className="flex justify-between items-center text-sm gap-4">
                  <span className="text-cream/50">{item.day}</span>
                  <span className="font-bold text-cream/90">{item.time}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-caramel text-center">
                Fresh out of the oven!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-20 pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-cream/30 tracking-widest">
        <p className="uppercase text-center md:text-left">© 2024 Bakery & Co. Dhaka's Finest Artisanal Spot.</p>
        <div className="flex gap-6 md:gap-8 uppercase">
          <a href="#" className="hover:text-caramel transition-colors">Privacy</a>
          <a href="#" className="hover:text-caramel transition-colors">Terms</a>
          <a href="#" className="hover:text-caramel transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
