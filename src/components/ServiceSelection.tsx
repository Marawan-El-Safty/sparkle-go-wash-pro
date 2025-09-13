import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Loader2 } from "lucide-react";
import { useServices, Service } from "@/hooks/use-services";

interface ServiceSelectionProps {
  onServiceSelect?: (service: Service) => void;
  selectedServiceId?: string;
}

const ServiceSelection = ({ onServiceSelect, selectedServiceId }: ServiceSelectionProps) => {
  const { services, loading } = useServices();
  const [selectedService, setSelectedService] = useState<string>(selectedServiceId || "");

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service.id);
    onServiceSelect?.(service);
  };

  if (loading) {
    return (
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Service
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your vehicle type and preferred package for an instant quote
          </p>
        </div>

        {/* Service Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const isSelected = selectedService === service.id;
              const isPopular = index === 1; // Make middle service popular
              
              return (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-card relative ${
                    isSelected 
                      ? 'ring-2 ring-primary shadow-glow bg-gradient-card transform scale-[1.02]' 
                      : 'hover:shadow-lg hover:scale-[1.01]'
                  } ${isPopular ? 'border-secondary' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-secondary text-secondary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription className="min-h-[48px]">
                      {service.description || `Professional ${service.name.toLowerCase()} service`}
                    </CardDescription>
                    <div className="text-3xl font-bold text-primary">
                      {service.price} EGP
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.duration_minutes} minutes
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-foreground">Professional service</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-foreground">Mobile service at your location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-foreground">Quality guaranteed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Service Summary */}
        {selectedService && (
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-card shadow-glow border-2 border-primary/20">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-semibold text-foreground mb-2">Selected Service</h4>
                <div className="text-3xl font-bold text-primary mb-4">
                  {services.find(s => s.id === selectedService)?.price} EGP
                </div>
                <div className="text-sm text-muted-foreground mb-6">
                  {services.find(s => s.id === selectedService)?.name}
                </div>
                {onServiceSelect && (
                  <Button variant="hero" size="lg" className="w-full">
                    Continue to Booking
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;