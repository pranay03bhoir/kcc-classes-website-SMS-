# Tutoring Academy Website Frontend
```markdown

This is the frontend of the **Tutoring Academy Website** built using **Next.js**. The frontend provides a user-friendly interface for students, tutors, and administrators to interact with the system. It includes features such as student registration, course management, attendance tracking, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Setup Environment Variables](#setup-environment-variables)
  - [Run the Development Server](#run-the-development-server)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)
- [Contributing](#contributing)
- [License](#license)
- [Need Help?](#need-help)

## Features

- **Student Registration and Login**
- **Course Management**
- **Attendance Tracking**
- **Profile Management**
- **Responsive Design**
- **Role-Based Access Control**

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **React.js**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Redux Toolkit**: State management library.
- **Axios**: Promise-based HTTP client for making API requests.

## Installation Guide

### Prerequisites

Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** or **yarn**

### Clone the Repository

```sh
git clone https://github.com/pranay03bhoir/kcc-classes-website-SMS-.git
cd kcc-classes-website-sms-/frontend
```

### Setup Environment Variables

Create a `.env.local` file in the `frontend` directory and add the following environment variables:

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run the Development Server

```sh
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
# or
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```plaintext
frontend/
├── public/                 # Public assets
├── src/
│   ├── components/         # Reusable components
│   ├── pages/              # Next.js pages
│   ├── redux/              # Redux store and slices
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── app/                # App configuration and layout
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - Your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

## Need Help?

For any queries, contact us at **kccclasses.KCC@gmail.com**.
```