import { Button } from "@/components/ui/button";
import { Car, MapPin, Sparkles, Star } from "lucide-react";
import heroImage from "@/assets/hero-car-wash.jpg";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary/30 rounded-full blur-2xl animate-pulse delay-1000" />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="p-3 bg-gradient-card rounded-2xl shadow-glow">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Sparkle<span className="text-secondary">Go</span>
              </h1>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Your Car Deserves 
                <span className="block bg-gradient-to-r from-secondary to-secondary-glow bg-clip-text text-transparent">
                  Premium Care
                </span>
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-lg mx-auto lg:mx-0">
                Professional mobile car wash service at your doorstep. Book in seconds, relax while we sparkle.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-sm">On-Location</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Car className="w-5 h-5 text-secondary" />
                <span className="text-sm">All Vehicles</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Star className="w-5 h-5 text-secondary" />
                <span className="text-sm">5-Star Service</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-sm">Eco-Friendly</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="shadow-glow">
                Book Your Wash
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
                View Packages
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex items-center justify-center lg:justify-start gap-8 text-primary-foreground/60">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">500+</div>
                  <div className="text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">24/7</div>
                  <div className="text-sm">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">15min</div>
                  <div className="text-sm">Avg Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImage} 
                alt="Professional car wash service - luxury sedan being detailed"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-800">Available Now</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-gray-800">4.9/5</span>
                <span className="text-xs text-gray-600">(200+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;