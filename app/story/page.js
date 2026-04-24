'use client';

import { motion } from 'framer-motion';
import PageWrapper from '@/components/shared/PageWrapper';
import { Heart, Leaf, Users, Quote } from 'lucide-react';

export default function StoryPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-caramel font-bold tracking-widest uppercase text-sm"
          >
            Our Journey
          </motion.span>
          <h1 className="text-6xl md:text-8xl font-serif text-brown">
            Baked with <span className="italic font-normal text-caramel">Tradition</span>, <br /> 
            Served with Love
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            From a tiny kitchen in the heart of the city to your favorite artisanal bakery, 
            our story has always been about one thing: the perfect bake.
          </p>
        </section>

        {/* The Founder's Tale */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-caramel/10 -m-6 rounded-[3rem] -z-10 rotate-3 transition-transform group-hover:rotate-1" />
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-warm border-8 border-cream-highlight">
              <img 
                src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800" 
                alt="Our Founder" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-brown p-10 rounded-[2.5rem] shadow-warm text-cream max-w-xs hidden md:block">
              <Quote className="w-8 h-8 text-caramel mb-4" />
              <p className="text-lg italic font-serif leading-relaxed">
                "Bread is the soul of every meal. I wanted to bring back the patience and respect that traditional baking demands."
              </p>
              <p className="mt-4 font-bold uppercase tracking-widest text-xs text-caramel">Sarah Jenkins, Founder</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-serif text-brown">A Legacy of Flour and Fire</h2>
            <div className="space-y-6 text-muted text-lg leading-relaxed">
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
            
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <p className="text-4xl font-serif text-brown">15k+</p>
                <p className="text-sm text-muted uppercase tracking-widest font-bold">Happy Customers</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-serif text-brown">50+</p>
                <p className="text-sm text-muted uppercase tracking-widest font-bold">Daily Batches</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-cream-highlight rounded-[4rem] p-12 md:p-24 border border-border-light shadow-soft">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-serif text-brown">What We Stand For</h2>
            <p className="text-muted text-lg">Our four pillars of artisanal excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
              <div key={i} className="text-center space-y-6">
                <div className="w-20 h-20 bg-background rounded-3xl shadow-soft border border-border-light flex items-center justify-center mx-auto">
                  <value.icon className="w-10 h-10 text-caramel" />
                </div>
                <h3 className="text-2xl font-serif text-brown">{value.title}</h3>
                <p className="text-muted leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Quote */}
        <section className="text-center max-w-3xl mx-auto py-10">
          <p className="text-3xl md:text-4xl font-serif text-brown italic leading-tight">
            "Come for the scent of fresh bread, <br /> stay for the warmth of our welcome."
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
