# Pokémon Explorer

A modern web application for exploring and discovering information about Pokémon. This interactive platform allows users to search, browse, and view detailed information about different Pokémon and their evolution triggers.


## Features

- **Pokémon Search**: Quickly find Pokémon by name
- **Paginated Pokémon List**: Browse through the complete Pokémon catalog
- **Detailed Pokémon Information**: View comprehensive details about each Pokémon in a modal
- **Evolution Triggers**: Explore different evolution mechanisms in the Pokémon world
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/) 15.3.3
- **UI Library**: [React](https://reactjs.org/) 18.2.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.3.3
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) 5.2.2
- **UI Components**:
  - [@headlessui/react](https://headlessui.dev/)
  - [@heroicons/react](https://heroicons.com/)
  - [@tanstack/react-table](https://tanstack.com/table/latest)
- **Testing**: [Jest](https://jestjs.io/) with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pokemon-explorer.git
   cd pokemon-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- **Search for Pokémon**: Use the search bar at the top of the page to find specific Pokémon by name
- **Browse Pokémon**: Navigate through pages using the pagination controls
- **View Details**: Click on any Pokémon row to open a detailed view
- **Explore Evolution Triggers**: Scroll down to see information about different evolution mechanisms

## Project Structure

```
pokemon-explorer/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── components/           # Reusable UI components
│   ├── pokemon-table.tsx # Table displaying Pokémon list
│   ├── pokemon-search.tsx# Search component
│   ├── pokemon-modal.tsx # Modal for detailed Pokémon view
│   └── ...
├── hooks/                # Custom React hooks
│   └── use-pokemon-data.ts # Data fetching logic
├── lib/                  # Utility functions and shared code
├── public/               # Static assets
├── .next/                # Next.js build output (generated)
├── node_modules/         # Dependencies (generated)
└── ...                   # Configuration files
```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by the [PokéAPI](https://pokeapi.co/)
- Inspired by the love for Pokémon and the desire to create an accessible way to explore the Pokémon universe