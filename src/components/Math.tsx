import { useEffect, useRef, type ReactNode } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  expression: string;
  display?: boolean;
  className?: string;
}

export function MathExpr({ expression, display = false, className = '' }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(expression, ref.current, {
          throwOnError: false,
          displayMode: display,
          output: 'html',
          trust: false,
          strict: false,
        });
      } catch {
        if (ref.current) ref.current.textContent = expression;
      }
    }
  }, [expression, display]);

  return (
    <span
      ref={ref}
      className={`${display ? 'math-block' : 'math-inline'} ${className}`}
      aria-label={expression}
    />
  );
}

/**
 * Renders a mixed Persian-text + math string.
 * Math segments are delimited by $...$ (inline) or $$...$$ (display).
 * Everything outside $...$ is plain Persian text rendered RTL.
 * Returns an array of React nodes.
 */
export function RichText({ text, className = '' }: { text: string; className?: string }): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before the math segment
    if (match.index > lastIndex) {
      const textSlice = text.slice(lastIndex, match.index);
      if (textSlice) {
        parts.push(<span key={`t${key++}`} className="rt-text">{textSlice}</span>);
      }
    }
    // Math segment
    if (match[1] !== undefined) {
      // Display math $$...$$
      parts.push(<MathExpr key={`d${key++}`} expression={match[1]} display />);
    } else if (match[2] !== undefined) {
      // Inline math $...$
      parts.push(<MathExpr key={`m${key++}`} expression={match[2]} />);
    }
    lastIndex = regex.lastIndex;
  }

  // Trailing text
  if (lastIndex < text.length) {
    const textSlice = text.slice(lastIndex);
    if (textSlice) {
      parts.push(<span key={`t${key++}`} className="rt-text">{textSlice}</span>);
    }
  }

  // If no math was found, just return the text
  if (parts.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return <span className={`rt-container ${className}`}>{parts}</span>;
}
