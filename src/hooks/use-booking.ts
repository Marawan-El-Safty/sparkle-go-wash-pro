import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookingData {
  serviceId: string;
  date: string;
  time: string;
  address: string;
  phone: string;
  name: string;
  notes?: string;
}

export const useBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createBooking = async (bookingData: BookingData) => {
    try {
      setIsSubmitting(true);

      // First, create or get customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert({
          name: bookingData.name,
          email: `${bookingData.phone}@temp.com`, // Temporary email since we don't collect it
          phone: bookingData.phone,
          address: bookingData.address,
        })
        .select()
        .single();

      if (customerError) {
        console.error('Customer creation error:', customerError);
        throw new Error('Failed to create customer profile');
      }

      // Get service details for total amount
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('price')
        .eq('id', bookingData.serviceId)
        .single();

      if (serviceError) {
        console.error('Service fetch error:', serviceError);
        throw new Error('Failed to fetch service details');
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: customer.id,
          service_id: bookingData.serviceId,
          booking_date: bookingData.date,
          booking_time: bookingData.time,
          total_amount: service.price,
          notes: bookingData.notes,
          status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw new Error('Failed to create booking');
      }

      // Send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
          body: {
            bookingId: booking.id,
            customerEmail: customer.email,
            customerName: customer.name,
          }
        });

        if (emailError) {
          console.error('Email sending error:', emailError);
          // Don't throw error here, booking is still successful
          toast({
            title: "Booking Created",
            description: "Booking confirmed successfully, but confirmation email failed to send.",
            variant: "default",
          });
        } else {
          toast({
            title: "Booking Confirmed!",
            description: "Your booking has been confirmed and a confirmation email has been sent.",
            variant: "default",
          });
        }
      } catch (emailError) {
        console.error('Email function error:', emailError);
        toast({
          title: "Booking Created",
          description: "Booking confirmed successfully, but confirmation email failed to send.",
          variant: "default",
        });
      }

      return { booking, customer };

    } catch (error: any) {
      console.error('Booking creation failed:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createBooking, isSubmitting };
};