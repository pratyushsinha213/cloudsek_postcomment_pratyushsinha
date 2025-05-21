import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Post({
            title,
            content,
            author: req.user._id,
            comments: []
        });
        await post.save();
        await post.populate('author', 'username');
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single post by ID
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, content } = req.body;
        post.title = title || post.title;
        post.content = content || post.content;
        post.updatedAt = Date.now();

        await post.save();
        await post.populate('author', 'username');
        await post.populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username'
            }
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Delete all comments associated with the post
        await Comment.deleteMany({ post: post._id });
        
        await post.deleteOne();
        res.status(200).json({ message: 'Post and its comments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 