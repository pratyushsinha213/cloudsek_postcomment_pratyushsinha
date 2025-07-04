import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';

// Create a new comment
export const createComment = async (req, res) => {
    try {
        // Extract content and isMarkdown flag from request body
        // isMarkdown is optional and defaults to false if not provided
        const { content, isMarkdown } = req.body;
        const postId = req.params.postId;
        
        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create new comment with content and markdown flag
        const comment = new Comment({
            content,
            isMarkdown: isMarkdown || false, // Default to false if not specified
            author: req.user._id,
            post: postId
        });
        
        await comment.save();

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        // Populate author details before sending response
        // The response will include both raw content and processedContent (HTML if markdown)
        await comment.populate('author', 'username');
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for a post
export const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        
        // Check if post exists and populate comments
        const post = await Post.findById(postId)
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

        // Sort comments by creation date
        const sortedComments = post.comments.sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json(sortedComments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        // Extract content and isMarkdown flag from request body
        const { content, isMarkdown } = req.body;
        
        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if comment exists and belongs to the post
        if (!post.comments.includes(commentId)) {
            return res.status(404).json({ message: 'Comment not found on this post' });
        }

        const comment = await Comment.findById(commentId);
        
        // Check if user is the author of the comment
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        // Update comment content
        comment.content = content;
        // Only update isMarkdown if it's provided in the request
        if (isMarkdown !== undefined) {
            comment.isMarkdown = isMarkdown;
        }
        comment.updatedAt = Date.now();

        await comment.save();
        // Response will include both raw content and processedContent
        await comment.populate('author', 'username');
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        
        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if comment exists and belongs to the post
        if (!post.comments.includes(commentId)) {
            return res.status(404).json({ message: 'Comment not found on this post' });
        }

        const comment = await Comment.findById(commentId);

        // Allow deletion if user is either the comment author or the post author
        if (comment.author.toString() !== req.user._id.toString() && 
            post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove comment from post's comments array
        post.comments = post.comments.filter(id => id.toString() !== commentId);
        await post.save();

        // Delete the comment
        await comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 