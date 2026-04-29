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
    <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 order-first lg:order-last"
        >
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-serif text-brown leading-tight">Get In Touch</h2>
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Have a question or want to place a custom order? Drop us a message 
              and we'll get back to you as soon as our bread is out of the oven.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] md:text-sm font-bold text-brown uppercase tracking-widest">Name</label>
                <Input placeholder="Your Name" className="h-14 rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-sm font-bold text-brown uppercase tracking-widest">Email</label>
                <Input type="email" placeholder="email@example.com" className="h-14 rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-bold text-brown uppercase tracking-widest">Subject</label>
              <Input placeholder="What's this about?" className="h-14 rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-bold text-brown uppercase tracking-widest">Message</label>
              <Textarea placeholder="How can we help you?" className="min-h-[120px] md:min-h-[150px] rounded-xl border-brown/10 bg-cream-highlight focus-visible:ring-caramel" />
            </div>
            <Button className="w-full py-8 rounded-2xl bg-caramel hover:bg-brown text-white text-lg font-bold shadow-warm transition-all border-none">
              Send Now
            </Button>
          </form>
        </motion.div>

        {/* Contact info and map */}
        <div className="space-y-10 order-last lg:order-first">
          {/* Mobile view: Horizontal scroll */}
          <div className="flex lg:grid lg:grid-cols-2 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="min-w-[200px] md:min-w-0 snap-center bg-white p-6 md:p-8 rounded-[2rem] border border-brown/5 flex flex-col items-center text-center space-y-3 shadow-soft hover:shadow-warm transition-shadow"
              >
                <div className={`w-12 h-12 bg-caramel/10 text-caramel rounded-2xl flex items-center justify-center`}>
                  <info.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h4 className="font-bold text-brown text-sm md:text-base">{info.title}</h4>
                <p className="text-[10px] md:text-sm text-muted font-medium break-all">{info.detail}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-cream-highlight shadow-warm h-52 md:h-64 relative z-0">
             <MapComponent />
             <div className="absolute inset-0 bg-brown/5 pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
