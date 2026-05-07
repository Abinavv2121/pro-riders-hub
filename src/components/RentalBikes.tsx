import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  getBikesByCategory,
  rentalCategories,
  type RentalBike,
  type RentalCategory
} from "@/data/rentalBikes";
import { AnimatePresence, motion } from "framer-motion";
import { Bike, Calendar, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface RentalBikeCardProps {
  bike: RentalBike;
  onBookNow: (bike: RentalBike) => void;
  index: number;
}

const RentalBikeCard = ({ bike, onBookNow, index }: RentalBikeCardProps) => {
  const [quantity, setQuantity] = useState(0);

  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < bike.available) setQuantity(quantity + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-300 cursor-pointer"
    >
      {/* Price Tag */}
      <span className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md">
        ₹{bike.pricePerDay}/day
      </span>

      {/* Available Tag */}
      <span className="absolute top-4 left-4 z-10 bg-green-600 text-white text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md">
        {bike.available} available
      </span>

      {/* Image */}
      <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-gray-50">
        <img
          src={bike.image}
          alt={bike.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-heading mb-1">
          {bike.brand}
        </p>
        <h3 className="font-heading font-bold text-primary text-lg mb-2 transition-colors duration-200">
          {bike.name}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-xs font-micro mb-3 line-clamp-2">
          {bike.description}
        </p>
        
        {/* Features - grey background with white text */}
        <div className="flex flex-wrap gap-2 mb-4">
          {bike.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-gray-600 text-white px-2 py-1 rounded flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-green-400" />
              {feature}
            </span>
          ))}
        </div>

        {/* Quantity Selector - grey background buttons with white icons */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">Qty:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-600 border-gray-600 hover:bg-gray-700 hover:border-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                decreaseQuantity();
              }}
              disabled={quantity <= 0}
            >
              <Minus className="h-4 w-4 text-white" />
            </Button>
            <span className="w-8 text-center font-medium text-gray-600">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-600 border-gray-600 hover:bg-gray-700 hover:border-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                increaseQuantity();
              }}
              disabled={quantity >= bike.available}
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Book Button */}
        <Button 
          className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/70 hover:outline hover:outline-2 hover:outline-primary/40 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(bike);
          }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Now - ₹{bike.pricePerDay * quantity}/day
        </Button>
      </div>
    </motion.div>
  );
};

interface BookingDialogProps {
  bike: RentalBike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDialog = ({ bike, open, onOpenChange }: BookingDialogProps) => {
  const [days, setDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!bike) return null;

  const totalPrice = bike.pricePerDay * days * quantity;

  const handleSubmit = () => {
    const bookingDetails = `
🚴 *Rental Bike Booking Request*

*Bike:* ${bike.name}
*Brand:* ${bike.brand}
*Category:* ${bike.category.toUpperCase()}

*Rental Details:*
- Number of Days: ${days}
- Quantity: ${quantity}
- Price per Day: ₹${bike.pricePerDay}
- *Total: ₹${totalPrice}*

*Customer Details:*
- Name: ${name}
- Phone: ${phone}
- Email: ${email}
- Message: ${message || "N/A"}

_Requested from Pro Riders Hub Website_
    `.trim();

    const encodedMessage = encodeURIComponent(bookingDetails);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bike className="w-5 h-5" />
            Book Rental Bike
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to book your rental bike. We'll contact you shortly.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Bike Summary */}
        <div className="bg-gray-50 rounded-lg p-4 flex gap-4">
          <img
            src={bike.image}
            alt={bike.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h4 className="font-heading font-bold text-primary">{bike.name}</h4>
            <p className="text-sm text-muted-foreground">{bike.brand}</p>
            <p className="text-primary font-medium">₹{bike.pricePerDay}/day</p>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          {/* Days and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={bike.available}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Price Calculation */}
          <div className="bg-primary/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per day:</span>
              <span>₹{bike.pricePerDay}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Days:</span>
              <span>× {days}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantity:</span>
              <span>× {quantity}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-primary">₹{totalPrice}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any special requirements or questions?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="default" 
            onClick={() => onOpenChange(false)}
            className="bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Book via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RentalBikes = () => {
  const [activeCategory, setActiveCategory] = useState<RentalCategory>("road");
  const [selectedBike, setSelectedBike] = useState<RentalBike | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookNow = (bike: RentalBike) => {
    setSelectedBike(bike);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-16">
      {/* Section Header - Bold like other pages */}
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center">
          <h2 className="font-heading font-bold text-hero-sm md:text-section text-foreground mb-3">
            Rental Bikes
          </h2>
          <p className="text-[#000000] max-w-2xl mx-auto">
            Choose from our premium selection of rental bikes. Whether you're planning a 
            weekend ride or a cycling vacation, we have the perfect bike for you.
          </p>
        </div>
      </div>

      {/* Category Tabs - Perfect styling */}
      <div className="container mx-auto px-5 md:px-8">
        <Tabs
          defaultValue="road"
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as RentalCategory)}
          className="w-full"
        >
          <div className="flex justify-center mb-8 px-4 md:px-0">
            <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted p-1 h-auto items-stretch rounded-lg">
              {rentalCategories.map((category) => (
                <TabsTrigger 
                  key={category.key} 
                  value={category.key}
                  className="font-heading font-semibold text-xs sm:text-sm py-2.5 px-2 sm:px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all h-full whitespace-normal sm:whitespace-nowrap flex items-center justify-center"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {rentalCategories.map((category) => (
            <TabsContent key={category.key} value={category.key} className="mt-0">
              <div className="text-center mb-6">
                <p className="text-gray-700">
                  {category.description}
                </p>
              </div>
              {/* Grid with proper spacing - like Shop.tsx */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="wait">
                  {getBikesByCategory(category.key).map((bike, idx) => (
                    <RentalBikeCard 
                      key={bike.id} 
                      bike={bike} 
                      onBookNow={handleBookNow}
                      index={idx}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        bike={selectedBike}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default RentalBikes;

