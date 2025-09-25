'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

const storyContent = `
## The Quest for the Lost City

In the land of **Elysium**, a young adventurer named **Aria** sets out on a quest to find the long-lost city of *Atlantis*.

### The Legend

Legends say that the city holds:
- **Ancient knowledge** beyond comprehension
- *Treasures* beyond imagination
- Mystical artifacts of power

### Aria's Preparation

Aria gathers her courage and equips herself with essential items:

| Item | Purpose | Condition |
|------|---------|-----------|
| 🗺️ **Map** | Navigation | Ancient but readable |
| 🧭 **Compass** | Direction finding | Enchanted |
| ⚔️ **Trusty Sword** | Protection | Well-maintained |

### The Journey Begins

> "Every great adventure begins with a single step into the unknown." - *Ancient Elysium Proverb*

Aria begins her journey through:

1. **Dense jungles** filled with exotic flora
2. *Treacherous mountains* with hidden paths  
3. **Mystical valleys** where magic flows freely

### Challenges Ahead

Along the way, she encounters:

#### Mystical Creatures
\`\`\`javascript
const creatures = [
  { name: "Forest Sprites", danger: "low", magic: "high" },
  { name: "Mountain Trolls", danger: "high", magic: "medium" },
  { name: "Ancient Dragons", danger: "extreme", magic: "legendary" }
];
\`\`\`

#### Daunting Challenges
- **Riddles of the Sphinx** - Test of wisdom
- *Labyrinth of Mirrors* - Test of courage  
- **Trial of Elements** - Test of strength

### The Adventure Continues...

Will Aria overcome these challenges and find the lost city of Atlantis? 

> The journey of a thousand miles begins with a single step, but the journey to legend begins with unwavering determination.

**Stay tuned for the next chapter of this epic adventure!** ⚔️✨
`

export default function TestStoryPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-black mb-2">
            Story Markdown Test
          </h1>
          <p className="text-light-gray dark:text-light-gray light:text-gray-600">
            Testing beautiful markdown rendering with story content
          </p>
        </div>
        
        <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-xl p-8">
          <MarkdownRenderer content={storyContent} />
        </div>
      </div>
    </DashboardLayout>
  )
}
