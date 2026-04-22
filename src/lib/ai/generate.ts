import { geminiModel } from './gemini';

export interface GeneratedCard {
  question: string;
  answer: string;
  type: string;
  topic: string;
}

function parseJSON(text: string): { cards: GeneratedCard[] } {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse JSON from AI response:', cleaned);
    throw new Error('Failed to parse JSON from AI response');
  }
}

export async function generateCardsFromText(text: string): Promise<GeneratedCard[]> {
  const prompt = `
Generate flashcards like a great teacher helping a student truly understand the topic.

Do NOT copy sentences.

FLASHCARD RULES:
- Answerable in <10 seconds
- Easy to revise quickly
- Focused on ONE idea

Ensure Questions:
- Are short, direct, and student-friendly
- Ask WHY and HOW
- Avoid verbosity

Ensure Answers:
- Are CRISP and extremely short
- Maximum 2-3 lines
- Use bullet points instead of paragraphs

Application Questions:
- Keep to 1-step reasoning
- NO long story problems or paragraphs

Force output to include:
- 2 conceptual (why/how)
- 1 tricky/misconception
- 1 application/problem
- 1 relationship
- max 2 definitions

Filter low quality cards:
- Remove cards that are too obvious
- Remove cards that copy text directly
- Remove cards that add no learning value

Return ONLY valid JSON.
Do not wrap the response in markdown.
Do not add any text before or after the JSON.
Do not use unescaped double quotes inside string values.

Return exactly this shape:
{
  "cards": [
    {
      "question": "Question text",
      "answer": "Answer text",
      "type": "Concept|Definition|Relationship|Application",
      "topic": "Main topic keyword"
    }
  ]
}

Text to analyze:
${text}
  `.trim();

  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const content = result.response.text();

    console.log('Gemini response:', content);

    if (!content) {
      throw new Error('No content returned from Gemini');
    }

    const parsed = parseJSON(content);

    if (!parsed.cards || !Array.isArray(parsed.cards)) {
      throw new Error('Parsed JSON does not contain a "cards" array');
    }

    return parsed.cards.map((card) => ({
      question: String(card.question || '').replace(/\`/g, '').trim(),
      answer: String(card.answer || '').replace(/\`/g, '').trim(),
      type: String(card.type || '').trim(),
      topic: String(card.topic || '').trim(),
    }));
  } catch (error) {
    console.error('Error generating cards with Gemini:', error);
    throw error;
  }
}