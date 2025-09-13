import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, User, CheckCircle, Loader2 } from "lucide-react";
import { useBooking, BookingData } from "@/hooks/use-booking";
import { Service } from "@/hooks/use-services";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

interface BookingFlowProps {
  selectedService?: Service;
}

const BookingFlow = ({ selectedService }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    address: "",
    phone: "",
    name: "",
    notes: ""
  });
  
  const { createBooking, isSubmitting } = useBooking();

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) {
      alert("Please select a service first");
      return;
    }

    try {
      const bookingPayload: BookingData = {
        serviceId: selectedService.id,
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
        phone: bookingData.phone,
        name: bookingData.name,
        notes: bookingData.notes
      };

      await createBooking(bookingPayload);
      
      // Reset form and go to success step
      setCurrentStep(5);
      setBookingData({
        date: "",
        time: "",
        address: "",
        phone: "",
        name: "",
        notes: ""
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const steps = [
    { number: 1, title: "Date & Time", icon: Calendar },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Contact Info", icon: User },
    { number: 4, title: "Review", icon: CheckCircle }
  ];

  if (!selectedService) {
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Book Your Service</h2>
            <p className="text-muted-foreground mb-8">Please select a service from above to continue with your booking.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          {currentStep < 5 && (
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
          )}

          {/* Step Content */}
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {currentStep < 5 ? steps[currentStep - 1].title : "Booking Confirmed!"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="date" className="text-base font-semibold text-foreground mb-2 block">
                      Select Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-base font-semibold text-foreground mb-4 block">
                      Available Time Slots
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={bookingData.time === time ? "default" : "outline"}
                          onClick={() => handleInputChange("time", time)}
                          className="h-12 transition-all duration-300"
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
                    <Label htmlFor="address" className="text-base font-semibold text-foreground mb-2 block">
                      Service Location
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter your full address (Building, Street, Area, City)"
                      value={bookingData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Please provide a detailed address so our team can find you easily
                    </p>
                  </div>
                  
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="p-4 text-center">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        We provide mobile car wash services at your location
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold text-foreground mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={bookingData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold text-foreground mb-2 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="01X XXXX XXXX"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      We'll use this number to contact you about your booking
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base font-semibold text-foreground mb-2 block">
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for our team..."
                      value={bookingData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-card p-6 rounded-xl border border-primary/20">
                    <h4 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-secondary" />
                      Booking Summary
                    </h4>
                    <div className="space-y-3 text-sm">
                      {selectedService && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="text-foreground">{selectedService.name}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="text-foreground">{bookingData.date || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-foreground">{bookingData.time || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-foreground">{bookingData.address || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="text-foreground">{bookingData.name} ({bookingData.phone})</span>
                      </div>
                      {bookingData.notes && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Notes:</span>
                          <span className="text-foreground">{bookingData.notes}</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-3 mt-4">
                        <div className="flex justify-between font-semibold text-base">
                          <span className="text-foreground">Total:</span>
                          <span className="text-primary">{selectedService?.price || 0} EGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {currentStep === 5 && (
                <div className="text-center space-y-6">
                  <CheckCircle className="w-16 h-16 text-secondary mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                    <p className="text-muted-foreground">
                      Your car wash appointment has been successfully booked. 
                      You will receive a confirmation email shortly.
                    </p>
                  </div>
                  <Button 
                    variant="hero" 
                    size="lg" 
                    onClick={() => {
                      setCurrentStep(1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Book Another Service
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between pt-6 border-t border-border">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                  
                  <div className={currentStep === 1 ? "ml-auto" : ""}>
                    {currentStep < 4 ? (
                      <Button 
                        variant="hero" 
                        onClick={nextStep}
                        className="px-8"
                        disabled={
                          (currentStep === 1 && (!bookingData.date || !bookingData.time)) ||
                          (currentStep === 2 && !bookingData.address) ||
                          (currentStep === 3 && (!bookingData.name || !bookingData.phone))
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        variant="hero" 
                        className="px-8"
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting || !selectedService}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating Booking...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;