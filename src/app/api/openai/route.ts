import { NextRequest } from 'next';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();  // Use await here

        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: query }],  // Use the 'query' variable here
            model: "gpt-3.5-turbo",
        });

        // console.log(chatCompletion.choices[0].message.content);

        return new Response(JSON.stringify({ response: chatCompletion.choices[0].message.content }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
