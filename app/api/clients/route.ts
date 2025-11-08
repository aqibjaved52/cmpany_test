import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import type { ClientInsert } from '@/types/database';

// GET - Fetch all clients
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch clients' },
        { status: 500 }
      );
    }

    return NextResponse.json({ clients: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add a new client and send welcome email
export async function POST(request: NextRequest) {
  try {
    const body: ClientInsert = await request.json();
    const { name, email, business_name } = body;

    // Validate input
    if (!name || !email || !business_name) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, business_name' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert client into database
    const { data: client, error: dbError } = await supabaseAdmin
      .from('clients')
      .insert([{ name, email, business_name }])
      .select()
      .single();

    if (dbError) {
      console.error('Error inserting client:', dbError);
      // Check if it's a unique constraint violation
      if (dbError.code === '23505') {
        return NextResponse.json(
          { error: 'A client with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to add client' },
        { status: 500 }
      );
    }

    // Send welcome email via Resend
    let emailStatus = { sent: false, error: null as string | null };
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Welcome to Our Accounting Services, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome, ${name}!</h1>
            <p>Thank you for choosing our accounting services. We're excited to work with <strong>${business_name}</strong>.</p>
            <p>Our team will be in touch shortly to get started with your onboarding process.</p>
            <p>If you have any questions, please don't hesitate to reach out.</p>
            <br>
            <p>Best regards,<br>The Accounting Team</p>
          </div>
        `,
      });
      
      // Check if email was sent successfully
      if (emailResult?.error) {
        emailStatus.sent = false;
        emailStatus.error = emailResult.error.message || 'Failed to send email';
        console.error('Resend error:', emailResult.error.message);
      } else if (emailResult?.id || emailResult?.data?.id) {
        emailStatus.sent = true;
      } else {
        emailStatus.sent = false;
        emailStatus.error = 'Unexpected response from Resend';
      }
    } catch (emailError: any) {
      emailStatus.error = emailError?.message || 'Failed to send email';
      console.error('Error sending welcome email:', emailStatus.error);
    }

    return NextResponse.json(
      { 
        message: 'Client added successfully', 
        client,
        email: {
          sent: emailStatus.sent,
          to: email,
          error: emailStatus.error
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

