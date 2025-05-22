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
- Rich text support in comments using Markdown

## Rich Text Support

Comments support Markdown formatting for rich text. To use rich text in a comment:

1. Set `isMarkdown: true` in the request body when creating or updating a comment
2. Use Markdown syntax in the content:
   - `**bold text**` for bold text
   - `*italic text*` for italic text
   - `[link text](url)` for hyperlinks

Example comment with Markdown:
```json
{
  "content": "This is **bold** and *italic* text with a [link](https://example.com)",
  "isMarkdown": true
}
```

The API will automatically convert Markdown to HTML when returning comments. The `processedContent` field contains the HTML version of the content.

## Database Choice: MongoDB

Several reasons contribute for choosing MongoDB database. These include:

1. **Document-Based Structure**:
   - Posts and comments naturally fit into a document-based model
   - Each post can contain an array of comment references
   - Easy to model hierarchical relationships (posts -> comments)
   - Flexible schema allows for easy modifications and additions

2. **Performance Benefits**:
   - Efficient querying of nested data structures
   - Fast retrieval of posts with their associated comments
   - Good performance for read-heavy operations (viewing posts and comments)

3. **Scalability**:
   - Horizontal scaling capabilities
   - Efficient handling of large numbers of posts and comments
   - Good performance with growing data size

4. **Developer Experience**:
   - Mongoose ODM provides a clean, intuitive API
   - Easy to implement complex queries
   - Rich querying capabilities
   - Good support for data validation and middleware

5. **Real-world Applicability**:
   - Similar to how many social media platforms store their data
   - Well-suited for content-heavy applications
   - Excellent for applications with frequent updates

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

3. Create a `.env` file in the current directory with the following variables:
```
PORT = 5500 || <your_port>
MONGODB_URI = (local) mongodb://127.0.0.1:27017/postcomments || (atlas -> cloud) mongodb+srv://pratyushsinha:cloudsek@cluster0.w5vs8yz.mongodb.net/postcomments?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = <your_jwt_secret_key>
```

4. Start the server:
```bash
npm run dev
```

The server will start running on http://localhost:5500

## Seeding the Database

The project includes a seed script to populate the database with sample data. The seed data includes:

- 4 sample users
- 5 sample posts about different topics
- Multiple comments per post with rich text support

To seed the database:
```bash
npm run seed
```

This will create:
- Users with different usernames and emails
- Posts about various web development topics
- Comments with both Markdown and plain text content
- A realistic distribution of comments across posts

Sample user credentials after seeding:
- User 1: `john@example.com` / `password123`
- User 2: `jane@example.com` / `password123`
- User 3: `alex@example.com` / `password123`
- User 4: `sarah@example.com` / `password123`

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
  - Body: `{ "content": "string", "isMarkdown": boolean }`

- `PUT /api/posts/:postId/comments/:commentId` - Update a comment (authenticated, comment author only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "content": "string", "isMarkdown": boolean }`

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
- isMarkdown (boolean)
- author (ref: User)
- post (ref: Post)
- timestamps
- processedContent (virtual, HTML if markdown)

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
- Markdown sanitization

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