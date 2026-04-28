'use client';

import { motion } from 'framer-motion';
import PageWrapper from '@/components/shared/PageWrapper';
import { Heart, Leaf, Users, Quote } from 'lucide-react';

export default function StoryPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16 md:space-y-32 overflow-hidden">
        {/* Hero Section */}
        <section className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-caramel font-bold tracking-widest uppercase text-[10px] md:text-sm"
          >
            Our Journey
          </motion.span>
          <h1 className="text-4xl md:text-8xl font-serif text-brown leading-tight">
            Baked with <span className="italic font-normal text-caramel">Tradition</span>, <br className="hidden md:block" /> 
            Served with Love
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
            From a tiny kitchen in the heart of the city to your favorite artisanal bakery, 
            our story has always been about one thing: the perfect bake.
          </p>
        </section>

        {/* The Founder's Tale */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-caramel/10 -m-4 md:-m-6 rounded-[2rem] md:rounded-[3rem] -z-10 rotate-3 transition-transform group-hover:rotate-1" />
            <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-warm border-4 md:border-8 border-cream-highlight">
              <img 
                src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800" 
                alt="Our Founder" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Quote Card: Now visible on mobile, positioned absolutely on MD+ */}
            <div className="mt-8 md:mt-0 md:absolute md:-bottom-10 md:-right-10 bg-brown p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-warm text-cream max-w-xs relative z-10">
              <Quote className="w-6 h-6 md:w-8 md:h-8 text-caramel mb-4" />
              <p className="text-base md:text-lg italic font-serif leading-relaxed">
                "Bread is the soul of every meal. I wanted to bring back the patience and respect that traditional baking demands."
              </p>
              <p className="mt-4 font-bold uppercase tracking-widest text-[10px] text-caramel">Sarah Jenkins, Founder</p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 pt-8 lg:pt-0">
            <h2 className="text-3xl md:text-4xl font-serif text-brown">A Legacy of Flour and Fire</h2>
            <div className="space-y-4 md:space-y-6 text-muted text-base md:text-lg leading-relaxed">
              <p>
                Founded in 2024, The Cozy Bakery started with a simple belief: 
                that people deserve bread that hasn't been rushed. Sarah, our founder, 
                spent years traveling across European countrysides, learning the 
                secrets of long fermentation and heritage grains.
              </p>
              <p>
                Today, we maintain that same philosophy. Every sourdough starter is 
                nurtured daily, every croissant is hand-laminated over three days, 
                and every cake is baked with organic, locally sourced ingredients.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-4 md:pt-6">
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-serif text-brown">15k+</p>
                <p className="text-[10px] md:text-sm text-muted uppercase tracking-widest font-bold">Happy Customers</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-serif text-brown">50+</p>
                <p className="text-[10px] md:text-sm text-muted uppercase tracking-widest font-bold">Daily Batches</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-cream-highlight rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 border border-brown/5 shadow-soft">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-brown">What We Stand For</h2>
            <p className="text-muted text-sm md:text-lg">Our four pillars of artisanal excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              { 
                title: "Honest Ingredients", 
                desc: "No preservatives, no additives. Only pure, organic flour, seasonal fruits, and farm-fresh butter.",
                icon: Leaf 
              },
              { 
                title: "Patience & Care", 
                desc: "We don't believe in shortcuts. Time is our most important ingredient, allowing flavors to develop naturally.",
                icon: Heart 
              },
              { 
                title: "Community First", 
                desc: "We support local farmers and give back to our neighborhood, because bread is best when shared.",
                icon: Users 
              }
            ].map((value, i) => (
              <div key={i} className="text-center space-y-4 md:space-y-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl shadow-soft border border-brown/5 flex items-center justify-center mx-auto">
                  <value.icon className="w-8 h-8 md:w-10 md:h-10 text-caramel" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-brown">{value.title}</h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Quote */}
        <section className="text-center max-w-3xl mx-auto py-8 md:py-10">
          <p className="text-2xl md:text-4xl font-serif text-brown italic leading-tight">
            "Come for the scent of fresh bread, <br /> stay for the warmth of our welcome."
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
