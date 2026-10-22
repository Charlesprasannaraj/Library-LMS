// Page Support: Dashboard Navigation and Summary

// Section: Navigation Elements
const menuItems = document.querySelectorAll(".menu li[data-section]");
const sidebar = document.querySelector("aside");
const navToggle = document.getElementById("mobileNavToggle");
const main = document.querySelector("main");

// Section: Active Page Switching
function activateSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  document.querySelectorAll("main > .content-container > section, main > section").forEach((page) => {
    page.classList.remove("section-active");
  });
  main?.classList.toggle("dashboard-view-active", sectionId === "d-dashboard");
  section.classList.add("section-active");
  section.scrollTop = 0;
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);
}

// Section: Mobile Navigation Toggle
navToggle?.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    activateSection(item.dataset.section);
    menuItems.forEach((menuItem) => menuItem.classList.remove("active"));
    item.classList.add("active");
    sidebar.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

// Section: Dashboard Quick Actions
document.querySelectorAll(".action").forEach((action) => {
  action.addEventListener("click", () => {
    if (action.dataset.action === "add-book") {
      document.querySelector('.menu li[data-section="d-books"]')?.click();
      document.querySelector(".addBookBtn")?.click();
      return;
    }

    document.querySelector(`.menu li[data-section="${action.dataset.section}"]`)?.click();
  });
});

// Section: Shared Library Data Updates
window.dispatchLibraryDataChanged = function () {
  window.dispatchEvent(new Event("library:data-changed"));
};

// Section: Dashboard Metrics and Recent Loans
(() => {
  const totalBooks = document.getElementById("dashboardTotalBooks");
  const availableBooks = document.getElementById("dashboardAvailableBooks");
  const memberCount = document.getElementById("dashboardMemberCount");
  const activeLoans = document.getElementById("dashboardActiveLoans");
  const recentLoans = document.getElementById("dashboardRecentLoans");

  if (!totalBooks || !availableBooks || !memberCount || !activeLoans || !recentLoans) return;

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function appendCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text || "-";
    row.appendChild(cell);
    return cell;
  }

  function renderDashboard() {
    const books = readList("books");
    const members = readList("libraryUser");
    const loans = readList("issuebooks");
    const availableCount = books.reduce((total, book) => total + (Number(book.bookQuantity) || 0), 0);

    totalBooks.textContent = String(availableCount + loans.length);
    availableBooks.textContent = String(availableCount);
    memberCount.textContent = String(members.length);
    activeLoans.textContent = String(loans.length);
    recentLoans.replaceChildren();

    const latestLoans = loans.slice(-5).reverse();
    if (latestLoans.length === 0) {
      const row = document.createElement("tr");
      const cell = appendCell(row, "No active loans.");
      cell.colSpan = 5;
      recentLoans.appendChild(row);
      return;
    }

    const today = new Date();
    const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    latestLoans.forEach((loan) => {
      const row = document.createElement("tr");
      appendCell(row, loan.issueMember);
      appendCell(row, loan.issueBook);
      appendCell(row, loan.issueDate);
      appendCell(row, loan.dueDate);

      const statusCell = document.createElement("td");
      const status = document.createElement("span");
      const isOverdue = Boolean(loan.dueDate && loan.dueDate < todayValue);
      status.className = `dashboard-loan-status${isOverdue ? " is-overdue" : ""}`;
      status.textContent = isOverdue ? "Overdue" : "Issued";
      statusCell.appendChild(status);
      row.appendChild(statusCell);
      recentLoans.appendChild(row);
    });
  }

  window.addEventListener("library:data-changed", renderDashboard);
  window.addEventListener("storage", renderDashboard);
  document.querySelector('[data-section="d-dashboard"]')?.addEventListener("click", renderDashboard);
  renderDashboard();
})();

