import * as math from 'mathjs';

export interface SolveStep {
  description: string;
  expression: string;
  result: string;
  highlight?: boolean;
}

export interface SolveResult {
  original: string;
  cleaned: string;
  result: string;
  steps: SolveStep[];
  isEquation: boolean;
  isCorrect?: boolean;
  error?: string;
  timestamp?: number;
  imageUri?: string;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatResult(value: unknown): string {
  if (typeof value === 'number') {
    if (!isFinite(value)) return value > 0 ? '∞' : '-∞';
    const rounded = parseFloat(value.toPrecision(10));
    if (Number.isInteger(rounded)) return rounded.toString();
    // Max 6 decimal digits, strip trailing zeros
    return parseFloat(rounded.toFixed(6)).toString();
  }
  if (typeof value === 'boolean') return value ? 'True ✓' : 'False ✗';
  if (value && typeof (value as any).toString === 'function') {
    return (value as any).toString();
  }
  return String(value);
}

// ─── Step Generator ───────────────────────────────────────────────────────────

function getOpName(op: string): string {
  const map: Record<string, string> = {
    '+': 'Addition',
    '-': 'Subtraction',
    '*': 'Multiplication',
    '/': 'Division',
    '^': 'Exponent',
    '%': 'Modulo',
  };
  return map[op] || `Operation (${op})`;
}

function collectSteps(node: math.MathNode, steps: SolveStep[]): string {
  // Constants
  if (node.type === 'ConstantNode') {
    return node.toString();
  }
  // Symbols (variables / constants like pi, e)
  if (node.type === 'SymbolNode') {
    try {
      const val = math.evaluate(node.toString());
      return formatResult(val);
    } catch {
      return node.toString();
    }
  }
  // Parenthesis
  if (node.type === 'ParenthesisNode') {
    return collectSteps((node as math.ParenthesisNode).content, steps);
  }
  // Unary minus
  if (node.type === 'OperatorNode') {
    const opNode = node as math.OperatorNode;
    if (opNode.args.length === 1 && opNode.op === '-') {
      const inner = collectSteps(opNode.args[0], steps);
      return '-' + inner;
    }
    if (opNode.args.length === 2) {
      const leftStr = collectSteps(opNode.args[0], steps);
      const rightStr = collectSteps(opNode.args[1], steps);
      const stepExpr = `${leftStr} ${opNode.op} ${rightStr}`;
      try {
        const result = math.evaluate(stepExpr);
        const formatted = formatResult(result);
        const leftIsLeaf = opNode.args[0].type === 'ConstantNode';
        const rightIsLeaf = opNode.args[1].type === 'ConstantNode';
        if (!leftIsLeaf || !rightIsLeaf) {
          steps.push({
            description: getOpName(opNode.op),
            expression: `${leftStr} ${opNode.op} ${rightStr}`,
            result: formatted,
          });
        }
        return formatted;
      } catch {
        return stepExpr;
      }
    }
  }
  // Functions (sqrt, sin, cos, etc.)
  if (node.type === 'FunctionNode') {
    const funcNode = node as math.FunctionNode;
    const argStrs = funcNode.args.map(a => collectSteps(a, steps));
    const callExpr = `${funcNode.name}(${argStrs.join(', ')})`;
    try {
      const result = math.evaluate(callExpr);
      const formatted = formatResult(result);
      steps.push({
        description: `Apply ${funcNode.name}()`,
        expression: callExpr,
        result: formatted,
      });
      return formatted;
    } catch {
      return callExpr;
    }
  }

  return node.toString();
}

function generateSteps(expression: string): SolveStep[] {
  const steps: SolveStep[] = [];
  try {
    const node = math.parse(expression);
    collectSteps(node, steps);
  } catch {
    // Can't generate steps
  }
  return steps;
}

// ─── Equation Solver ──────────────────────────────────────────────────────────

function solveLinear(left: string, right: string, variable: string): string | null {
  try {
    const scope: Record<string, number> = {};
    scope[variable] = 0;
    const f0 =
      (math.evaluate(left, { ...scope }) as number) -
      (math.evaluate(right, { ...scope }) as number);

    scope[variable] = 1;
    const f1 =
      (math.evaluate(left, { ...scope }) as number) -
      (math.evaluate(right, { ...scope }) as number);

    if (Math.abs(f1 - f0) < 1e-12) return null; // Not linear in variable

    const x = -f0 / (f1 - f0);

    // Verify
    scope[variable] = x;
    const check =
      (math.evaluate(left, { ...scope }) as number) -
      (math.evaluate(right, { ...scope }) as number);

    if (Math.abs(check) < 1e-6) return formatResult(x);
    return null;
  } catch {
    return null;
  }
}

function solveEquation(equation: string): SolveResult {
  const steps: SolveStep[] = [];
  const [left, right] = equation.split(/(?<![<>!])=(?!=)/).map(s => s.trim());

  if (!left || !right) throw new Error('Invalid equation');

  const varMatch = equation.match(/[a-zA-Z](?![a-zA-Z])/); // single letter variables only
  if (!varMatch) {
    // Numeric equality check
    try {
      const lv = math.evaluate(left) as number;
      const rv = math.evaluate(right) as number;
      const equal = Math.abs(lv - rv) < 1e-8;
      steps.push({
        description: 'Evaluate both sides',
        expression: `${formatResult(lv)} = ${formatResult(rv)}`,
        result: equal ? 'True ✓' : 'False ✗',
        highlight: true,
      });
      return {
        original: equation,
        cleaned: equation,
        result: equal ? 'True ✓' : 'False ✗',
        steps,
        isEquation: true,
        isCorrect: equal,
      };
    } catch {
      throw new Error('Cannot evaluate equation');
    }
  }

  const variable = varMatch[0];

  // Try linear solve
  const solution = solveLinear(left, right, variable);
  if (solution !== null) {
    steps.push({
      description: 'Identify variable',
      expression: equation,
      result: `Solve for ${variable}`,
    });
    steps.push({
      description: `Isolate ${variable}`,
      expression: `${variable} = ?`,
      result: `${variable} = ${solution}`,
      highlight: true,
    });
    // Verify step
    try {
      const scope: Record<string, number> = { [variable]: parseFloat(solution) };
      const lv = formatResult(math.evaluate(left, scope));
      const rv = formatResult(math.evaluate(right, scope));
      steps.push({
        description: 'Verify solution',
        expression: `Substitute ${variable} = ${solution}: ${lv} = ${rv}`,
        result: '✓ Correct',
      });
    } catch {}

    return {
      original: equation,
      cleaned: equation,
      result: `${variable} = ${solution}`,
      steps,
      isEquation: true,
    };
  }

  // Quadratic attempt: f(x) = 0 using Newton's method
  try {
    const f = (x: number) => {
      const scope: Record<string, number> = { [variable]: x };
      return (math.evaluate(left, scope) as number) - (math.evaluate(right, scope) as number);
    };

    const roots: number[] = [];
    // Try multiple starting points
    for (let start = -100; start <= 100; start += 10) {
      let x = start;
      for (let i = 0; i < 200; i++) {
        const fx = f(x);
        if (Math.abs(fx) < 1e-8) {
          const rounded = parseFloat(x.toFixed(6));
          if (!roots.some(r => Math.abs(r - rounded) < 1e-4)) {
            roots.push(rounded);
          }
          break;
        }
        const dx = 0.0001;
        const dfx = (f(x + dx) - fx) / dx;
        if (Math.abs(dfx) < 1e-12) break;
        x = x - fx / dfx;
      }
    }

    if (roots.length > 0) {
      const resultStr =
        roots.length === 1
          ? `${variable} = ${formatResult(roots[0])}`
          : `${variable} = ${roots.map(r => formatResult(r)).join('  or  ')}`;

      steps.push({
        description: 'Solve numerically',
        expression: equation,
        result: resultStr,
        highlight: true,
      });
      return { original: equation, cleaned: equation, result: resultStr, steps, isEquation: true };
    }
  } catch {}

  return {
    original: equation,
    cleaned: equation,
    result: 'Complex equation',
    steps: [{ description: 'Equation detected', expression: equation, result: 'Cannot auto-solve' }],
    isEquation: true,
    error: 'This equation type is too complex for automatic solving.',
  };
}

// ─── Main Solver ──────────────────────────────────────────────────────────────

export function solveExpression(expression: string): SolveResult {
  const original = expression.trim();
  const isEquation = /(?<![<>!])=(?!=)/.test(original);

  try {
    if (isEquation) return solveEquation(original);

    const result = math.evaluate(original);
    const formatted = formatResult(result);
    const steps = generateSteps(original);

    // Add final answer step with highlight
    steps.push({
      description: 'Answer',
      expression: original,
      result: formatted,
      highlight: true,
    });

    return {
      original,
      cleaned: original,
      result: formatted,
      steps,
      isEquation: false,
      timestamp: Date.now(),
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Cannot solve expression';
    return {
      original,
      cleaned: original,
      result: 'Error',
      steps: [{ description: 'Error', expression: original, result: msg }],
      isEquation,
      error: msg,
    };
  }
}
