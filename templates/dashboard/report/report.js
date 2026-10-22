// Feature: Reports
(() => {
	const elementIds = [
		"reportBookTitles",
		"reportAvailableCopies",
		"reportMembers",
		"reportActiveLoans",
		"reportOverdueLoans",
		"reportCategoryRows",
		"reportCategoryEmpty",
		"reportLoanRows",
		"reportLoanEmpty",
		"reportLoanSearch",
		"reportLoanFilter",
		"refreshReport",
		"exportReport"
	];
	const elements = Object.fromEntries(
		elementIds.map((id) => [id, document.getElementById(id)])
	);

	if (Object.values(elements).some((element) => !element)) return;

	// Section: Shared Report Data
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

	function getFilteredLoans() {
		const today = getToday();
		const search = elements.reportLoanSearch.value.trim().toLowerCase();
		const filter = elements.reportLoanFilter.value;

		return readList("issuebooks").map((loan, index) => ({
			...loan,
			reportIndex: index,
			overdue: Boolean(loan.dueDate && loan.dueDate < today)
		})).filter((loan) => {
			const text = `${loan.bookId || ""} ${loan.issueBook || ""} ${loan.issueMember || ""}`.toLowerCase();
			const matchesStatus = filter === "all" || (filter === "overdue" ? loan.overdue : !loan.overdue);
			return text.includes(search) && matchesStatus;
		});
	}

	// Section: Category Summary
	function renderCategoryReport(books) {
		const categories = new Map();

		books.forEach((book) => {
			const category = book.bookCategory || "Uncategorized";
			const summary = categories.get(category) || { titles: 0, available: 0 };
			summary.titles += 1;
			summary.available += Number(book.bookQuantity) || 0;
			categories.set(category, summary);
		});

		elements.reportCategoryRows.replaceChildren();
		[...categories.entries()]
			.sort(([first], [second]) => first.localeCompare(second))
			.forEach(([category, summary]) => {
				const row = document.createElement("tr");
				appendCell(row, category);
				appendCell(row, String(summary.titles));
				appendCell(row, String(summary.available));
				elements.reportCategoryRows.appendChild(row);
			});

		elements.reportCategoryEmpty.hidden = categories.size !== 0;
	}

	// Section: Active Loan Results and Filters
	function renderLoanReport() {
		const loans = getFilteredLoans();
		elements.reportLoanRows.replaceChildren();

		loans.forEach((loan) => {
			const row = document.createElement("tr");
			appendCell(row, loan.issueBook);
			appendCell(row, loan.issueMember);
			appendCell(row, loan.issueDate);
			appendCell(row, loan.dueDate);

			const statusCell = document.createElement("td");
			const status = document.createElement("span");
			status.className = `report-status${loan.overdue ? " is-overdue" : ""}`;
			status.textContent = loan.overdue ? "Overdue" : "On time";
			statusCell.appendChild(status);
			row.appendChild(statusCell);
			elements.reportLoanRows.appendChild(row);
		});

		elements.reportLoanEmpty.hidden = loans.length !== 0;
		return loans;
	}

	// Section: Summary Metrics
	function renderReport() {
		const books = readList("books");
		const members = readList("libraryUser");
		const loans = readList("issuebooks");
		const today = getToday();
		const overdueCount = loans.filter((loan) => loan.dueDate && loan.dueDate < today).length;
		const availableCopies = books.reduce((total, book) => total + (Number(book.bookQuantity) || 0), 0);

		elements.reportBookTitles.textContent = String(books.length);
		elements.reportAvailableCopies.textContent = String(availableCopies);
		elements.reportMembers.textContent = String(members.length);
		elements.reportActiveLoans.textContent = String(loans.length);
		elements.reportOverdueLoans.textContent = String(overdueCount);
		renderCategoryReport(books);
		renderLoanReport();
	}

	// Section: CSV Export
	function csvCell(value) {
		return `"${String(value || "").replaceAll('"', '""')}"`;
	}

	function exportLoans() {
		const rows = [
			["Book ID", "Book", "Member", "Issue Date", "Due Date", "Status"],
			...getFilteredLoans().map((loan) => [
				loan.bookId,
				loan.issueBook,
				loan.issueMember,
				loan.issueDate,
				loan.dueDate,
				loan.overdue ? "Overdue" : "On time"
			])
		];
		const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
		const download = document.createElement("a");
		download.href = url;
		download.download = `library-active-loans-${getToday()}.csv`;
		document.body.appendChild(download);
		download.click();
		download.remove();
		URL.revokeObjectURL(url);
	}

	elements.reportLoanSearch.addEventListener("input", renderLoanReport);
	elements.reportLoanFilter.addEventListener("change", renderLoanReport);
	elements.refreshReport.addEventListener("click", renderReport);
	elements.exportReport.addEventListener("click", exportLoans);
	window.addEventListener("library:data-changed", renderReport);
	document.querySelector('[data-section="d-reports"]')?.addEventListener("click", renderReport);
	window.addEventListener("storage", renderReport);

	renderReport();
})();
