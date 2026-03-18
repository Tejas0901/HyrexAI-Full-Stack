import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductDemo from "@/components/ProductDemo";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Integrations from "@/components/Integrations";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <ProductDemo />
      <HowItWorks />
      <Benefits />
      <Integrations />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
