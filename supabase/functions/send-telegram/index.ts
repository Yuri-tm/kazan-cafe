import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    if (!TELEGRAM_CHAT_ID) throw new Error('TELEGRAM_CHAT_ID is not configured');

    const { products, phone } = await req.json();
    const normalizedProducts = Array.isArray(products) ? products : [];

    const lines = normalizedProducts.map((p: { name: string; price: string }, i: number) =>
      `${i + 1}. ${p.name} — ${p.price}`
    );

    const phoneLine = phone ? `\n📞 Телефон: ${phone}` : '';
    const orderSection = normalizedProducts.length > 0
      ? `${lines.join('\n')}\n\n📦 Всего позиций: ${normalizedProducts.length}`
      : '📦 Позиции не выбраны\n📝 Клиент оставил только номер телефона';
    const message = `🍽 *Новый заказ из Тур-кафе СӘЯХӘТ*\n\n${orderSection}${phoneLine}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Telegram API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
