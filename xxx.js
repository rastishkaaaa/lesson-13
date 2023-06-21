class Book {
   constructor(title, number, isbn) {
      this.title = title;
      this.number = number;
      this.isbn = isbn;
   }
}

class UI {
   static displayBooks() {
      const books = Store.getBook();
      books.forEach((book) => UI.addBookToList(book));
   }

   static addBookToList(book) {
      const list = document.querySelector('#book-list');
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.number}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
      list.appendChild(row)
   }

   static clearFilds() {
      document.querySelector('#title').value = '';
      document.querySelector('#number').value = '';
      document.querySelector('#isbn').value = '';
   }

   static deleteBook(element) {
      if (element.classList.contains('delete')) {
         element.parentElement.parentElement.remove();
         UI.showAlert('Книга видалена.', 'warning')
      }
   }

   static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);

      setTimeout(() => document.querySelector('.alert').remove(), 2000);
   }
}

class Store {
   static getBook() {
      let books;
      if (localStorage.getItem('books') === null) {
         books = [];
      } else {
         books = JSON.parse(localStorage.getItem('books'));
      }
      console.log(books);
      return books
   }

   static addBook(book) {
      const books = Store.getBook();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
   }

   static removeBook(isbn) {
      const books = Store.getBook();
      books.forEach((book, i) => {
         if (book.isbn === isbn) {
            books.splice(i, 1);
         }
      });
      localStorage.setItem('books', JSON.stringify(books));
   }
}

document.querySelector('#book-form').addEventListener('submit', (e) => {
   e.preventDefault();
   const title = document.querySelector('#title').value;
   const number = document.querySelector('#number').value;
   const isbn = document.querySelector('#isbn').value;

   const book = new Book(title, number, isbn);
   if (title === '' || number === '' || isbn === '') {
      UI.showAlert('Заповніть пусті поля для введення данних.', 'danger')
   } else {
      UI.addBookToList(book);

      Store.addBook(book);

      UI.clearFilds();

      UI.showAlert('Книга додана до каталогу бібліотеки.', 'success')
   }

});

document.querySelector('#book-list').addEventListener('click', (e) => {
   console.log(e.target);
   UI.deleteBook(e.target);
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})

document.addEventListener('DOMContentLoaded', UI.displayBooks);