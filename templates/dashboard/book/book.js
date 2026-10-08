//------------------------------


function displayBooks() {
  let books = JSON.parse(localStorage.getItem("books")) || []
  let table = document.querySelector(".book-table table tbody");
  table.innerHTML = "";
  books.forEach((book) => {
    table.innerHTML += `  <tr>
        <td>${book.bookId}</td>
        <td>${book.bookTitle}</td>
        <td>${book.bookAuthor}</td>
        <td>${book.bookCategory}</td>
        <td>${book.bookQuantity}</td>
        <td>
          <button class="editBtn" onClick=editBook('${book.bookId}')><span class=" edit-icon material-symbols-outlined">edit</span>Edit</button>
          <button class="deleteBtn" onClick=deleteBook('${book.bookId}')><span class="delete-icon material-symbols-outlined">delete</span>Delete</button>
        </td>
      </tr>`;
  });
}
displayBooks();

function deleteBook(id) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter((book) => book.bookId !== id);
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}

let popup = document.getElementsByClassName("popup-container")[0];
let openPopup = document
  .getElementsByClassName("addBookBtn")[0]
  .addEventListener("click", function () {
    popup.style.display = "block";
  });
let closePopup = document
  .getElementsByClassName("cancelBtn")[0]
  .addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "none";
  });

let form = document.getElementById("myForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let bookId = document.getElementById("bookId").value;
  let bookTitle = document.getElementById("bookTitle").value;
  let bookAuthor = document.getElementById("bookAuthor").value;
  let bookCategory = document.getElementById("bookCategory").value;
  let bookQuantity = document.getElementById("bookQuantity").value;
  let bookPublisher = document.getElementById("bookPublisher").value;
  let bookYear = document.getElementById("bookYear").value;

  if (
    bookId === "" ||
    bookTitle === "" ||
    bookAuthor === "" ||
    (bookCategory === "") | (bookQuantity === "") ||
    bookPublisher === "" ||
    bookYear === ""
  ) {
    alert("Required all Fields");
    return;
  }

  let books = JSON.parse(localStorage.getItem("books")) || [];
  const newBook = {
    bookId: bookId,
    bookTitle: bookTitle,
    bookAuthor: bookAuthor,
    bookCategory: bookCategory,
    bookQuantity: bookQuantity,
    bookPublisher: bookPublisher,
    bookYear: bookYear,
  };
  books.push(newBook);
  localStorage.setItem("books", JSON.stringify(books));
  alert("book Added Successfully");
  popup.style.display="none"
  displayBooks();
  form.reset();
});

//edit Book;
let editPopup = document.getElementsByClassName("popup-container")[1];
let editCancelBtn = document
  .getElementsByClassName("editCancelBtn")[0]
  .addEventListener("click", function (event) {
    event.preventDefault();
    editPopup.style.display = "none";
  });
function editBook(id) {
  editPopup.style.display = "block";
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let book = books.find((book) => book.bookId === id);
  document.getElementById("editBookId").value = book.bookId;
  document.getElementById("editBookTitle").value = book.bookTitle;
  document.getElementById("editBookAuthor").value = book.bookAuthor;
  document.getElementById("editBookCategory").value = book.bookCategory;
  document.getElementById("editBookQuantity").value = book.bookQuantity;
  document.getElementById("editBookPublisher").value = book.bookPublisher;
  document.getElementById("editBookYear").value = book.bookYear;
}
let editForm = document.getElementById("editForm");
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let id=document.getElementById("editBookId").value

  let book=books.find(book => book.bookId === id);
  book.bookId=document.getElementById("editBookId").value
  book.bookTitle=document.getElementById("editBookTitle").value
  book.bookAuthor=document.getElementById("editBookAuthor").value
  book.bookCategory=document.getElementById("editBookCategory").value
  book.bookQuantity=document.getElementById("editBookQuantity").value
  book.bookPublisher=document.getElementById("editBookPublisher").value
  book.bookYear=document.getElementById("editBookYear").value

  localStorage.setItem("books",JSON.stringify(books));
  alert("Edit Successfully")
  displayBooks();
  editPopup.style.display="none"
  

});
