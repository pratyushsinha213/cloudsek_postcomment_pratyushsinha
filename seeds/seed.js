import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import { MONGODB_URI } from '../config/env.js';

// Sample data for seeding
const sampleUsers = [
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123'
    },
    {
        username: 'alex_tech',
        email: 'alex@example.com',
        password: 'password123'
    },
    {
        username: 'sarah_dev',
        email: 'sarah@example.com',
        password: 'password123'
    }
];

const samplePosts = [
    {
        title: 'Getting Started with Node.js',
        content: 'Node.js is a powerful JavaScript runtime that allows you to build scalable network applications.'
    },
    {
        title: 'Understanding MongoDB',
        content: 'MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents.'
    },
    {
        title: 'RESTful API Design Best Practices',
        content: 'Learn about the best practices for designing RESTful APIs, including proper HTTP methods, status codes, and resource naming conventions.'
    },
    {
        title: 'Authentication with JWT',
        content: 'Implement secure authentication in your applications using JSON Web Tokens (JWT).'
    },
    {
        title: 'Error Handling in Express.js',
        content: 'Master the art of error handling in Express.js applications with proper middleware and error responses.'
    }
];

const sampleComments = [
    {
        content: 'Great article! I especially liked the part about **async/await** and *promises*.',
        isMarkdown: true
    },
    {
        content: 'Check out this [MongoDB documentation](https://docs.mongodb.com) for more details.',
        isMarkdown: true
    },
    {
        content: 'This is a regular comment without any formatting.',
        isMarkdown: false
    },
    {
        content: 'I have a question about **JWT security**. How do you handle token refresh?',
        isMarkdown: true
    },
    {
        content: 'The error handling section was really helpful! *Thanks for sharing*.',
        isMarkdown: true
    },
    {
        content: 'I disagree with some points in the REST API design. Here\'s why...',
        isMarkdown: false
    },
    {
        content: 'Can you explain more about [MongoDB indexing](https://docs.mongodb.com/manual/indexes/)?',
        isMarkdown: true
    },
    {
        content: 'This tutorial helped me understand **authentication** better!',
        isMarkdown: true
    }
];

// Function to get random items from an array
const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const users = [];
        for (const userData of sampleUsers) {
            // Hashing of the password is already handled in the User model
            const user = await User.create({
                ...userData,
            });
            users.push(user);
        }
        console.log('Created users');

        // Create posts
        const posts = [];
        for (const postData of samplePosts) {
            // Randomly assign posts to different users
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const post = await Post.create({
                ...postData,
                author: randomUser._id
            });
            posts.push(post);
        }
        console.log('Created posts');

        // Create comments with random distribution
        for (const post of posts) {
            // Randomly select 2-4 comments for each post
            const commentCount = Math.floor(Math.random() * 3) + 2;
            const selectedComments = getRandomItems(sampleComments, commentCount);
            
            for (const commentData of selectedComments) {
                // Randomly assign comments to different users
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const comment = await Comment.create({
                    ...commentData,
                    author: randomUser._id,
                    post: post._id
                });
                
                // Add comment to post's comments array
                post.comments.push(comment._id);
                await post.save();
            }
        }
        console.log('Created comments');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase(); 