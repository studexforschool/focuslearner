# FocusLearner - Next.js

A modern, AI-powered productivity application built with Next.js 14, featuring a customizable widget dashboard, focus sessions, and analytics.

## Features

- 🎯 **Focus Sessions** - Pomodoro timer with customizable durations
- 📊 **Widget Dashboard** - Drag-and-drop customizable widgets
- 📈 **Analytics** - AI-powered productivity insights
- ✅ **Task Management** - Simple and effective task tracking
- 🔐 **Authentication** - Secure login with beautiful MagicCard UI
- 🌙 **Dark Mode** - Full dark theme with electric blue accents
- 📱 **Responsive** - Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand with persistence
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-focuslearner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Account

- **Email**: demo@focuslearner.com
- **Password**: demo123

## Project Structure

```
nextjs-focuslearner/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── focus/            # Focus session page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── auth-form.tsx     # Authentication form
│   ├── dashboard-layout.tsx # Dashboard layout
│   ├── focus-session.tsx # Focus session component
│   ├── magic-card.tsx    # MagicCard component
│   ├── theme-provider.tsx # Theme provider
│   └── widget-dashboard.tsx # Widget dashboard
├── store/                # Zustand stores
│   ├── auth-store.ts     # Authentication state
│   └── productivity-store.ts # Productivity data
└── package.json          # Dependencies
```

## Key Features

### Widget Dashboard
- **6 Widget Types**: Stats, Current Session, Quick Actions, Pending Tasks, Productivity Chart, Focus Insights
- **Customizable**: Toggle widgets on/off
- **Responsive Grid**: Adapts to screen size
- **Performance Optimized**: Memoized calculations

### Focus Sessions
- **Multiple Types**: Pomodoro, Short Break, Long Break, Custom
- **Visual Timer**: Circular progress indicator
- **Distraction Tracking**: Log interruptions
- **Notifications**: Browser notifications when sessions complete

### Authentication
- **MagicCard UI**: Beautiful hover effects
- **Demo Account**: Easy testing
- **Persistent Sessions**: Stay logged in
- **Responsive Design**: Works on all devices

## Customization

### Colors
The app uses a consistent color scheme defined in `tailwind.config.js`:
- **Electric Blue**: #00D4FF (primary accent)
- **Pure Black**: #000000 (background)
- **Light Gray**: #a0a0a0 (secondary text)

### Widgets
Add new widgets by:
1. Creating the widget component
2. Adding it to the `widgetComponents` object
3. Adding configuration to the `widgets` array

## Performance

- **Optimized Rendering**: Uses React.memo and useMemo
- **Efficient State**: Zustand with selective subscriptions
- **Lazy Loading**: Components loaded on demand
- **Minimal Bundle**: Only necessary dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
