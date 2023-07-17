const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/book-shop-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define User model
const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
});

// Define Book model
const Book = mongoose.model('Book', {
    title: String,
    author: String,
    isbn: String,
    review: String,
});

// Task 1: Get the book list available in the shop
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const books = await Book.find({ isbn });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 3: Get all books by Author
app.get('/books/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        const books = await Book.find({ author });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const books = await Book.find({ title });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 5: Get book Review
app.get('/books/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json(book.review);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 6: Register New user
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'Registration successful' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 7: Login as a Registered user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.status(401).json({ error: 'Invalid email or password' });
            } else {
                res.json({ message: 'Login successful' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 8: Add/Modify a book review
app.put('/books/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const { review } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(id, { review }, { new: true });
        if (!updatedBook) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json({ message: 'Book review updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 9: Delete book review added by that particular user
app.delete('/books/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndUpdate(id, { review: '' }, { new: true });
        if (!deletedBook) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json({ message: 'Book review deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 10: Get all books - Using async callback function
app.get('/books/all', async (req, res) => {
    try {
        Book.find({}, (err, books) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(books);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 11: Search by ISBN - Using Promises
app.get('/books/search/isbn/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        Book.find({ isbn }).exec()
            .then(books => {
                res.json(books);
            })
            .catch(error => {
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 12: Search by Author
app.get('/books/search/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        const books = await Book.find({ author });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 13: Search by Title
app.get('/books/search/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const books = await Book.find({ title });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
