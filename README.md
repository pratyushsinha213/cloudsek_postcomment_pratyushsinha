# Post-Comments Service

A RESTful API service for managing posts and comments with user authentication, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Create, read, update, and delete posts
- Add comments to posts
- Nested comment structure within posts
- Role-based access control
- MongoDB database integration with Mongoose
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/pratyushsinha213/cloudsek_postcomment_pratyushsinha
cd cloudsek_postcomment_pratyushsinha 
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT = 5500 || <your_port>
MONGODB_URI = mongodb://127.0.0.1:27017/<your_collection_name> || <your_mongodb_string>
JWT_SECRET = <your_jwt_secret_key>
```

4. Start the server:
```bash
npm run dev
```

The server will start running on http://localhost:5500

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

- `POST /api/users/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

- `POST /api/users/logout` - Logout user

- `GET /api/users/profile` - Get user profile
  - Headers: `Authorization: Bearer <token>`

### Posts

- `GET /api/posts` - Get all posts (public)
  - Returns posts with populated comments and authors

- `GET /api/posts/:id` - Get a specific post (public)
  - Returns post with populated comments and author

- `POST /api/posts` - Create a new post (authenticated)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "content": "string" }`

- `PUT /api/posts/:id` - Update a post (authenticated, post author only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "content": "string" }`

- `DELETE /api/posts/:id` - Delete a post (authenticated, post author only)
  - Headers: `Authorization: Bearer <token>`

### Comments (Nested under Posts)

- `GET /api/posts/:postId/comments` - Get all comments for a post (public)
  - Returns comments with populated authors

- `POST /api/posts/:postId/comments` - Create a new comment (authenticated)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "content": "string" }`

- `PUT /api/posts/:postId/comments/:commentId` - Update a comment (authenticated, comment author only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "content": "string" }`

- `DELETE /api/posts/:postId/comments/:commentId` - Delete a comment (authenticated, comment author or post author)
  - Headers: `Authorization: Bearer <token>`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Register or login to get a token
2. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Data Models

### User
- username (unique)
- email (unique)
- password (hashed)
- timestamps

### Post
- title
- content
- author (ref: User)
- comments (array of Comment refs)
- timestamps

### Comment
- content
- author (ref: User)
- post (ref: Post)
- timestamps

## Architecture

The service follows a modular architecture:

- `models/` - MongoDB schemas and models
- `controllers/` - Business logic and request handling
- `routes/` - API route definitions
- `config/` - Configuration files
- `middleware/` - Authentication and authorization middleware

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control
- Input validation
- Error handling

## Error Handling

The API includes error handling for:
- Invalid requests
- Authentication failures
- Authorization failures
- Not found resources
- Server errors
- Database connection issues

## Development

To run the server in development mode with auto-reload:
```bash
npm run dev
```

## Production

To run the server in production mode:
```bash
npm start
```