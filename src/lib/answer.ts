import { evaluateExpression } from '@/lib/calculator';

function normalizeAnswer(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[−–]/g, '-')
    .replace(/٫/g, '.')
    .replace(/√/g, 'sqrt')
    .replace(/\$\$?/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\pi/g, 'pi')
    .replace(/\\times|\\cdot/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\ne/g, '!=')
    .replace(/\\le/g, '<=')
    .replace(/\\ge/g, '>=')
    .replace(/\\circ/g, '°')
    .replace(/\\%/g, '%')
    .replace(/\^\{([^{}]+)\}/g, '^$1')
    .replace(/[{}]/g, '')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function numericValue(value: string): number | null {
  let expression = normalizeAnswer(value);
  expression = expression.replace(/^[a-z]=/, '');
  if (!/^[0-9.+*/^()\-a-z]+$/.test(expression)) return null;
  if (expression.replace(/sqrt|pi/g, '').match(/[a-z]/)) return null;
  try {
    return evaluateExpression(expression);
  } catch {
    return null;
  }
}

/** Compares common student answer formats without treating different algebraic forms as equal. */
export function answersMatch(userAnswer: string, expectedAnswer: string): boolean {
  const user = normalizeAnswer(userAnswer);
  const expected = normalizeAnswer(expectedAnswer);
  if (!user || !expected) return false;
  if (user === expected) return true;

  const userNumber = numericValue(userAnswer);
  const expectedNumber = numericValue(expectedAnswer);
  if (userNumber === null || expectedNumber === null) return false;
  const tolerance = 1e-9 * Math.max(1, Math.abs(expectedNumber));
  return Math.abs(userNumber - expectedNumber) <= tolerance;
}
