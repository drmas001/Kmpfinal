# Kidney Match Pro

A comprehensive kidney transplant matching system for healthcare professionals. This application streamlines the process of matching kidney donors with recipients using advanced algorithms and real-time analytics.

## Features

- Real-time donor-recipient matching
- Advanced HLA and PRA analysis
- Secure data management (HIPAA-compliant)
- Comprehensive patient management
- Analytics dashboard
- Role-based access control

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase
- TailwindCSS
- React Router
- React Hook Form
- Zod
- Radix UI

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account and project

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kidney-match-pro.git
cd kidney-match-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── lib/           # Core functionality and utilities
├── pages/         # Application pages/routes
├── types/         # TypeScript type definitions
└── styles/        # Global styles and themes
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact your administrator. 