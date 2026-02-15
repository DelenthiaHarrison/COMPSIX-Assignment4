const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Fiction"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genre: "Fiction"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian Fiction"
    }

    // Add more books if you'd like!
];

/* Create your REST API here with the following endpoints:
    'GET /api/books': 'Get all books',
    'GET /api/books/:id': 'Get a specific book',
    'POST /api/books': 'Add a new book',
    'PUT /api/books/:id': 'Update a book',
    'DELETE /api/books/:id': 'Delete a book'
*/
// Helper function to generate next ID
const getNextId = () => {
  return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
};

// GET /api/books - Get all books
app.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// GET /api/books/:id - Get a specific book
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  res.status(200).json(book);
});

// POST /api/books - Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, year, genre } = req.body;
  
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ error: 'All fields (title, author, year, genre) are required' });
  }
  
  const newBook = {
    id: getNextId(),
    title,
    author,
    year,
    genre
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year, genre } = req.body;
  
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ error: 'All fields (title, author, year, genre) are required' });
  }
  
  books[bookIndex] = {
    id,
    title,
    author,
    year,
    genre
  };
  
  res.status(200).json(books[bookIndex]);
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  books.splice(bookIndex, 1);
  res.status(204).send();
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Books API server is running on http://localhost:${PORT}`);
});
}

// Export for testing
module.exports = app;










