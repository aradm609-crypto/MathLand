// Safe mathematical expression evaluator — shunting-yard algorithm, NO eval()
// Supports: + - * / ^ ( ) sqrt() and decimal numbers

type Token =
  | { type: 'num'; value: number }
  | { type: 'op'; value: string }
  | { type: 'func'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' };

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 4,
  'u-': 3,
  'u+': 3,
};

const RIGHT_ASSOC = new Set(['^', 'u-', 'u+']);

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  // Normalize Persian/Arabic digits to Latin
  const s = input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  while (i < s.length) {
    const ch = s[i];
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < s.length && /[0-9.]/.test(s[i])) {
        num += s[i];
        i++;
      }
      if (num === '.' || (num.match(/\./g) || []).length > 1) throw new Error('عدد نامعتبر: ' + num);
      const val = parseFloat(num);
      if (isNaN(val)) throw new Error('عدد نامعتبر: ' + num);
      tokens.push({ type: 'num', value: val });
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }
    // functions & constants
    if (/[a-z]/i.test(ch)) {
      let name = '';
      while (i < s.length && /[a-z]/i.test(s[i])) {
        name += s[i];
        i++;
      }
      const lower = name.toLowerCase();
      if (lower === 'pi') {
        tokens.push({ type: 'num', value: Math.PI });
        continue;
      }
      if (lower === 'e') {
        tokens.push({ type: 'num', value: Math.E });
        continue;
      }
      if (lower === 'sqrt') {
        tokens.push({ type: 'func', value: 'sqrt' });
        continue;
      }
      throw new Error('تابع ناشناخته: ' + name);
    }
    if ('+-*/^'.includes(ch)) {
      // Unary signs are separate operators so negative exponents work correctly.
      if (ch === '-' || ch === '+') {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === 'op' || prev.type === 'lparen' || prev.type === 'func') {
          tokens.push({ type: 'op', value: ch === '-' ? 'u-' : 'u+' });
          i++;
          continue;
        }
      }
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    throw new Error('نویسه نامعتبر: ' + ch);
  }
  return tokens;
}

function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];
  for (const t of tokens) {
    if (t.type === 'num') {
      output.push(t);
    } else if (t.type === 'func') {
      stack.push(t);
    } else if (t.type === 'op') {
      if (t.value !== 'u-' && t.value !== 'u+') {
        while (
          stack.length &&
          stack[stack.length - 1].type === 'op' &&
          (PRECEDENCE[(stack[stack.length - 1] as { type: 'op'; value: string }).value] > PRECEDENCE[t.value] ||
            (PRECEDENCE[(stack[stack.length - 1] as { type: 'op'; value: string }).value] === PRECEDENCE[t.value] && !RIGHT_ASSOC.has(t.value)))
        ) {
          output.push(stack.pop()!);
        }
      }
      stack.push(t);
    } else if (t.type === 'lparen') {
      stack.push(t);
    } else if (t.type === 'rparen') {
      while (stack.length && stack[stack.length - 1].type !== 'lparen') {
        output.push(stack.pop()!);
      }
      if (!stack.length) throw new Error('پرانتز بسته اضافی');
      stack.pop(); // lparen
      if (stack.length && stack[stack.length - 1].type === 'func') {
        output.push(stack.pop()!);
      }
    }
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.type === 'lparen' || top.type === 'rparen') throw new Error('پرانتز نابسته');
    output.push(top);
  }
  return output;
}

function evalRPN(rpn: Token[]): number {
  const stack: number[] = [];
  for (const t of rpn) {
    if (t.type === 'num') {
      stack.push(t.value);
    } else if (t.type === 'func') {
      const a = stack.pop();
      if (a === undefined) throw new Error('عملوند ناکافی');
      if (t.value === 'sqrt') {
        if (a < 0) throw new Error('ریشه عدد منفی تعریف‌نشده');
        stack.push(Math.sqrt(a));
      }
    } else if (t.type === 'op') {
      if (t.value === 'u-' || t.value === 'u+') {
        const value = stack.pop();
        if (value === undefined) throw new Error('عملوند ناکافی');
        stack.push(t.value === 'u-' ? -value : value);
        continue;
      }
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('عملوند ناکافی');
      switch (t.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('تقسیم بر صفر');
          stack.push(a / b);
          break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  }
  if (stack.length !== 1) throw new Error('عبارت نامعتبر');
  return stack[0];
}

export function evaluateExpression(input: string): number {
  if (!input.trim()) throw new Error('عبارت خالی است');
  const tokens = tokenize(input);
  const rpn = toRPN(tokens);
  const result = evalRPN(rpn);
  if (!isFinite(result)) throw new Error('نتیجه نامعتبر');
  return result;
}

export function formatResult(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(8)).toString();
}
