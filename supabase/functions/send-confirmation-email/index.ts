import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  bookingId: string;
  customerEmail: string;
  customerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, customerEmail, customerName }: EmailRequest = await req.json();
    console.log("Processing email for booking:", bookingId);

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Fetch booking details with service info
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services(name, price, description),
        customers(name, email, phone, address)
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error("Error fetching booking:", error);
      throw new Error("Booking not found");
    }

    console.log("Booking data:", booking);

    // Format date and time
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    const formattedDate = bookingDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = bookingDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "SparkleGo <booking@resend.dev>",
      to: [customerEmail],
      subject: `Booking Confirmation - ${booking.services.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #3B82F6, #06B6D4); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">SparkleGo</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your car wash booking is confirmed!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${customerName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for choosing SparkleGo! Your car wash appointment has been successfully booked.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Service:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${booking.services.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Date:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Time:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Address:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${booking.customers.address || 'Address not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 18px;">${booking.total_amount} EGP</td>
                </tr>
              </table>
            </div>

            ${booking.notes ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin: 0 0 8px 0;">Special Instructions:</h4>
              <p style="color: #92400e; margin: 0;">${booking.notes}</p>
            </div>
            ` : ''}

            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #065f46; margin: 0 0 10px 0;">What's Next?</h4>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li>Our team will arrive at your location at the scheduled time</li>
                <li>Please ensure your vehicle is accessible</li>
                <li>Payment will be collected after service completion</li>
              </ul>
            </div>

            <p style="color: #4b5563; font-size: 14px; margin: 20px 0 0 0;">
              Need to modify or cancel your booking? Contact us at <a href="mailto:support@sparklego.com" style="color: #3B82F6;">support@sparklego.com</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #9ca3af; font-size: 14px;">
              SparkleGo - Professional Mobile Car Wash Service<br>
              <a href="#" style="color: #3B82F6; text-decoration: none;">Visit our website</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);