import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
}

serve( async (req: any) => {
    if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const { amount, orderId, successUrl, cancelUrl } = await req.json()

  const body = new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price_data][currency]': 'rub',
    'line_items[0][price_data][product_data][name]': `Заказ #${orderId} — New Balance`,
    'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
    'line_items[0][quantity]': '1',
    'mode': 'payment',
    'success_url': successUrl,
    'cancel_url': cancelUrl,
  })

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const session = await response.json()

  if (!response.ok) {
    return new Response(JSON.stringify({ error: session.error?.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})