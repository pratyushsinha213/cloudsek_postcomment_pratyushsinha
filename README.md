# Post-Comments Service

A RESTful API service for managing posts and comments, built with Node.js, Express, and MongoDB.

## Features

- Create, read, update, and delete posts
- Add comments to posts
- Retrieve all comments for a specific post
- RESTful API design
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd post-comments-service
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

4. Start the server:
```bash
npm run dev
```

The server will start running on http://localhost:5000

## API Endpoints

### Posts

- `POST /api/posts` - Create a new post
  - Body: `{ "title": "string", "content": "string", "author": "string" }`

- `GET /api/posts` - Get all posts

- `GET /api/posts/:id` - Get a specific post

- `PUT /api/posts/:id` - Update a post
  - Body: `{ "title": "string", "content": "string" }`

- `DELETE /api/posts/:id` - Delete a post

### Comments

- `POST /api/comments` - Create a new comment
  - Body: `{ "content": "string", "author": "string", "postId": "string" }`

- `GET /api/comments/post/:postId` - Get all comments for a post

- `PUT /api/comments/:id` - Update a comment
  - Body: `{ "content": "string" }`

- `DELETE /api/comments/:id` - Delete a comment

## Architecture

The service follows a modular architecture:

- `models/` - MongoDB schemas and models
- `controllers/` - Business logic and request handling
- `routes/` - API route definitions
- `config/` - Configuration files
- `middleware/` - Custom middleware functions

## Error Handling

The API includes error handling for:
- Invalid requests
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