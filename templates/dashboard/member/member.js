// Feature: Member Management

// Section: Member Storage and Search Rendering
function readMembers() {
  try {
    const members = JSON.parse(localStorage.getItem("libraryUser") || "[]");
    return Array.isArray(members) ? members : [];
  } catch {
    return [];
  }
}

function loadMembersData() {
  const members = readMembers();
  const search = document.getElementById("memberSearch")?.value.trim().toLowerCase() || "";
  const rows = document.querySelector("#d-members tbody");
  const totalUsers = document.getElementById("total-users");
  if (!rows || !totalUsers) return;

  const filteredMembers = members.filter((member) =>
    [member.name, member.email, member.address, member.mobileNumber]
      .some((value) => String(value || "").toLowerCase().includes(search))
  );
  totalUsers.textContent = `Total Users: ${filteredMembers.length} of ${members.length}`;
  rows.replaceChildren();
  filteredMembers.forEach((member) => {
    const row = document.createElement("tr");
    [member.name, member.email, member.address, member.mobileNumber].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value || "-";
      row.appendChild(cell);
    });

    const actions = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "editBtn";
    editButton.dataset.email = member.email || "";
    editButton.setAttribute("aria-label", `Edit ${member.name || "member"}`);
    editButton.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">edit</span>Edit';
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "deleteBtn";
    deleteButton.dataset.email = member.email || "";
    deleteButton.setAttribute("aria-label", `Delete ${member.name || "member"}`);
    deleteButton.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">delete</span>Delete';
    actions.append(editButton, deleteButton);
    row.appendChild(actions);
    rows.appendChild(row);
  });
}

// Section: Member Edit Dialog and Row Actions
const memberRows = document.querySelector("#d-members tbody");
const memberEditPopup = document.getElementById("memberEditPopup");
const memberEditForm = document.getElementById("memberEditForm");

function closeMemberEdit() {
  if (memberEditPopup) memberEditPopup.hidden = true;
}

memberRows?.addEventListener("click", async (event) => {
  const editButton = event.target.closest(".editBtn");
  if (editButton) {
    const member = readMembers().find((item) => item.email === editButton.dataset.email);
    if (!member || !memberEditPopup) return;

    document.getElementById("memberEditOriginalEmail").value = member.email || "";
    document.getElementById("memberEditName").value = member.name || "";
    document.getElementById("memberEditEmail").value = member.email || "";
    document.getElementById("memberEditAddress").value = member.address || "";
    document.getElementById("memberEditPhone").value = member.mobileNumber || "";
    memberEditPopup.hidden = false;
    document.getElementById("memberEditName").focus();
    return;
  }

  const button = event.target.closest(".deleteBtn");
  if (!button) return;

  const result = await Swal.fire({
    icon: "warning",
    title: "Delete this member?",
    text: "This member record will be removed.",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true
  });
  if (!result.isConfirmed) return;

  const members = readMembers().filter((member) => member.email !== button.dataset.email);
  localStorage.setItem("libraryUser", JSON.stringify(members));
  window.dispatchLibraryDataChanged?.();
  loadMembersData();
});

// Action: Validate and Save Member Changes
memberEditForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!memberEditForm.reportValidity()) return;

  const result = await Swal.fire({
    icon: "question",
    title: "Save member changes?",
    showCancelButton: true,
    confirmButtonText: "Save changes",
    cancelButtonText: "Cancel",
    reverseButtons: true
  });
  if (!result.isConfirmed) return;

  const members = readMembers();
  const originalEmail = document.getElementById("memberEditOriginalEmail").value;
  const memberIndex = members.findIndex((member) => member.email === originalEmail);
  if (memberIndex < 0) {
    closeMemberEdit();
    loadMembersData();
    return;
  }

  members[memberIndex] = {
    ...members[memberIndex],
    name: document.getElementById("memberEditName").value.trim(),
    email: document.getElementById("memberEditEmail").value.trim(),
    address: document.getElementById("memberEditAddress").value.trim(),
    mobileNumber: document.getElementById("memberEditPhone").value.trim()
  };
  localStorage.setItem("libraryUser", JSON.stringify(members));
  closeMemberEdit();
  window.dispatchLibraryDataChanged?.();
  loadMembersData();
  Swal.fire({ icon: "success", title: "Member updated", timer: 1600, showConfirmButton: false });
});

document.getElementById("cancelMemberEdit")?.addEventListener("click", closeMemberEdit);
document.getElementById("closeMemberEdit")?.addEventListener("click", closeMemberEdit);
memberEditPopup?.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-member-edit]")) closeMemberEdit();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && memberEditPopup && !memberEditPopup.hidden) closeMemberEdit();
});

window.addEventListener("library:data-changed", loadMembersData);
window.addEventListener("storage", loadMembersData);
document.getElementById("memberSearch")?.addEventListener("input", loadMembersData);
loadMembersData();
