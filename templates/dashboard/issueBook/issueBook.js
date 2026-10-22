// Feature: Issue Book

// Section: Member and Available Book Selectors
    // Declare the variable whatever we will use the document
    let memberSelect = document.getElementById('memberSelect')
    let bookSelect = document.getElementById('bookSelect')
    let issueDate = document.getElementById('issueDate')
    let dueDate = document.getElementById('dueDate')
    let issueBtn = document.getElementById('issueBtn')

    //get the member and books list in the local Storage

    let users = JSON.parse(localStorage.getItem('libraryUser')) || [];
    let books = JSON.parse(localStorage.getItem('books')) || [];

    function renderMembers() {
      users = JSON.parse(localStorage.getItem('libraryUser')) || [];
      memberSelect.replaceChildren(new Option('....Select Member....', ''));
      users.forEach((user) => {
        let element = document.createElement('option')
        element.value = user.name
        element.textContent = user.name;
        memberSelect.appendChild(element)
      })
    }

    //Books Render
    function renderBook() {
      books = JSON.parse(localStorage.getItem('books')) || [];
      bookSelect.replaceChildren(new Option('Select Book...', ''));
      let filteredBooks = books.filter((book) => book.bookQuantity > 0)
      filteredBooks.forEach((book) => {
        let element = document.createElement('option')
        element.value = book.bookId
        element.textContent = book.bookTitle;
        bookSelect.appendChild(element)
      })
    }
    renderMembers();
    renderBook()

    // Section: Live Issue Workflow Data
    const issueAvailableCopies = document.getElementById('issueAvailableCopies');
    const issueActiveCount = document.getElementById('issueActiveCount');
    const latestDetails = document.getElementById('issueLatestDetails');
    const latestEmpty = document.getElementById('issueLatestEmpty');

    function readStoredList(key) {
      try {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(stored) ? stored : [];
      } catch {
        return [];
      }
    }

    function renderIssueActivity() {
      if (!issueAvailableCopies || !issueActiveCount || !latestDetails || !latestEmpty) return;

      const storedBooks = readStoredList('books');
      const activeIssues = readStoredList('issuebooks');
      const availableCopies = storedBooks.reduce((total, book) => total + (Number(book.bookQuantity) || 0), 0);

      issueAvailableCopies.textContent = String(availableCopies);
      issueActiveCount.textContent = String(activeIssues.length);

      const latestIssue = activeIssues[activeIssues.length - 1];
      latestDetails.hidden = !latestIssue;
      latestEmpty.hidden = Boolean(latestIssue);
      if (!latestIssue) return;

      document.getElementById('issueLatestBook').textContent = latestIssue.issueBook || '-';
      document.getElementById('issueLatestMember').textContent = latestIssue.issueMember || '-';
      document.getElementById('issueLatestDate').textContent = latestIssue.issueDate || '-';
      document.getElementById('issueLatestDue').textContent = latestIssue.dueDate || '-';
    }

    renderIssueActivity();
    window.addEventListener('library:data-changed', () => {
      renderMembers();
      renderBook();
      renderIssueActivity();
    });
    window.addEventListener('storage', () => {
      renderMembers();
      renderBook();
      renderIssueActivity();
    });

    // Section: Default Issue and Due Dates
    const date = new Date();
    issueDate.value = date.toISOString().split('T')[0]

    //Due Date
    const dDate = new Date();
    dDate.setMonth(dDate.getMonth() + 1)
    dueDate.value = dDate.toISOString().split('T')[0]





    // localStorage.removeItem('books')

    // Action: Validate and Record a Book Issue
    issueBtn.addEventListener('click', function (event) {
      event.preventDefault();
      let issueDate = document.getElementById('issueDate')
      let dueDate = document.getElementById('dueDate')


      if (memberSelect.value == "" || bookSelect.value == "") {
        Swal.fire({
          icon: "warning",
          title: "Please Select all Fields"
        })
        return
      } else if (new Date(dueDate.value) <= new Date(issueDate.value)) {
        Swal.fire({
          icon: "info",
          title: "Invalid Date Choose"
        })


        return


      }
      else {
        let issueBooks = JSON.parse(localStorage.getItem('issuebooks')) || [];
        const selectedBook = books.find(book => book.bookId === bookSelect.value)
        const newIssue = {
          bookId: selectedBook.bookId,
          issueMember: memberSelect.value,
          issueBook: selectedBook.bookTitle,
          issueDate: issueDate.value,
          dueDate: dueDate.value
        }
        issueBooks.push(newIssue)
        localStorage.setItem("issuebooks", JSON.stringify(issueBooks))
        Swal.fire({
          icon: "success",
          title: "Book Issue Successfully"
        })
        updateQuantity(selectedBook.bookId);
        window.dispatchLibraryDataChanged?.();


      }
      function updateQuantity(uid) {
        const updateBook = books.find(book => book.bookId === uid);
        updateBook.bookQuantity = Number(updateBook.bookQuantity) - 1;
        localStorage.setItem('books', JSON.stringify(books))
        renderBook()



      }






    })

    // localStorage.removeItem('issuebooks')
