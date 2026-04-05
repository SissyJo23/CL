const SSN = /\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g;
const DOB_MDY = /\b(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:19|20)\d{2}\b/g;
const DOB_YMD = /\b(?:19|20)\d{2}[-\/](?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12]\d|3[01])\b/g;
const PHONE = /\b(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g;
const EMAIL = /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g;
const MRN = /\b(?:MRN|Medical\s+Record(?:\s+Number)?|Patient\s+ID)[:\s#]*\d+\b/gi;
const EIN = /\b\d{2}-\d{7}\b/g;

export function redactText(text: string): string {
  return text
    .replace(SSN, "[REDACTED-SSN]")
    .replace(DOB_MDY, "[REDACTED-DOB]")
    .replace(DOB_YMD, "[REDACTED-DOB]")
    .replace(PHONE, "[REDACTED-PHONE]")
    .replace(EMAIL, "[REDACTED-EMAIL]")
    .replace(MRN, "[REDACTED-MRN]")
    .replace(EIN, "[REDACTED-EIN]");
}

const PAGE_SIZE_CHARS = 15000;
const OVERLAP_CHARS = 1500;

export function splitIntoChunks(text: string): { chunk: string; chunkIndex: number; totalChunks: number }[] {
  if (text.length <= PAGE_SIZE_CHARS) {
    return [{ chunk: text, chunkIndex: 0, totalChunks: 1 }];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + PAGE_SIZE_CHARS, text.length);

    if (end < text.length) {
      const newlinePos = text.lastIndexOf("\n", end);
      if (newlinePos > start + PAGE_SIZE_CHARS * 0.5) {
        end = newlinePos + 1;
      }
    }

    chunks.push(text.slice(start, end));
    start = Math.max(start + PAGE_SIZE_CHARS - OVERLAP_CHARS, end);
    if (start >= text.length) break;
  }

  return chunks.map((chunk, i) => ({ chunk, chunkIndex: i, totalChunks: chunks.length }));
}

export function estimatePageNumber(text: string, position: number): number {
  const CHARS_PER_PAGE = PAGE_SIZE_CHARS / 10;
  return Math.max(1, Math.floor(position / CHARS_PER_PAGE) + 1);
}
