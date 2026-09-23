// =========================================
// Dashboard Navication
// =========================================

const items = document.querySelectorAll(".menu li");
items.forEach((item) => {
  item.addEventListener("click", () => {
    const id = item.dataset.section;
    console.log(id);

    
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
      });
    
  });
});
