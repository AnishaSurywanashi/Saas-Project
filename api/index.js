import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// ─── RULE-BASED COMPLEXITY ENGINE ───────────────────────────────

function analyzeComplexity(code) {
  // Normalize: strip comments and strings to avoid false positives
  const cleaned = code
    .replace(/\/\/.*$/gm, '')           // single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')   // multi-line comments
    .replace(/#.*$/gm, '')              // Python comments
    .replace(/"(?:\\.|[^"\\])*"/g, '""')  // double-quoted strings
    .replace(/'(?:\\.|[^'\\])*'/g, "''"); // single-quoted strings

  const details = [];
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';

  // ── 1. Count loops (all languages) ──
  const forPatterns = [
    /for\s*\(/g,                          // C/C++/Java/JS for(
    /for\s+\w+\s+in\s+/g,                // Python: for x in
    /for\s+\w+\s+of\s+/g,                // JS: for x of
    /forEach\s*\(/g,                      // JS: .forEach(
    /\.map\s*\(/g,                        // JS: .map(
    /\.filter\s*\(/g,                     // JS: .filter(
    /\.reduce\s*\(/g,                     // JS: .reduce(
    /for\s*\(.*:.*\)/g,                   // Java enhanced for
  ];
  const whilePatterns = [
    /while\s*\(/g,                        // while(
    /do\s*\{/g,                           // do {
  ];

  let forCount = 0;
  for (const pat of forPatterns) {
    forCount += (cleaned.match(pat) || []).length;
  }
  let whileCount = 0;
  for (const pat of whilePatterns) {
    whileCount += (cleaned.match(pat) || []).length;
  }
  const totalLoops = forCount + whileCount;

  // ── 2. Detect logarithmic patterns inside loops ──
  const hasLogPattern =
    /(\w+)\s*\/=\s*2/.test(cleaned) ||
    /(\w+)\s*\*=\s*2/.test(cleaned) ||
    /(\w+)\s*=\s*\1\s*\/\s*2/.test(cleaned) ||
    /(\w+)\s*=\s*\1\s*\*\s*2/.test(cleaned) ||
    /(\w+)\s*>>=\s*1/.test(cleaned) ||
    /(\w+)\s*<<=\s*1/.test(cleaned) ||
    /Math\.log/i.test(cleaned) ||
    /log2?\s*\(/i.test(cleaned);

  // ── 3. Detect recursion ──
  // Match named function declarations and check if the name appears inside the body
  const funcDeclPatterns = [
    /function\s+(\w+)\s*\([^)]*\)\s*\{/g,   // JS: function foo() {
    /def\s+(\w+)\s*\([^)]*\)\s*:/g,          // Python: def foo():
    /(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{/g,      // JS arrow: const foo = () => {
  ];

  let isRecursive = false;
  let recursiveFuncName = '';
  for (const pat of funcDeclPatterns) {
    let match;
    while ((match = pat.exec(cleaned)) !== null) {
      const funcName = match[1];
      const afterDecl = cleaned.slice(match.index + match[0].length);
      // Check if the function name appears as a call inside its body
      const callRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
      if (callRegex.test(afterDecl)) {
        isRecursive = true;
        recursiveFuncName = funcName;
        break;
      }
    }
    if (isRecursive) break;
  }

  // Also detect self-calls in methods (Java/C++ style)
  const methodPatterns = [
    /(?:public|private|protected|static|\w+)\s+\w+\s+(\w+)\s*\([^)]*\)\s*\{/g,  // Java methods
    /\w+\s+(\w+)\s*\([^)]*\)\s*\{/g,  // C/C++ functions
  ];
  if (!isRecursive) {
    for (const pat of methodPatterns) {
      let match;
      while ((match = pat.exec(cleaned)) !== null) {
        const funcName = match[1];
        if (['if', 'while', 'for', 'switch', 'catch', 'return'].includes(funcName)) continue;
        const afterDecl = cleaned.slice(match.index + match[0].length);
        const callRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
        if (callRegex.test(afterDecl)) {
          isRecursive = true;
          recursiveFuncName = funcName;
          break;
        }
      }
      if (isRecursive) break;
    }
  }

  // ── 4. Detect nesting depth ──
  // Walk through lines and track brace/indentation nesting of loops
  const lines = cleaned.split('\n');
  let maxLoopDepth = 0;
  let currentLoopDepth = 0;
  let braceStack = [];
  const loopStartRegex = /\b(for|while|do)\b/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (loopStartRegex.test(trimmed)) {
      currentLoopDepth++;
      if (currentLoopDepth > maxLoopDepth) maxLoopDepth = currentLoopDepth;
      braceStack.push('loop');
    } else if (trimmed.includes('{') && !loopStartRegex.test(trimmed)) {
      braceStack.push('block');
    }
    // Count closing braces
    const closingBraces = (trimmed.match(/\}/g) || []).length;
    for (let i = 0; i < closingBraces; i++) {
      if (braceStack.length > 0) {
        const popped = braceStack.pop();
        if (popped === 'loop') {
          currentLoopDepth--;
        }
      }
    }
  }

  // For Python (indentation-based), estimate nesting from consecutive for/while
  if (maxLoopDepth === 0 && totalLoops > 1) {
    // Check if loops appear to be nested by indentation
    let prevLoopIndent = -1;
    let pythonNestDepth = 0;
    let maxPythonNest = 0;
    for (const line of lines) {
      if (/^\s*(for|while)\b/.test(line)) {
        const indent = line.search(/\S/);
        if (prevLoopIndent >= 0 && indent > prevLoopIndent) {
          pythonNestDepth++;
        } else {
          pythonNestDepth = 1;
        }
        prevLoopIndent = indent;
        if (pythonNestDepth > maxPythonNest) maxPythonNest = pythonNestDepth;
      }
    }
    maxLoopDepth = maxPythonNest;
  }

  // Fallback: if we detected loops but couldn't determine nesting
  if (maxLoopDepth === 0 && totalLoops > 0) {
    maxLoopDepth = 1;
  }

  // ── 5. Detect sorting calls ──
  const hasSortCall =
    /\.sort\s*\(/i.test(cleaned) ||
    /Arrays\.sort/i.test(cleaned) ||
    /Collections\.sort/i.test(cleaned) ||
    /sorted\s*\(/i.test(cleaned) ||
    /std::sort/i.test(cleaned);

  // ── 6. Detect binary search patterns ──
  const hasBinarySearch =
    /binarySearch/i.test(cleaned) ||
    /bisect/i.test(cleaned) ||
    (/while\b/.test(cleaned) && /(low|left|lo)\s*<[=]?\s*(high|right|hi|mid)/.test(cleaned) && /mid/.test(cleaned));

  // ── 7. Build final complexity result ──

  if (isRecursive) {
    // Check if recursion has two branching calls (like fibonacci)
    const callPattern = new RegExp(`\\b${recursiveFuncName}\\s*\\(`, 'g');
    const callMatches = cleaned.match(callPattern) || [];
    const callCount = callMatches.length - 1; // subtract the declaration itself

    if (callCount >= 2) {
      if (hasLogPattern) {
        timeComplexity = 'O(n log n)';
        details.push(`Recursive function "${recursiveFuncName}" with divide-and-conquer pattern (merge sort style).`);
      } else {
        timeComplexity = 'O(2^n)';
        details.push(`Recursive function "${recursiveFuncName}" with ${callCount} branching calls detected — exponential growth.`);
      }
    } else {
      if (hasLogPattern) {
        timeComplexity = 'O(log n)';
        details.push(`Recursive function "${recursiveFuncName}" halving input each call — logarithmic.`);
      } else {
        timeComplexity = 'O(n)';
        details.push(`Recursive function "${recursiveFuncName}" with linear recursion depth.`);
      }
    }
    spaceComplexity = 'O(n)';
    details.push('Recursive call stack uses linear space.');
  } else if (hasBinarySearch) {
    timeComplexity = 'O(log n)';
    details.push('Binary search pattern detected (low/high pointers with mid calculation).');
  } else if (hasSortCall && maxLoopDepth <= 1) {
    timeComplexity = 'O(n log n)';
    details.push('Sorting function detected — most standard sorts run in O(n log n).');
  } else if (hasSortCall && maxLoopDepth >= 2) {
    timeComplexity = 'O(n² log n)';
    details.push('Sorting call inside nested loops detected.');
  } else if (totalLoops > 0) {
    if (maxLoopDepth >= 3) {
      timeComplexity = 'O(n^3)';
      details.push(`Detected ${maxLoopDepth}-level nested loops — cubic time complexity.`);
    } else if (maxLoopDepth === 2) {
      timeComplexity = 'O(n^2)';
      details.push('Detected 2 levels of nested loops — quadratic time complexity.');
    } else if (hasLogPattern) {
      timeComplexity = 'O(log n)';
      details.push('Loop with logarithmic step pattern (halving or doubling iterator).');
    } else {
      timeComplexity = 'O(n)';
      details.push(`Detected ${totalLoops} loop(s) at the same nesting level — linear time.`);
    }
  } else {
    details.push('No loops or recursion detected — constant time operations.');
  }

  // ── 8. Space complexity ──
  const hasArrayAlloc =
    /new\s+(Array|int|float|double|String|ArrayList|HashMap|HashSet|LinkedList|Vector)\s*[\[\(]/i.test(cleaned) ||
    /\[\s*\]/.test(cleaned) ||
    /\{\s*\}/.test(cleaned) ||
    /list\s*\(\s*\)/i.test(cleaned) ||
    /dict\s*\(\s*\)/i.test(cleaned) ||
    /set\s*\(\s*\)/i.test(cleaned) ||
    /=\s*\[\]/.test(cleaned) ||
    /=\s*\{\}/.test(cleaned) ||
    /\.push\s*\(/.test(cleaned) ||
    /\.append\s*\(/.test(cleaned) ||
    /\.add\s*\(/.test(cleaned);

  const hasMatrixAlloc =
    /\[\s*\[/.test(cleaned) ||
    /new\s+\w+\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]/.test(cleaned) ||
    /Array\s*\(\s*\w+\s*\)\s*\.\s*fill/.test(cleaned);

  if (!isRecursive) {
    if (hasMatrixAlloc) {
      spaceComplexity = 'O(n^2)';
      details.push('2D array/matrix allocation detected — quadratic space.');
    } else if (hasArrayAlloc && totalLoops > 0) {
      spaceComplexity = 'O(n)';
      details.push('Dynamic collection growing inside a loop — linear space.');
    } else if (hasArrayAlloc) {
      spaceComplexity = 'O(n)';
      details.push('Dynamic data structure allocation detected.');
    }
  }

  return {
    timeComplexity,
    spaceComplexity,
    explanation: details.join(' ')
  };
}

// ─── API ROUTE ──────────────────────────────────────────────────

app.post('/api/analyze', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
    const analysis = analyzeComplexity(code);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Server error during analysis' });
  }
});

// ─── LOCAL DEV SERVER ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

export default app;
