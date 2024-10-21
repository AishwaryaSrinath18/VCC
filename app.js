// Backend API URL
const apiUrl = 'http://localhost:3000/books';  // Adjust the URL to your backend API endpoint

document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
});

// Fetch all books and display them in the table
function fetchBooks() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(books => {
      const bookList = document.querySelector('#book-list tbody');
      bookList.innerHTML = '';  // Clear current list

      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td>
            <button class="edit" onclick="editBook('${book._id}')">Edit</button>
            <button class="delete" onclick="deleteBook('${book._id}')">Delete</button>
          </td>
        `;
        bookList.appendChild(row);
      });
    });
}

// Handle form submission (Add or Update)
document.querySelector('#book-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.querySelector('#book-id').value;
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if (id) {
    // Update the book if an ID is present
    updateBook(id, { title, author, isbn });
  } else {
    // Otherwise add a new book
    addBook({ title, author, isbn });
  }
});

// Add a new book
function addBook(book) {
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  })
  .then(() => {
    fetchBooks();  // Refresh book list
    resetForm();   // Clear the form after submission
  });
}

// Edit book (prefill the form for editing)
function editBook(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(book => {
      document.querySelector('#book-id').value = book._id; // Use '_id' for MongoDB IDs
      document.querySelector('#title').value = book.title;
      document.querySelector('#author').value = book.author;
      document.querySelector('#isbn').value = book.isbn;
      document.querySelector('#submit-btn').innerText = 'Update Book';
    });
}

// Update book
function updateBook(id, book) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  })
  .then(() => {
    fetchBooks();  // Refresh the book list
    resetForm();   // Clear the form after updating
  });
}

// Delete a book
function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })
    .then(() => fetchBooks());  // Refresh the book list after deletion
  }
}

// Reset the form after adding or updating a book
function resetForm() {
  document.querySelector('#book-id').value = '';
  document.querySelector('#title').value = '';
  document.querySelector('#author').value = '';
  document.querySelector('#isbn').value = '';
  document.querySelector('#submit-btn').innerText = 'Add Book';
}
