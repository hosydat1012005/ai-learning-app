"use client";

import ReactMarkdown from "react-markdown";

type ExplainerRendererProps = {
  content: string;
};

export default function ExplainerRenderer({ content }: ExplainerRendererProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 my-2">
      <p className="text-sm text-blue-400 font-medium mb-4">🎓 Explanation</p>
      
      <div className="prose prose-invert max-w-none space-y-3">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-white mt-6 mb-3 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-white mt-5 mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-blue-300 mt-4 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-semibold text-blue-200 mt-3 mb-2">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-gray-200 leading-relaxed my-2">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="text-white font-bold">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-gray-300 italic">{children}</em>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 my-3 text-gray-200">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 my-3 text-gray-200">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-200">{children}</li>
            ),
            code: ({ children }) => (
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-100 font-mono text-sm">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-950 border border-gray-700 rounded-lg p-4 overflow-x-auto my-3">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic text-gray-300 my-3 bg-gray-800/30 rounded">
                {children}
              </blockquote>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <table className="w-full border-collapse border border-gray-700 my-3">
                {children}
              </table>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-800">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody>{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="border border-gray-700">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="border border-gray-700 px-4 py-2 text-left text-white font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-700 px-4 py-2 text-gray-200">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
