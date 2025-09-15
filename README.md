# Fullstack Rating App

A modern fullstack web application for rating and reviewing stores, built with a Node.js/Express backend and a React + Vite + Tailwind CSS frontend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (register, login, change password)
- Role-based access: Admin, Owner, User
- Store management (CRUD for stores)
- Ratings and reviews for stores
- Admin dashboard for managing users and stores
- Owner dashboard for managing owned stores
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** (Add your DB, e.g., MongoDB, PostgreSQL)
- **Authentication:** JWT
- **API:** RESTful

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- (If using a database: MongoDB/PostgreSQL running locally or in the cloud)

### Backend Setup

1. Navigate to the backend folder:
	```sh
	cd backend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file based on `.env.example` and set your environment variables.
4. Run database seed (optional, if provided):
	```sh
	node src/seed.js
	```
5. Start the backend server:
	```sh
	npm start
	```
	The backend will run on `http://localhost:5000` (default).

### Frontend Setup

1. Navigate to the frontend folder:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file based on `.env.example` and set your environment variables (e.g., API base URL).
4. Start the frontend development server:
	```sh
	npm run dev
	```
	The frontend will run on `http://localhost:5173` (default).

## Project Structure

```
fullstack-rating-app/
  backend/
	 src/
		controllers/
		middlewares/
		models/
		routes/
		config/
		seed.js
		server.js
	 package.json
	 .env
  frontend/
	 src/
		api/
		assets/
		components/
		pages/
		App.jsx
		main.jsx
	 public/
	 package.json
	 .env
  README.md
```

## API Endpoints

> See `backend/src/routes/` for detailed route definitions.

- `/api/auth` - Authentication (register, login, change password)
- `/api/users` - User management
- `/api/stores` - Store CRUD
- `/api/ratings` - Ratings and reviews
- `/api/admin` - Admin operations
- `/api/owner` - Owner operations

## Contributing

Contributions are welcome! Please open issues and submit pull requests for new features, bug fixes, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize the README further with screenshots, demo links, or additional documentation as your project evolves.