'use client';
// A simple and safe math parser to convert a string expression into a plottable function.

const ALLOWED_CHARS_REGEX = /^[a-z0-9\s.()+\-*/^]+$/i;

// A list of Math properties that are allowed to be used.
const MATH_ALLOWLIST: { [key: string]: Function | number } = {
  // Functions
  abs: Math.abs,
  acos: Math.acos,
  acosh: Math.acosh,
  asin: Math.asin,
  asinh: Math.asinh,
  atan: Math.atan,
  atanh: Math.atanh,
  atan2: Math.atan2,
  cbrt: Math.cbrt,
  ceil: Math.ceil,
  clz32: Math.clz32,
  cos: Math.cos,
  cosh: Math.cosh,
  exp: Math.exp,
  expm1: Math.expm1,
  floor: Math.floor,
  fround: Math.fround,
  hypot: Math.hypot,
  imul: Math.imul,
  log: Math.log,
  log1p: Math.log1p,
  log10: Math.log10,
  log2: Math.log2,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  random: Math.random,
  round: Math.round,
  sign: Math.sign,
  sin: Math.sin,
  sinh: Math.sinh,
  sqrt: Math.sqrt,
  tan: Math.tan,
  tanh: Math.tanh,
  trunc: Math.trunc,
  // Constants
  E: Math.E,
  LN10: Math.LN10,
  LN2: Math.LN2,
  LOG10E: Math.LOG10E,
  LOG2E: Math.LOG2E,
  PI: Math.PI,
  SQRT1_2: Math.SQRT1_2,
  SQRT2: Math.SQRT2,
};

/**
 * Creates a JavaScript function from a math expression string.
 * This function is sandboxed and only allows access to the variable 'x' and safe Math properties.
 *
 * @param expression The math expression string, e.g., "sin(x) * 2".
 * @returns A function that takes a number 'x' and returns the result of the expression.
 * @throws An error if the expression is invalid or contains disallowed characters/properties.
 */
export function createFunction(expression: string): (x: number) => number {
  if (!expression || expression.trim() === '') {
    return () => NaN;
  }
  // 1. Character validation
  if (!ALLOWED_CHARS_REGEX.test(expression)) {
    throw new Error('Expression contains invalid characters.');
  }

  // 2. Transform expression for JS compatibility
  // Replace ^ with ** for exponentiation
  let sanitizedExpression = expression.replace(/\^/g, '**');

  // Prefix allowed Math functions/constants with "MATH_ALLOWLIST."
  const identifiers = sanitizedExpression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const seen = new Set();
  for (const identifier of identifiers) {
    if (identifier === 'x' || seen.has(identifier) || !isNaN(parseFloat(identifier))) {
      continue;
    }
    if (MATH_ALLOWLIST.hasOwnProperty(identifier)) {
        sanitizedExpression = sanitizedExpression.replace(new RegExp(`\\b${identifier}\\b`, 'g'), `MATH_ALLOWLIST.${identifier}`);
        seen.add(identifier);
    } else {
        throw new Error(`Disallowed identifier: "${identifier}"`);
    }
  }


  try {
    // 3. Create the function in a sandboxed environment
    const func = new Function('x', 'MATH_ALLOWLIST', `
      try {
        return ${sanitizedExpression};
      } catch (e) {
        return NaN;
      }
    `);

    // Bind the allowlist to the function
    return (x: number) => func(x, MATH_ALLOWLIST);
  } catch (e) {
    console.error('Error creating function:', e);
    throw new Error('Invalid mathematical expression.');
  }
}
