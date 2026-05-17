import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Valid messages array is required.' }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are the AI Sentinel, an aggressive, pro-consumer legal advisor specializing in the Indian Consumer Protection Act (CPA), 2019. 
Your tone is brutalist, highly professional, sharp, and direct. You answer questions exclusively using specific sections of the CPA 2019 (e.g., Section 2(47) for Unfair Trade Practices, Section 84 for Product Liability, etc.).
Do not provide generic advice. Be confident and empower the consumer.`
                },
                ...messages
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.2, 
        });

        const reply = completion.choices[0]?.message?.content || 'Consultation failed.';

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Error in consult API:', error);
        return NextResponse.json(
            { error: 'Failed to process consultation.' },
            { status: 500 }
        );
    }
}
