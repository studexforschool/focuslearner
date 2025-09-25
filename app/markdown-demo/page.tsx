'use client'

import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { DashboardLayout } from '@/components/dashboard-layout'

const sampleMarkdown = `
# 🎯 FocusLearner Markdown Demo

Welcome to the **beautiful markdown renderer** for FocusLearner! This component provides *stunning typography* and perfect dark theme integration.

## ✨ Features

### Typography & Styling
- **Beautiful headings** with proper hierarchy
- *Elegant text formatting* with perfect contrast
- \`Inline code\` with electric blue highlighting
- Links with [hover effects](https://example.com)

### Code Blocks
Here's a JavaScript example:

\`\`\`javascript
// Focus session timer
function startFocusSession(duration = 25) {
  console.log(\`Starting \${duration} minute focus session...\`);
  
  const timer = setInterval(() => {
    console.log('Stay focused! 🎯');
  }, 60000);
  
  setTimeout(() => {
    clearInterval(timer);
    console.log('Focus session complete! 🎉');
  }, duration * 60000);
}

startFocusSession(25);
\`\`\`

### Lists & Organization

**Productivity Tips:**
1. 🍅 Use the Pomodoro Technique
2. 📱 Eliminate distractions
3. 🎯 Set clear goals
4. 📊 Track your progress

**Features in Development:**
- [ ] AI-powered focus recommendations
- [x] Custom markdown rendering
- [x] Dark theme support
- [ ] Real-time collaboration

### Tables

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Focus Timer | ✅ Complete | High | Pomodoro technique |
| Task Management | 🚧 In Progress | High | Drag & drop interface |
| Analytics Dashboard | 📋 Planned | Medium | Charts and insights |
| AI Assistant | 💡 Research | Low | Smart recommendations |

### Blockquotes

> "The key to productivity is not time management, but attention management."
> 
> Focus on what matters most, eliminate distractions, and watch your productivity soar! 🚀

### Advanced Formatting

You can combine **bold** and *italic* text, add \`inline code\`, and create [beautiful links](https://focuslearner.com) that match your theme.

---

## 🎨 Theme Integration

This markdown renderer perfectly integrates with FocusLearner's design system:

- **Dark theme support** with proper contrast ratios
- **Electric blue accents** for links and code
- **Glass morphism effects** for code blocks and tables
- **Responsive typography** that scales beautifully

### Custom Components

The renderer supports all standard markdown features plus:

- Syntax highlighting for code blocks
- Responsive tables with hover effects
- Beautiful blockquotes with left borders
- Proper spacing and typography hierarchy

---

Ready to use this in your app? Simply import the \`MarkdownRenderer\` component and pass your markdown content!

\`\`\`tsx
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

export function MyComponent() {
  const content = "# Hello World\\n\\nThis is **markdown**!"
  
  return (
    <MarkdownRenderer 
      content={content} 
      className="max-w-4xl mx-auto" 
    />
  )
}
\`\`\`

Happy coding! 💻✨
`

export default function MarkdownDemoPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-black mb-2">
            Markdown Renderer Demo
          </h1>
          <p className="text-light-gray dark:text-light-gray light:text-gray-600">
            Beautiful, customized markdown rendering for FocusLearner
          </p>
        </div>
        
        <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-xl p-8">
          <MarkdownRenderer content={sampleMarkdown} />
        </div>
      </div>
    </DashboardLayout>
  )
}
