const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');  // Import ObjectId

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://aishusri182:sri93@cluster0.mzine.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Book model
const Book = mongoose.model('Book', new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true }
}));

// CRUD Routes

// GET all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// GET single book by ID
app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// POST create a new book
app.post('/books', async (req, res) => {
  const { title, author, isbn } = req.body;
  const newBook = new Book({ title, author, isbn });
  await newBook.save();
  res.json(newBook);
});

// PUT update a book by ID
app.put('/books/:id', async (req, res) => {
  const { title, author, isbn } = req.body;
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, isbn }, { new: true });
  res.json(updatedBook);
});

// DELETE remove a book by ID
app.delete('/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
