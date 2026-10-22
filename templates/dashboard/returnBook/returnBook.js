// Feature: Return Book
(() => {
  const rows = document.getElementById("returnBookRows");
  const searchInput = document.getElementById("returnBookSearch");
  const filterSelect = document.getElementById("returnBookFilter");
  const count = document.getElementById("returnBookCount");
  const emptyMessage = document.getElementById("returnBookEmpty");

  if (!rows || !searchInput || !filterSelect || !count || !emptyMessage) return;

  // Section: Shared Loan Data and Rendering
  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function appendCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text || "-";
    row.appendChild(cell);
    return cell;
  }

  function renderLoans() {
    const loans = readList("issuebooks");
    const today = getToday();
    const search = searchInput.value.trim().toLowerCase();
    const showOverdue = filterSelect.value === "overdue";
    rows.replaceChildren();
    count.textContent = String(loans.length);

    loans.forEach((loan, index) => {
      const isOverdue = Boolean(loan.dueDate && loan.dueDate < today);
      const searchableText = `${loan.issueBook || ""} ${loan.issueMember || ""} ${loan.bookId || ""}`.toLowerCase();
      if (!searchableText.includes(search) || (showOverdue && !isOverdue)) return;

      const row = document.createElement("tr");
      appendCell(row, loan.issueBook);
      appendCell(row, loan.issueMember);
      appendCell(row, loan.issueDate);
      appendCell(row, loan.dueDate);

      const statusCell = document.createElement("td");
      const status = document.createElement("span");
      status.className = `return-book-status${isOverdue ? " is-overdue" : ""}`;
      status.textContent = isOverdue ? "Overdue" : "On time";
      statusCell.appendChild(status);
      row.appendChild(statusCell);

      const actionCell = document.createElement("td");
      const returnButton = document.createElement("button");
      returnButton.type = "button";
      returnButton.className = "return-book-action";
      returnButton.dataset.loanIndex = String(index);
      returnButton.setAttribute("aria-label", `Return ${loan.issueBook || "book"}`);
      returnButton.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">assignment_return</span>Return';
      actionCell.appendChild(returnButton);
      row.appendChild(actionCell);
      rows.appendChild(row);
    });

    emptyMessage.hidden = rows.childElementCount !== 0;
  }

  // Action: Confirm and Complete a Return
  async function confirmReturn() {
    const result = await window.Swal.fire({
      icon: "question",
      title: "Return this book?",
      text: "The loan will be closed and the book quantity restored.",
      showCancelButton: true,
      confirmButtonText: "Yes, return it",
      cancelButtonText: "Cancel",
      reverseButtons: true
    });
    return result.isConfirmed;
  }

  function showMessage(icon, title) {
    window.Swal.fire({ icon, title, confirmButtonText: "OK" });
  }

  rows.addEventListener("click", async (event) => {
    const button = event.target.closest(".return-book-action");
    if (!button || !(await confirmReturn())) return;

    const loanIndex = Number(button.dataset.loanIndex);
    const loans = readList("issuebooks");
    const loan = loans[loanIndex];
    if (!loan) {
      renderLoans();
      return;
    }

    const books = readList("books");
    const book = books.find((item) => item.bookId === loan.bookId);
    if (!book) {
      showMessage("error", "This book is missing from the inventory.");
      return;
    }

    book.bookQuantity = Number(book.bookQuantity || 0) + 1;
    loans.splice(loanIndex, 1);
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("issuebooks", JSON.stringify(loans));
    window.dispatchLibraryDataChanged?.();
    renderLoans();
    showMessage("success", "Book returned successfully.");
  });

  searchInput.addEventListener("input", renderLoans);
  filterSelect.addEventListener("change", renderLoans);
  window.addEventListener("library:data-changed", renderLoans);
  renderLoans();
})();