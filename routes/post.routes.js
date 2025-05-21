import {Router} from 'express';
const postRouter = Router();

import { createPost, getPosts, getPost, updatePost, deletePost } from '../controllers/post.controller.js';
import { createComment, getComments, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);

// Protected routes
postRouter.post('/', protect, createPost);
postRouter.put('/:id', protect, updatePost);
postRouter.delete('/:id', protect, deletePost);

// Nested comment routes inside post routes since comments are related to posts
postRouter.get('/:postId/comments', getComments);
postRouter.post('/:postId/comments', protect, createComment);
postRouter.put('/:postId/comments/:commentId', protect, updateComment);
postRouter.delete('/:postId/comments/:commentId', protect, deleteComment);

export default postRouter;