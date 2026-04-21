import { geminiModel } from './gemini';

export interface GeneratedCard {
  question: string;
  answer: string;
  type: string;
  topic: string;
}

function parseJSON(text: string): { cards: GeneratedCard[] } {
  // Try to find a JSON block using regex if it's wrapped in markdown
  const jsonBlockMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);

  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return JSON.parse(jsonBlockMatch[1]);
  }

  // Fallback: try finding the first { and last }
  const startIdx = text.indexOf('{');
  const endIdx = text.lastIndexOf('}');

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const jsonStr = text.substring(startIdx, endIdx + 1);
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse extracted JSON:', jsonStr);
      throw new Error('Failed to parse JSON from AI response');
    }
  }

  // Direct parse as a last resort
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse direct text as JSON:', text);
    throw new Error('AI response was not valid JSON');
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
- Avoid verbosity (e.g., Use "How does the discriminant decide roots?" instead of "Explain how the value of the discriminant...")

Ensure Answers:
- Are CRISP and extremely short
- Maximum 2-3 lines
- Use bullet points instead of paragraphs
- Example: 
  - Positive => 2 roots
  - Zero => 1 root
  - Negative => 0 roots

Application Questions:
- Keep to 1-step reasoning
- NO long story problems or paragraphs

Force output to include:
- 2 conceptual (why/how)
- 1 tricky/misconception
- 1 application/problem
- 1 relationship
- max 2 definitions

Examples of high-value cards:
- Why must a ≠ 0 in a quadratic equation?
- Why does a negative discriminant give no real roots?
- Can a quadratic equation have exactly one root? When?
- What mistake happens if we treat a = 0 as quadratic?
- Explain how factorization gives roots 2 and 3 for x^2 - 5x + 6 = 0

Filter low quality cards:
- Remove cards that are too obvious
- Remove cards that copy text directly
- Remove cards that add no learning value

Respond ONLY with a JSON object in the following format, with no markdown formatting or other text:
{
  "cards": [
    {
      "question": "Question text",
      "answer": "Answer text",
      "type": "Concept|Definition|Relationship|Example",
      "topic": "Main topic keyword"
    }
  ]
}

Text to analyze:
${text}
  `.trim();

  try {
    const result = await geminiModel.generateContent(prompt);

    const response = await result.response;
    const content = response.text();

    console.log("Gemini response:", content);

    if (!content) {
      throw new Error('No content returned from Gemini');
    }

    const parsed = parseJSON(content);

    if (!parsed.cards || !Array.isArray(parsed.cards)) {
      throw new Error('Parsed JSON does not contain a "cards" array');
    }

    // Clean up markdown backticks from final text
    return parsed.cards.map(card => ({
      ...card,
      question: card.question.replace(/\`/g, ""),
      answer: card.answer.replace(/\`/g, "")
    }));
  } catch (error) {
    console.error('Error generating cards with Gemini:', error);
    throw error;
  }
}
