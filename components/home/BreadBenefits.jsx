'use client';

import { motion } from 'framer-motion';

const benefitsLeft = [
  { title: "There's so much choice", desc: "From sourdough to rye, our variety caters to every palate and meal." },
  { title: "It tastes great", desc: "Nothing beats the aroma and flavor of bread fresh from our stone oven." },
  { title: "Probiotic properties", desc: "Our long fermentation process helps in maintaining healthy gut flora." }
];

const benefitsRight = [
  { title: "Fuel for longer", desc: "Complex carbohydrates provide sustained energy throughout your busy day." },
  { title: "Folic acid boost", desc: "Naturally enriched with essential nutrients for your daily wellness." },
  { title: "It's cost effective", desc: "Nutritious, filling, and affordable—the perfect staple for any home." }
];

export default function BreadBenefits() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
        <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">Benefits Of Breads</h2>
        <p className="text-muted leading-relaxed">
          More than just a staple, our artisanal bread is a powerhouse of nutrition and flavor. 
          Discover why our community loves our daily bakes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* Left Benefits */}
        <div className="space-y-10">
          {benefitsLeft.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#FFF8F0] p-6 rounded-[2rem] shadow-soft border border-brown/5 group hover:bg-caramel/5 transition-colors"
            >
              <h3 className="text-lg font-bold text-brown mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Center Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative flex justify-center items-center"
        >
          <div className="absolute inset-0 bg-caramel/5 rounded-full blur-[80px]" />
          <motion.img 
            src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800" 
            alt="Round Sourdough" 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-[420px] aspect-square object-cover rounded-full border-8 border-white shadow-2xl drop-shadow-2xl"
          />
        </motion.div>

        {/* Right Benefits */}
        <div className="space-y-10">
          {benefitsRight.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#FFF8F0] p-6 rounded-[2rem] shadow-soft border border-brown/5 group hover:bg-caramel/5 transition-colors"
            >
              <h3 className="text-lg font-bold text-brown mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
