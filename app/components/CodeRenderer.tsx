"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

type CodeRendererProps = {
  content: string;
};

export default function CodeRenderer({ content }: CodeRendererProps) {
  const [copied, setCopied] = useState(false);

  // Extract code blocks and text
  const parts: Array<{ type: "code" | "text"; value: string; language?: string }> = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: content.substring(lastIndex, match.index),
      });
    }

    // Add code block
    parts.push({
      type: "code",
      value: match[2],
      language: match[1] || "python",
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      value: content.substring(lastIndex),
    });
  }

  // If no code blocks found, treat entire content as code
  if (parts.length === 0) {
    parts.push({
      type: "code",
      value: content,
      language: "python",
    });
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 my-2 space-y-4">
      <p className="text-sm text-purple-400 font-medium">💻 Code Example</p>

      {parts.map((part, idx) =>
        part.type === "code" ? (
          <div key={idx} className="relative">
            <div className="flex items-center justify-between bg-gray-950 border border-gray-700 rounded-t-lg px-4 py-2">
              <span className="text-xs text-gray-500 font-mono">
                {part.language?.toUpperCase()}
              </span>
              <button
                onClick={() => handleCopy(part.value)}
                className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors text-gray-300"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-950 border border-t-0 border-gray-700 rounded-b-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-200 font-mono leading-relaxed">
                {part.value}
              </code>
            </pre>
          </div>
        ) : (
          <div key={idx} className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="text-gray-200">{children}</p>,
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-gray-300 italic">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {children}
                  </ul>
                ),
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold text-white mt-2 mb-1">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold text-white mt-2 mb-1">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold text-white mt-2 mb-1">
                    {children}
                  </h3>
                ),
              }}
            >
              {part.value}
            </ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}
