import {Router} from 'express';
const postRouter = Router();

import { createPost, getPosts, getPost, updatePost, deletePost } from '../controllers/post.controller.js';
import { createComment, getComments, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes - accessible without authentication
postRouter.get('/', getPosts);           // Get all posts
postRouter.get('/:id', getPost);         // Get a specific post by ID

// Protected routes - require authentication
postRouter.post('/', protect, createPost);          // Create a new post
postRouter.put('/:id', protect, updatePost);        // Update an existing post
postRouter.delete('/:id', protect, deletePost);     // Delete a post

// Nested comment routes - comments are always associated with a post
postRouter.get('/:postId/comments', getComments);                           // Get all comments for a post
postRouter.post('/:postId/comments', protect, createComment);               // Create a new comment
postRouter.put('/:postId/comments/:commentId', protect, updateComment);     // Update a comment
postRouter.delete('/:postId/comments/:commentId', protect, deleteComment);  // Delete a comment

export default postRouter;