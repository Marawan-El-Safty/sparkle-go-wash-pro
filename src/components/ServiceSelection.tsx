import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Truck, CarTaxiFront, Check, Star, Droplets, Sparkles, Shield } from "lucide-react";

const vehicles = [
  { id: "sedan", name: "Sedan", icon: Car, price: 50, description: "Standard 4-door cars" },
  { id: "suv", name: "SUV", icon: CarTaxiFront, price: 75, description: "SUVs & Crossovers" },
  { id: "truck", name: "Truck", icon: Truck, price: 90, description: "Pickup trucks & Vans" }
];

const packages = [
  {
    id: "basic",
    name: "Basic Wash",
    description: "Essential exterior cleaning",
    features: ["Exterior wash", "Tire cleaning", "Basic dry"],
    multiplier: 1,
    icon: Droplets,
    popular: false
  },
  {
    id: "premium",
    name: "Premium Detail", 
    description: "Complete interior & exterior",
    features: ["Everything in Basic", "Interior vacuum", "Dashboard cleaning", "Window cleaning"],
    multiplier: 2,
    icon: Sparkles,
    popular: true
  },
  {
    id: "deluxe",
    name: "Deluxe Protection",
    description: "Ultimate care & protection",
    features: ["Everything in Premium", "Wax coating", "Leather conditioning", "Air freshener"],
    multiplier: 3,
    icon: Shield,
    popular: false
  }
];

const ServiceSelection = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("sedan");
  const [selectedPackage, setSelectedPackage] = useState("premium");

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedPackageData = packages.find(p => p.id === selectedPackage);
  const totalPrice = selectedVehicleData && selectedPackageData 
    ? selectedVehicleData.price * selectedPackageData.multiplier 
    : 0;

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

        {/* Vehicle Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Vehicle Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {vehicles.map((vehicle) => {
              const Icon = vehicle.icon;
              const isSelected = selectedVehicle === vehicle.id;
              
              return (
                <Card 
                  key={vehicle.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-card transform hover:scale-[1.02] ${
                    isSelected 
                      ? 'ring-2 ring-primary shadow-button bg-gradient-card' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className={`w-12 h-12 mx-auto mb-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h4 className="font-semibold text-lg text-foreground">{vehicle.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{vehicle.description}</p>
                    <div className="text-2xl font-bold text-primary">
                      {vehicle.price} EGP
                      <span className="text-sm text-muted-foreground font-normal"> base</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Service Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              const isSelected = selectedPackage === pkg.id;
              const price = selectedVehicleData ? selectedVehicleData.price * pkg.multiplier : 0;
              
              return (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-card relative ${
                    isSelected 
                      ? 'ring-2 ring-primary shadow-glow bg-gradient-card transform scale-[1.02]' 
                      : 'hover:shadow-lg hover:scale-[1.01]'
                  } ${pkg.popular ? 'border-secondary' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-secondary text-secondary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                    <div className="text-2xl font-bold text-primary">
                      {price} EGP
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Price Summary & CTA */}
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-card shadow-glow border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <h4 className="text-lg font-semibold text-foreground mb-2">Total Price</h4>
              <div className="text-3xl font-bold text-primary mb-4">
                {totalPrice} EGP
              </div>
              <div className="text-sm text-muted-foreground mb-6">
                {selectedVehicleData?.name} • {selectedPackageData?.name}
              </div>
              <Button variant="hero" size="lg" className="w-full">
                Continue to Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;