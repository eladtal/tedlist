# Tedlist

A modern, minimalist, and collaborative trade-list web application that combines the concept of item trading with swipe-based interactions.

## Features

- 🔐 User authentication and authorization
- 📋 Create and manage lists (tasks or trades)
- 🔁 Tinder-style swipe system for browsing items
- 🏆 Achievements system with "Teddies" points
- 👤 Admin panel for moderation
- 🌍 Responsive design for all devices

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, Vite
- State Management: Zustand
- Routing: React Router
- API Client: Axios
- UI Components: Headless UI, Heroicons
- Notifications: React Hot Toast

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tedlist.git
   cd tedlist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tedlist/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── stores/        # Zustand stores
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── index.html         # HTML template
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 