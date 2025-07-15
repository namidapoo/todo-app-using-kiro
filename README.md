# Todo App

[日本語版 README](./README.ja.md) | English

> **Built with Kiro IDE Spec Mode** 🚀  
> This project was developed using [Kiro IDE](https://kiro.ai/)'s specification-driven development workflow. The entire application was built from requirements gathering through design documentation to implementation planning and execution, following a structured spec-based approach for systematic feature development.

A simple and intuitive todo application built with Next.js 15, React 19, and TypeScript. Stay organized and get things done with a clean, responsive interface.

![Todo App Screenshot](https://via.placeholder.com/800x400/f3f4f6/374151?text=Todo+App+Screenshot)

## ✨ Features

- ✅ **Create, Edit, Delete Todos** - Full CRUD operations for managing your tasks
- ✅ **Mark as Complete** - Toggle completion status with visual feedback
- ✅ **Persistent Storage** - Your todos are saved in localStorage and persist across sessions
- ✅ **Responsive Design** - Optimized for both desktop and mobile devices
- ✅ **Real-time Validation** - Input validation with helpful error messages
- ✅ **Empty State** - Friendly message when you have no todos
- ✅ **Error Handling** - Graceful error handling with recovery options
- ✅ **Accessibility** - Built with semantic HTML and ARIA labels
- ✅ **TypeScript** - Full type safety throughout the application

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: [React 19](https://react.dev/) with hooks
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Fonts**: [Geist](https://vercel.com/font) (Sans & Mono)
- **Storage**: Browser localStorage
- **Development**: Turbopack for fast development builds

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and error boundary
│   ├── page.tsx           # Home page with TodoApp component
│   └── globals.css        # Global styles and Tailwind directives
├── components/            # React components
│   ├── TodoApp.tsx        # Main application component
│   ├── ErrorBoundary.tsx  # Error boundary for error handling
│   └── ui/                # UI components
│       ├── AddTodoForm.tsx    # Form for adding new todos
│       ├── TodoList.tsx       # List container for todos
│       ├── TodoItem.tsx       # Individual todo item
│       └── EmptyState.tsx     # Empty state display
├── lib/                   # Utilities and hooks
│   ├── hooks/             # Custom React hooks
│   │   ├── useTodos.ts        # Todo management hook
│   │   └── useLocalStorage.ts # localStorage hook
│   ├── types/             # TypeScript type definitions
│   │   └── todo.ts            # Todo-related interfaces
│   └── utils/             # Utility functions
│       └── validation.ts      # Input validation functions
└── .kiro/                 # Kiro IDE specifications
    ├── specs/todo-app/    # Feature specifications
    └── steering/          # Project guidelines
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo-app-using-kiro
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

### Adding Todos

- Type your task in the input field
- Click "Add Todo" or press Enter to create
- Empty todos are not allowed and will show an error

### Managing Todos

- **Complete**: Click the checkbox to mark as done
- **Edit**: Double-click on the todo text to edit inline
- **Delete**: Click the × button to remove a todo
- **View**: Todos are sorted with incomplete items first

### Data Persistence

- All todos are automatically saved to your browser's localStorage
- Your todos will persist when you refresh the page or close/reopen the browser
- If localStorage is unavailable, you'll see a warning but the app will still work

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint checks
npx tsc --noEmit     # Run TypeScript type checking
```

### Development Features

- **Hot Reload**: Changes are reflected instantly during development
- **TypeScript**: Full type checking and IntelliSense support
- **ESLint**: Code linting with Next.js recommended rules
- **Tailwind CSS**: Utility-first styling with responsive design
- **Error Boundary**: Graceful error handling in development and production

## 🎨 Customization

### Styling

The app uses Tailwind CSS for styling. You can customize:

- Colors in `tailwind.config.js`
- Global styles in `app/globals.css`
- Component-specific styles in individual component files

### Storage

Currently uses localStorage. You can extend to use:

- IndexedDB for larger datasets
- External APIs for cloud sync
- Database integration for multi-user support

## 📋 Requirements Fulfilled

This application fulfills all the specified requirements:

1. ✅ **Create new todo items** with validation
2. ✅ **View all todos** in a sorted list
3. ✅ **Mark todos as complete/incomplete** with visual feedback
4. ✅ **Edit existing todos** with inline editing
5. ✅ **Delete todos** with immediate removal
6. ✅ **Responsive design** for mobile and desktop
7. ✅ **Data persistence** using localStorage

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy with zero configuration

### Other Platforms

This Next.js app can be deployed on:

- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)
- Any platform supporting Node.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Developed using [Kiro IDE](https://kiro.ai/) specifications
- Icons from [Heroicons](https://heroicons.com/)

---

**Happy organizing! 📝✨**
