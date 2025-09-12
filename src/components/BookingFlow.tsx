import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, CreditCard, Phone, User } from "lucide-react";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const paymentMethods = [
  { id: "cash", name: "Cash on Delivery", icon: "💰" },
  { id: "card", name: "Credit Card", icon: "💳" },
  { id: "wallet", name: "Mobile Wallet", icon: "📱" }
];

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    address: "",
    phone: "",
    name: "",
    payment: "cash"
  });

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Date & Time", icon: Calendar },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Contact Info", icon: User },
    { number: 4, title: "Payment", icon: CreditCard }
  ];

  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                        : isCompleted
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex mt-4">
              {steps.slice(0, -1).map((_, index) => (
                <div 
                  key={index} 
                  className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    currentStep > index + 1 ? 'bg-secondary' : 'bg-muted'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="date" className="text-base font-medium">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="mt-2"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Available Time Slots</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={bookingData.time === time ? "default" : "outline"}
                          onClick={() => handleInputChange("time", time)}
                          className="h-12"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="address" className="text-base font-medium">Service Location</Label>
                    <Input
                      id="address"
                      placeholder="Enter your address (Building, Street, Area)"
                      value={bookingData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="p-4 text-center">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        We serve Cairo, Giza, and New Capital areas
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={bookingData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="01X XXXX XXXX"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Payment Method</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant={bookingData.payment === method.id ? "default" : "outline"}
                          onClick={() => handleInputChange("payment", method.id)}
                          className="h-16 justify-start text-left"
                        >
                          <span className="text-2xl mr-3">{method.icon}</span>
                          {method.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="bg-gradient-card border-2 border-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg mb-2">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{bookingData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{bookingData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium text-right max-w-40 truncate">{bookingData.address}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-primary">150 EGP</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <Button 
                  variant="default"
                  onClick={currentStep === 4 ? () => alert("Booking confirmed!") : nextStep}
                >
                  {currentStep === 4 ? "Confirm Booking" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;