import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq with the provided API key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { findings, totalMarkup } = body;

        if (!findings || findings.length === 0) {
            return NextResponse.json(
                { error: 'No findings provided to generate a notice.' },
                { status: 400 }
            );
        }

        const prompt = `
Act as an elite consumer rights attorney in India.
Draft a highly formal, aggressive, and legally airtight Redressal Notice addressed to the E-Commerce Platform.
This notice must be grounded rigorously in:
1. Section 2(47) of the Consumer Protection Act (CPA), 2019 (Unfair Trade Practices).
2. The Central Consumer Protection Authority (CCPA) "Guidelines for Prevention and Regulation of Dark Patterns, 2023" issued under Section 18 of the CPA, 2019.

Here is the exact evidence detected by our AI OCR Engine:
- Total Hidden Markup Extracted: ₹${totalMarkup.toFixed(2)}
- Specific Violations & Bounding Boxes Found:
${findings.map((f: any, i: number) => `${i + 1}. [Violation] ${f.title} (${f.type}): ${f.description} - Associated Claim Value: ₹${f.value || 0}`).join('\n')}

Notice Layout & Content Requirements (Strictly adhere to this structure):
1. HEADER: Placeholders for [Consumer Name], [Address], [City, State, PIN], [Email ID], [Phone Number], [Date] at the top, followed by [Platform Name] and its details.
2. SUBJECT: Serviced under Section 2(47) of the Consumer Protection Act, 2019 & the CCPA Guidelines for Prevention and Regulation of Dark Patterns, 2023.
3. FACTS OF THE CASE:
   - Detail the transaction date, original item price, and the exact hidden markups added incrementally without explicit consent (Drip Pricing / Sneak-into-Basket / Forced Action).
   - Reference how the platform engaged in manipulative dark pattern tactics to artificially inflate the cart value.
4. LEGAL SUBSTANTIATION:
   - Cite the CCPA Dark Patterns Guidelines, 2023, specifically highlighting the ban on "Drip Pricing" ( incremental price disclosure ) and "Sneak-into-Basket" ( pre-checked items/fees ).
   - Detail how these constitute an "Unfair Trade Practice" under Section 2(47) of the CPA, 2019.
5. CLAIMS & DEMANDS:
   - Demand an immediate refund of the full markup value: ₹${totalMarkup.toFixed(2)}.
   - Demand the immediate correction of their algorithmic drip pricing mechanisms to ensure transparent pricing under the Consumer Protection (E-Commerce) Rules, 2020.
   - Demand the removal of restrictive non-cancellation terms (Forced Actions).
6. CONSEQUENCES OF NON-COMPLIANCE: Give them a strict 15-day rectification window before initiating formal proceedings at the District Consumer Disputes Redressal Commission (NCDRC/State Commission).
7. ACKNOWLEDGMENT FORM: Standard sign-off footer for the authorized representative.

Format in clean, executive Markdown. Bold key statutory sections (e.g., **Section 2(47) of the CPA, 2019**, **CCPA Dark Patterns Guidelines, 2023**) and the financial sum of **₹${totalMarkup.toFixed(2)}**.
Do not include any conversational intro/outro. Output ONLY the legal notice markdown.
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite legal AI specializing in Indian Consumer Protection Law.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.2, // Low temperature for consistent legal tone
        });

        const noticeContent = completion.choices[0]?.message?.content || 'Failed to generate legal notice.';

        return NextResponse.json({ notice: noticeContent });
    } catch (error) {
        console.error('Error generating notice via Groq:', error);
        return NextResponse.json(
            { error: 'Failed to generate notice. Please try again later.' },
            { status: 500 }
        );
    }
}
