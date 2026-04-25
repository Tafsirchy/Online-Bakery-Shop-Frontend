'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-cream-highlight animate-pulse flex items-center justify-center text-brown/40 font-serif">
        Loading Map...
      </div>
    )
  }
);

const contactInfo = [
  { icon: Phone, title: "Phone", detail: "237 8787 432", color: "bg-red-50 text-red-400" },
  { icon: MessageSquare, title: "Whatsapp", detail: "082-123-234-345", color: "bg-green-50 text-green-400" },
  { icon: Mail, title: "Email", detail: "support@bakery.com", color: "bg-blue-50 text-blue-400" },
  { icon: MapPin, title: "Our Shop", detail: "2445 Oak Ridge, Omaha", color: "bg-orange-50 text-orange-400" }
];

export default function ContactUs() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Side: Info Boxes & Small Map */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FFF8F0] p-8 rounded-3xl border border-brown/5 flex flex-col items-center text-center space-y-3 shadow-soft"
              >
                <div className={`w-12 h-12 ${info.color} rounded-2xl flex items-center justify-center`}>
                  <info.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-brown">{info.title}</h4>
                <p className="text-sm text-muted">{info.detail}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="rounded-[2.5rem] overflow-hidden border-8 border-cream-highlight shadow-warm h-64 relative z-0">
             <MapComponent />
             <div className="absolute inset-0 bg-brown/5 pointer-events-none" />
          </div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">Get In Touch</h2>
            <p className="text-muted leading-relaxed">
              Have a question or want to place a custom order? Drop us a message 
              and we'll get back to you as soon as our bread is out of the oven.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown uppercase tracking-wider">Name</label>
                <Input placeholder="Your Name" className="h-14 rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown uppercase tracking-wider">Email</label>
                <Input type="email" placeholder="email@example.com" className="h-14 rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown uppercase tracking-wider">Subject</label>
                <Input placeholder="What's this about?" className="h-14 rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown uppercase tracking-wider">Message</label>
                <Textarea placeholder="How can we help you?" className="min-h-[150px] rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
              </div>
            </div>
            <Button className="w-full py-8 rounded-2xl bg-caramel hover:bg-brown text-white text-lg font-bold shadow-warm transition-all">
              Send Now
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
