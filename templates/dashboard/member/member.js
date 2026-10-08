let members = JSON.parse(localStorage.getItem("libraryUser"));

function loadMembersData() {
  let main = document.querySelectorAll("#d-members table")[0]
  console.log(main);
  
  let totalUsers = document.getElementById("total-users");
  totalUsers.textContent = `Total Users : ${members.length}`;
  for (let i = 0; i < members.length; i++) {
    main.innerHTML += `<tr>
    <td>${members[i].name}</td>
    <td>${members[i].email}</td>
    <td>${members[i].address}</td>
    <td>${members[i].mobileNumber}</td>
    <td><button 
    class="editBtn"><span class=" edit-icon material-symbols-outlined">edit</span>Edit</button><button data-email="${members[i].email}" onclick="deleteUser(this)" 
    class="deleteBtn"><span class="delete-icon material-symbols-outlined">delete</span>Delete</button></td>
    </tr>`;
  }
}

// function deleteUser(button) {
//   const email = button.dataset.email;
//   members=members.filter((user) => user.email !== email);
//   localStorage.setItem('users',JSON.stringify(members))
//   button.closest('tr').remove();
//   loadMembersData()
// }

document.onload=loadMembersData();
