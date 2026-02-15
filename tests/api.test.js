const request = require('supertest');
const app = require('../server');

describe('Books API Tests', () => {
  
  describe('GET /api/books', () => {
    it('should return all books', async () => {
      const response = await request(app).get('/api/books');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
    
    it('should return books with correct properties', async () => {
      const response = await request(app).get('/api/books');
      
      response.body.forEach(book => {
        expect(book).toHaveProperty('id');
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('author');
      });
    });
  });
  
  describe('GET /api/books/:id', () => {
    it('should return a specific book by ID', async () => {
      const response = await request(app).get('/api/books/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'The Great Gatsby');
    });
    
    it('should return 404 for non-existent book', async () => {
      const response = await request(app).get('/api/books/9999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Book not found');
    });
  });
  
  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        year: 1951,
        genre: 'Fiction'
      };
      
      const response = await request(app)
        .post('/api/books')
        .send(newBook);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newBook.title);
    });
    
    it('should return 400 when required fields are missing', async () => {
      const incompleteBook = {
        title: 'Incomplete Book'
      };
      
      const response = await request(app)
        .post('/api/books')
        .send(incompleteBook);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('PUT /api/books/:id', () => {
    it('should update an existing book', async () => {
      const updatedBook = {
        title: 'The Great Gatsby - Updated',
        author: 'F. Scott Fitzgerald',
        year: 1925,
        genre: 'Classic Fiction'
      };
      
      const response = await request(app)
        .put('/api/books/1')
        .send(updatedBook);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedBook.title);
    });
    
    it('should return 404 when updating non-existent book', async () => {
      const updatedBook = {
        title: 'Non-existent',
        author: 'Unknown',
        year: 2000,
        genre: 'Fiction'
      };
      
      const response = await request(app)
        .put('/api/books/9999')
        .send(updatedBook);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /api/books/:id', () => {
    it('should delete an existing book', async () => {
      const newBook = {
        title: 'Book to Delete',
        author: 'Delete Author',
        year: 2022,
        genre: 'Test'
      };
      
      const createResponse = await request(app)
        .post('/api/books')
        .send(newBook);
      
      const bookId = createResponse.body.id;
      
      const deleteResponse = await request(app).delete(`/api/books/${bookId}`);
      expect(deleteResponse.status).toBe(204);
      
      const getResponse = await request(app).get(`/api/books/${bookId}`);
      expect(getResponse.status).toBe(404);
    });
    
    it('should return 404 when deleting non-existent book', async () => {
      const response = await request(app).delete('/api/books/9999');
      
      expect(response.status).toBe(404);
    });
  });
});