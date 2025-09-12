// Update this page (the content is just a fallback if you fail to update the page)

import Hero from "@/components/Hero";
import ServiceSelection from "@/components/ServiceSelection";
import BookingFlow from "@/components/BookingFlow";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ServiceSelection />
      <BookingFlow />
    </div>
  );
};

export default Index;
