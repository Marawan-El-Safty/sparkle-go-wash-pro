import { useState } from "react";
import Hero from "@/components/Hero";
import ServiceSelection from "@/components/ServiceSelection";
import BookingFlow from "@/components/BookingFlow";
import { Service } from "@/hooks/use-services";

const Index = () => {
  const [selectedService, setSelectedService] = useState<Service | undefined>();

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Scroll to booking section
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <ServiceSelection 
        onServiceSelect={handleServiceSelect} 
        selectedServiceId={selectedService?.id}
      />
      <div id="booking-section">
        <BookingFlow selectedService={selectedService} />
      </div>
    </div>
  );
};

export default Index;
