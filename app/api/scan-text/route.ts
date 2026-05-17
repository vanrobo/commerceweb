import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: 'Text input is required.' }, { status: 400 });
        }

        const prompt = `
Analyze the following promotional text, SMS, or URL for Dark Patterns and CPA 2019 violations.
Determine if it is a trap. Be extremely strict.
Look for: Artificial Urgency (e.g. "Only 2 left!", "Offer expires in 5 mins"), Bait & Switch, Hidden Subscriptions, Forced Continuity, or Deceptive Marketing.

Text to Analyze:
"${text}"

Return your response strictly in the following JSON format without markdown code blocks:
{
  "isTrap": boolean,
  "severity": "low" | "medium" | "high" | "none",
  "reason": "A 1-2 sentence brutal, direct explanation of the specific dark pattern or CPA violation.",
  "title": "A 2-4 word classification of the trap"
}
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an aggressive AI Sentinel analyzing e-commerce dark patterns. Output ONLY valid JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.1-8b-instant', // Faster model for quick scanning
            temperature: 0.1, 
            response_format: { type: "json_object" }
        });

        const reply = completion.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(reply);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Error in scan-text API:', error);
        return NextResponse.json(
            { error: 'Failed to scan text.' },
            { status: 500 }
        );
    }
}
