const pdfParse = require('pdf-parse/lib/pdf-parse.js');

function cleanText(text: string) {
  return text
    .replace(/â/g, "")
    .replace(/√/g, "sqrt")
    .replace(/²/g, "^2")
    .replace(/→/g, "=>")
    .replace(/\s+/g, " ")
    .trim();
}

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const parse = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
    const data = await parse(buffer);
    
    const cleanedText = cleanText(data.text);
    console.log("PDF Extracted text (first 500 chars):", cleanedText.substring(0, 500));
    
    return cleanedText;
  } catch (error) {
    console.error("PDF parsing failed:", error);
    throw new Error("Failed to parse PDF");
  }
}

export function chunkText(text: string, maxChunkLength: number = 2000): string[] {
  // Simple paragraph-based chunking
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxChunkLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = p;
    } else {
      currentChunk += '\n\n' + p;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
