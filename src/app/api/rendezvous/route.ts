import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { budget, vibe, targetPerson } = await req.json();

    const prompt = `You are a premium AI Concierge in Washington, D.C. Your job is to recommend the perfect meeting spot for a grad student to meet "${targetPerson}" based on these parameters:
    - Vibe: ${vibe}
    - Budget: ${budget} out of 3 dollar signs.
    
    If they choose a Quiet Coffee vibe, warmly recommend Tatte Bakery & Cafe or Compass Coffee.
    Return ONLY a JSON object (no markdown, no backticks) with this structure:
    {
      "name": "Venue Name",
      "address": "Full Street Address, Washington, DC",
      "distance": "e.g., 1.2 miles away (Midpoint)",
      "matchQuality": "e.g., 98% Match for your parameters"
    }`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      temperature: 0.7,
      system: "You are a master JSON generator. You exclusively output raw valid JSON.",
      messages: [{ role: "user", content: prompt }]
    });

    const responseText = (msg.content[0] as any).text;
    const venueData = JSON.parse(responseText);

    return NextResponse.json(venueData);
  } catch (error: any) {
    console.error("Rendezvous generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
