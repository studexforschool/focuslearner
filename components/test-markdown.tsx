'use client'

import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

const testMarkdown = `
# Test Markdown Rendering 🎯

This is a **bold test** with *italic text*.

## Code Example

Here's some \`inline code\` and a code block:

\`\`\`javascript
function test() {
  console.log("Hello World!");
  return "Markdown is working!";
}
\`\`\`

## List Test

- ✅ **Bold items** work
- *Italic emphasis* works  
- \`Code highlighting\` works

> This is a blockquote test!

| Feature | Status |
|---------|--------|
| Headers | ✅ Working |
| Code | ✅ Working |
| Tables | ✅ Working |
`

export function TestMarkdown() {
  return (
    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Markdown Test</h2>
      <MarkdownRenderer content={testMarkdown} />
    </div>
  )
}
