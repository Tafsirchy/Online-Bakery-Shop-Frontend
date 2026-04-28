import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyUs from '@/components/home/WhyUs';
import ScrollingMarquee from '@/components/home/ScrollingMarquee';
import OfferSlider from '@/components/home/OfferSlider';
import BreadBenefits from '@/components/home/BreadBenefits';
import FreshBakes from '@/components/home/FreshBakes';
import HomeSweetBakery from '@/components/home/HomeSweetBakery';
import BreadBanner from '@/components/home/BreadBanner';
import Testimonials from '@/components/home/Testimonials';
import ContactUs from '@/components/home/ContactUs';
import DeliveryMap from '@/components/home/DeliveryMap';
import Newsletter from '@/components/home/Newsletter';
import PageWrapper from '@/components/shared/PageWrapper';

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-0 overflow-x-hidden">
        <Hero />
        <ScrollingMarquee />
        <OfferSlider />
        <Categories />
        <FeaturedProducts />
        <WhyUs />
        <BreadBenefits />
        <HomeSweetBakery />
        <FreshBakes />
        <BreadBanner />
        <Testimonials />
        <DeliveryMap />
        <ContactUs />
        <Newsletter />
      </div>
    </PageWrapper>
  );
}
