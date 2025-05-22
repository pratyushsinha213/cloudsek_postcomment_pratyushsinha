import mongoose from 'mongoose';
import { marked } from 'marked';

// Define the Comment schema with required fields and relationships
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    // Flag to indicate if the content contains Markdown formatting
    // When true, the content will be processed as Markdown
    // When false, the content will be treated as plain text
    isMarkdown: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to Post model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
    // Enable virtuals in JSON and Object output
    // This ensures processedContent is included in API responses
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field that automatically processes the content based on isMarkdown flag
// If isMarkdown is true, converts Markdown to HTML using marked library
// If isMarkdown is false, returns the original content as is
// This allows clients to receive both raw and processed content
commentSchema.virtual('processedContent').get(function() {
    return this.isMarkdown ? marked(this.content) : this.content;
});

// Create and export the Comment model
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;