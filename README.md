# Fivhter

Fivhter is a modern web application that allows users to create, share, and discover top 5 lists on any topic. Users can vote on their favorite lists and join the conversation by adding comments.

![Fivhter Logo](./public/icons/fivhter-logo.png)

## Features

- **Create Top 5 Lists**: Share your opinions on any topic by creating ranked lists of your top 5 favorites
- **Discover Content**: Browse through lists created by other users
- **Voting System**: Vote for lists you enjoy to help them gain visibility
- **Comments**: Engage in discussions about various lists
- **User Profiles**: Manage your lists and track your activity
- **Responsive Design**: Enjoy a seamless experience on any device

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fivhter.git
   cd fivhter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Database Setup

The database schema is defined in the `scripts/supabase-setup.sql` file. You can run this script in your Supabase SQL editor to set up the required tables and relationships.

## Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## Deployment

The project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Add environment variables for Supabase
5. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
