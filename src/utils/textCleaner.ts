/**
 * Cleans raw OCR output and converts it to a mathjs-compatible expression.
 */
export function cleanMathText(rawText: string): string {
  let text = rawText;

  // Normalize line breaks
  text = text.replace(/[\n\r]+/g, ' ');

  // ── Multiplication ──────────────────────────────────────────────────────────
  text = text.replace(/[×✕✖⊗]/g, '*');
  text = text.replace(/(\d)\s*[xX]\s*(\d)/g, '$1 * $2'); // digit x digit

  // ── Division ────────────────────────────────────────────────────────────────
  text = text.replace(/[÷⊘]/g, '/');

  // ── Superscripts → ^ ────────────────────────────────────────────────────────
  const superMap: Record<string, string> = {
    '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
    '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
  };
  for (const [sup, rep] of Object.entries(superMap)) {
    text = text.replace(new RegExp(sup, 'g'), rep);
  }

  // ── Square / Cube roots ─────────────────────────────────────────────────────
  text = text.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
  text = text.replace(/√(\d+)/g, 'sqrt($1)');
  text = text.replace(/√/g, 'sqrt');
  text = text.replace(/∛\(([^)]+)\)/g, 'cbrt($1)');
  text = text.replace(/∛(\d+)/g, 'cbrt($1)');

  // ── Greek letters ───────────────────────────────────────────────────────────
  text = text.replace(/π/g, 'pi');
  text = text.replace(/Π/g, 'pi');
  text = text.replace(/τ/g, 'tau');

  // ── Percentages ─────────────────────────────────────────────────────────────
  text = text.replace(/(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/gi, '($1/100)*$2');
  text = text.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  // ── Fix spaced digits (OCR splits numbers: "1 5" → "15") ────────────────────
  // Only merge if not separated by an operator
  text = text.replace(/(\d)\s(?=[0-9]{1,2}(?!\s*[+\-*/^(]))/g, '$1');

  // ── Common OCR letter/number confusions ─────────────────────────────────────
  // Only apply in numeric context (not for variable-like expressions)
  text = text.replace(/\bO\b/g, '0');  // letter O → 0
  text = text.replace(/\bl\b/g, '1');  // lowercase l → 1
  text = text.replace(/\bI\b/g, '1');  // uppercase I → 1 (when alone)
  text = text.replace(/\bS\b/g, '5');  // S → 5 in pure number contexts

  // ── Minus sign variants ──────────────────────────────────────────────────────
  text = text.replace(/[–—−]/g, '-');

  // ── Fractions (fraction bar, mixed numbers) ──────────────────────────────────
  // "3/4" stays as is; "1 3/4" → "(1 + 3/4)"
  text = text.replace(/(\d+)\s+(\d+)\/(\d+)/g, '($1 + $2/$3)');

  // ── Remove trailing = sign ───────────────────────────────────────────────────
  text = text.replace(/=\s*$/, '');

  // ── Remove stray question marks ──────────────────────────────────────────────
  text = text.replace(/\?/g, '');

  // ── Normalize spaces ─────────────────────────────────────────────────────────
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Attempts to extract the most likely math expression from multi-line OCR output.
 */
export function extractBestExpression(ocrText: string): string {
  const lines = ocrText.split(/\n/).map(l => l.trim()).filter(Boolean);

  // Score each line: higher score = more math-like
  const scored = lines.map(line => {
    const cleaned = cleanMathText(line);
    let score = 0;
    // Rewards
    if (/\d/.test(cleaned)) score += 5;
    if (/[+\-*/^]/.test(cleaned)) score += 4;
    if (/[()=]/.test(cleaned)) score += 2;
    if (/sqrt|sin|cos|tan|log/i.test(cleaned)) score += 3;
    // Penalties
    if (/[a-zA-Z]{3,}/.test(cleaned)) score -= 3;   // long words
    if (cleaned.length < 2) score -= 10;
    return { cleaned, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0].cleaned : cleanMathText(ocrText);
}

/**
 * Basic validation: does it look like a math expression?
 */
export function isValidMathExpression(expr: string): boolean {
  if (!expr || expr.length === 0) return false;
  if (!/\d/.test(expr)) return false;
  if (/^[a-zA-Z\s]+$/.test(expr)) return false; // pure text
  return true;
}
