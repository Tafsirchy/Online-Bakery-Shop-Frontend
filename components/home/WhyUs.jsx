'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Clock, Heart, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const features = [
  {
    title: "100% Organic",
    desc: "We use only the finest locally sourced organic ingredients for our dough and fillings. Every grain is selected for its purity, ensuring that every bite you take is free from artificial preservatives and chemicals.",
    icon: Leaf,
    color: "bg-sage/10 text-sage",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"
  },
  {
    title: "Always Fresh",
    desc: "Our bakers start at dawn to ensure every bite you take is fresh from the oven. We believe that the true essence of bread is best enjoyed when it's warm, soft, and straight out of the bakery.",
    icon: Clock,
    color: "bg-caramel/10 text-caramel",
    img: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Made with Love",
    desc: "Traditional family recipes passed down through generations, made with passion. Baking is our love language, and we pour our hearts into every loaf to bring joy to your family's table.",
    icon: Heart,
    color: "bg-red-50 text-red-400",
    img: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800"
  },
  {
    title: "Safe Delivery",
    desc: "Carefully packed and delivered to your doorstep while maintaining perfect warmth. Our dedicated delivery team ensures that your treats arrive in pristine condition, ready to be devoured.",
    icon: ShieldCheck,
    color: "bg-brown/10 text-brown",
    img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800"
  },
  {
    title: "Eco-Friendly",
    desc: "We use 100% biodegradable packaging to keep our planet as fresh as our bread. Sustainability is at the core of our operations, minimizing our carbon footprint every step of the way.",
    icon: Leaf,
    color: "bg-sage/10 text-sage",
    img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Expert Bakers",
    desc: "Our team has over 20 years of combined experience in artisanal bread making. We've mastered the delicate balance of time, temperature, and technique to bring you bakery perfection.",
    icon: Heart,
    color: "bg-red-50 text-red-400",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800"
  }
];

export default function WhyUs() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <section className="py-32 bg-cream overflow-hidden relative">
      {/* Decorative SVG Background elements */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 200 200">
          <path fill="currentColor" d="M45.7,-77C58.1,-69.3,66.4,-54.6,71.5,-39.7C76.6,-24.8,78.5,-9.7,77.3,5.1C76.1,19.9,71.8,34.4,63.4,46.5C55,58.6,42.5,68.3,28.6,73.4C14.7,78.5,-0.6,79,-16.1,76.5C-31.6,74,-47.4,68.5,-59.8,58.3C-72.2,48.1,-81.2,33.2,-85.1,17.2C-89,1.2,-87.8,-15.9,-81.4,-31C-75,-46.1,-63.4,-59.2,-49.4,-66.3C-35.4,-73.4,-17.7,-74.5,-0.4,-73.8C16.9,-73.1,33.3,-84.7,45.7,-77Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-6"
          >
            <span className="text-caramel font-bold tracking-[0.3em] uppercase text-xs">Our Commitment</span>
            <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">
              Why our bakery <br />
              <span className="text-caramel">feels like home</span>
            </h2>
            <p className="text-muted text-lg max-w-md leading-relaxed">
              We don't just bake; we craft memories. From the first spark of dawn
              to the final golden crust, quality is our only language.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 grid grid-cols-2 gap-4 relative"
          >
            <div className="space-y-4 pt-12">
              <div className="aspect-[3/4] rounded-full overflow-hidden border-8 border-white shadow-warm">
                <img src={features[0].img} className="w-full h-full object-cover" alt="Organic" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-warm">
                <img src={features[1].img} className="w-full h-full object-cover" alt="Fresh" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-warm">
                <img src={features[2].img} className="w-full h-full object-cover" alt="Love" />
              </div>
              <div className="aspect-[3/4] rounded-full overflow-hidden border-8 border-white shadow-warm">
                <img src={features[3].img} className="w-full h-full object-cover" alt="Safe" />
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-caramel rounded-full flex items-center justify-center text-white text-center p-4 shadow-2xl rotate-12">
              <p className="text-sm font-bold uppercase tracking-tighter">Premium <br /> Quality</p>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          {/* Mobile: Horizontal Scroll (Circular Cards) */}
          <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory pb-12 gap-6 scrollbar-hide">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedFeature(feature)}
                className="min-w-[260px] snap-center aspect-square rounded-full bg-white shadow-soft border border-brown/5 flex flex-col items-center justify-center p-8 text-center space-y-3 group hover:shadow-warm transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-brown">{feature.title}</h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-3 px-2">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Circular Orbital Layout */}
          <div className="hidden lg:block relative h-[700px] w-full">
            {/* Central Decorative Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-dashed border-caramel/20 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-caramel/10"
              />
              <div className="text-center space-y-2 p-10 bg-cream z-10 rounded-full border-4 border-white shadow-warm">
                <span className="text-caramel font-bold text-xs uppercase tracking-[0.2em]">Since 2024</span>
                <h4 className="text-2xl font-serif text-brown italic">Truly <br /> Artisanal</h4>
              </div>
            </div>

            {/* Orbital Items */}
            {features.map((feature, i) => {
              const angle = (i * 360) / features.length;
              const radius = 300;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  whileInView={{ opacity: 1, x, y }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-90px',
                    marginLeft: '-90px'
                  }}
                  onClick={() => setSelectedFeature(feature)}
                  className="w-44 h-44 rounded-full bg-white shadow-warm border-4 border-white flex flex-col items-center justify-center p-6 text-center space-y-2 hover:scale-110 transition-transform cursor-pointer group"
                >
                  <div className={`w-10 h-10 ${feature.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-brown leading-tight">{feature.title}</h3>
                  <p className="text-[10px] text-muted leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to learn more
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="w-[400px] h-[400px] rounded-full p-0 overflow-hidden border-none shadow-2xl flex flex-col justify-center items-center bg-white text-center">
          {selectedFeature && (
            <div className="flex flex-col items-center justify-center p-8 w-full h-full relative z-10">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img src={selectedFeature.img} alt={selectedFeature.title} className="w-full h-full object-cover" />
              </div>
              <div className={`w-20 h-20 ${selectedFeature.color} bg-white rounded-full flex items-center justify-center shadow-warm mb-4 relative z-10`}>
                <selectedFeature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-brown mb-4 relative z-10">{selectedFeature.title}</h3>
              <p className="text-muted leading-relaxed text-[14px] relative z-10 max-w-[85%]">
                {selectedFeature.desc}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
