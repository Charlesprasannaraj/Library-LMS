// Feature: Book Management

// Section: Inventory Rendering and Search
function displayBooks() {
  let books = JSON.parse(localStorage.getItem("books")) || []
  let table = document.querySelector(".book-table table tbody");
  const search = document.getElementById("bookSearch")?.value.trim().toLowerCase() || "";
  const category = document.getElementById("bookCategoryFilter")?.value || "";
  table.innerHTML = "";
  books.filter((book) => {
    const searchable = `${book.bookTitle} ${book.bookAuthor} ${book.bookCategory} ${book.bookId}`.toLowerCase();
    return searchable.includes(search) && (!category || book.bookCategory === category);
  }).forEach((book) => {
    table.innerHTML += `  <tr>
        <td>${book.bookId}</td>
        <td>${book.bookTitle}</td>
        <td>${book.bookAuthor}</td>
        <td>${book.bookCategory}</td>
        <td>${book.bookQuantity}</td>
        <td>
          <button type="button" class="editBtn" aria-label="Edit ${book.bookTitle}" onClick=editBook('${book.bookId}')><span class="material-symbols-outlined" aria-hidden="true">edit</span>Edit</button>
          <button type="button" class="deleteBtn" aria-label="Delete ${book.bookTitle}" onClick=deleteBook('${book.bookId}')><span class="material-symbols-outlined" aria-hidden="true">delete</span>Delete</button>
        </td>
      </tr>`;
  });
}
displayBooks();
window.addEventListener("library:data-changed", displayBooks);
window.addEventListener("storage", displayBooks);
document.getElementById("bookSearch")?.addEventListener("input", displayBooks);
document.getElementById("bookCategoryFilter")?.addEventListener("change", displayBooks);

// Action: Confirm and Delete Book
async function deleteBook(id) {
  const result = await Swal.fire({
    icon: "warning",
    title: "Delete this book?",
    text: "This book will be removed from the inventory.",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true
  });
  if (!result.isConfirmed) return;

  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter((book) => book.bookId !== id);
  localStorage.setItem("books", JSON.stringify(books));
  window.dispatchLibraryDataChanged?.();
  displayBooks();
}

// Dialog: Add Book

// function openBookPopup() {
//   let b = JSON.parse(localStorage.getItem("books")) || []
//   let overlay = document.querySelector(".overlay");
//   overlay.style.display = "flex";
//   let id = document.getElementById("bookId");
//   console.log(b);
 
 
// }

let popup = document.getElementsByClassName("popup-container")[0];
let openPopup = document
  .getElementsByClassName("addBookBtn")[0]
  .addEventListener("click", function () {
    popup.hidden = false;
    popup.style.display = "block";
    let bookIdInput = document.getElementById("bookId");
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let id;
    if (books.length === 0) {
      id = "BK-101";
    } else {
      id =
        "BK-" +
        (Math.max(...books.map((book) => parseInt(book.bookId.replace("BK-", "")))) + 1);
    }
    bookIdInput.value = id;
  });
let closePopup = document
  .getElementsByClassName("cancelBtn")[0]
  .addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "none";
    popup.hidden = true;
  });

// Action: Save New Book
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
    Swal.fire({
      icon: "error",
      title: "Please fill in all fields."
    });
    return;
  }

  let books = JSON.parse(localStorage.getItem("books")) || [];
  // let id;
  // if(books.length ===0){
  //   id = "BK-101";
  // } else {
  //   id = Math.max(...books.map(book => parseInt(book.bookId.replace("BK-", "")))) + 1;
  // }

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
  window.dispatchLibraryDataChanged?.();
  Swal.fire({
    icon: "success",
    title: "Book added successfully.",
    timer: 2000,
    showConfirmButton: false
  });
  popup.style.display="none"
  popup.hidden = true;
  displayBooks();
  form.reset();
});

// Dialog: Edit Book
let editPopup = document.getElementsByClassName("popup-container")[1];
let editCancelBtn = document
  .getElementsByClassName("editCancelBtn")[0]
  .addEventListener("click", function (event) {
    event.preventDefault();
    editPopup.style.display = "none";
    editPopup.hidden = true;
  });
function editBook(id) {
  editPopup.hidden = false;
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
// Action: Save Book Changes
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
  window.dispatchLibraryDataChanged?.();
  Swal.fire({
    icon: "success",
    title: "Book edited successfully.",
    timer: 2000,
    showConfirmButton: false
  });
  displayBooks();
  editPopup.style.display="none"
  editPopup.hidden = true;
  

});
localStorage.removeItem("dlms_books")
