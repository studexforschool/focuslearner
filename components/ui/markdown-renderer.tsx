'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white dark:text-white light:text-black mb-6 mt-8 first:mt-0 border-b border-white/20 dark:border-white/20 light:border-black/20 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-white dark:text-white light:text-black mb-4 mt-6 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium text-white dark:text-white light:text-black mb-3 mt-5 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium text-white dark:text-white light:text-black mb-2 mt-4 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-medium text-white dark:text-white light:text-black mb-2 mt-3 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-white dark:text-white light:text-black mb-2 mt-3 first:mt-0">
              {children}
            </h6>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="text-light-gray dark:text-light-gray light:text-gray-700 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-light-gray dark:text-light-gray light:text-gray-700 mb-4 space-y-1 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-light-gray dark:text-light-gray light:text-gray-700 mb-4 space-y-1 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-light-gray dark:text-light-gray light:text-gray-700">
              {children}
            </li>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-electric-blue hover:text-electric-blue/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Code
          code: ({ children, className, ...props }: any) => {
            const isInline = !className?.includes('language-')
            if (isInline) {
              return (
                <code className="bg-white/10 dark:bg-white/10 light:bg-black/10 text-electric-blue px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              )
            }
            return (
              <code className={cn('font-mono text-sm text-white', className)}>
                {children}
              </code>
            )
          },
          
          // Code blocks
          pre: ({ children }) => (
            <pre className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg p-4 mb-4 overflow-x-auto">
              {children}
            </pre>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-electric-blue bg-white/5 dark:bg-white/5 light:bg-black/5 pl-4 py-2 mb-4 italic">
              {children}
            </blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-white/20 dark:border-white/20 light:border-black/20 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/10 dark:bg-white/10 light:bg-black/10">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/10 dark:divide-white/10 light:divide-black/10">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-white dark:text-white light:text-black font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-light-gray dark:text-light-gray light:text-gray-700">
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="border-white/20 dark:border-white/20 light:border-black/20 my-6" />
          ),
          
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-white dark:text-white light:text-black">
              {children}
            </strong>
          ),
          
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-light-gray dark:text-light-gray light:text-gray-600">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Example usage component
export function MarkdownExample() {
  const sampleMarkdown = `
# Welcome to FocusLearner

This is a **sample markdown** document to showcase the *beautiful styling*.

## Features

- ✅ Custom dark theme styling
- ✅ Syntax highlighting for code
- ✅ Beautiful typography
- ✅ Responsive design

### Code Example

\`\`\`javascript
function focusSession() {
  console.log("Starting focus session...");
  return "Productivity mode activated!";
}
\`\`\`

> This is a blockquote with important information about your productivity journey.

| Feature | Status | Priority |
|---------|--------|----------|
| Focus Timer | ✅ Done | High |
| AI Assistant | 🚧 In Progress | Medium |
| Analytics | 📋 Planned | Low |

---

Ready to transform your productivity? Let's [get started](https://focuslearner.com)!
  `

  return (
    <div className="max-w-4xl mx-auto p-6">
      <MarkdownRenderer content={sampleMarkdown} />
    </div>
  )
}
