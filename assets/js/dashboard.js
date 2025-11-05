// ==============================
//  DASHBOARD ADMIN SCRIPT
// ==============================



document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".admin-nav li");
  const sections = document.querySelectorAll(".admin-section");
  const pageTitle = document.getElementById("pageTitle");


  // 🔹 1. Chuyển tab khi nhấn vào menu
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Xóa active khỏi tất cả
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      // Ẩn tất cả section
      sections.forEach((sec) => (sec.style.display = "none"));

      // Hiện section tương ứng
      const sectionId = item.getAttribute("data-section");
      const currentSection = document.getElementById(sectionId);
      if (currentSection) currentSection.style.display = "block";

      // Cập nhật tiêu đề bên trái
      const text = item.textContent.trim();
      pageTitle.textContent = text;
    });
  });
});

//Danh sách admin
const ADMINS = [
  { username: "admin1", password: "1"},
  { username: "admin2", password: "2"},
  { username: "admin3", password: "3"}
];



// ======= XỬ LÝ ĐĂNG NHẬP / ĐĂNG XUẤT =======
document.addEventListener("DOMContentLoaded", function () {
  const loginPage = document.querySelector(".admin-login-page");
  const adminWrapper = document.querySelector(".admin-wrapper");
  const loginForm = document.querySelector(".login-form");
  const logoutBtn = document.getElementById("logoutBtn");
  const errorMsg = document.getElementById("loginError");

  // Ẩn trang admin khi chưa đăng nhập
  if (adminWrapper) adminWrapper.style.display = "none";
  if (!loginForm) return;

  // === Đăng nhập ===
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // Duyệt mảng kiểm tra tài khoản
    let valid = false;
    for (let i = 0; i < ADMINS.length; i++) {
      if (ADMINS[i].username === user && ADMINS[i].password === pass) {
        valid = true;
        break;
      }
    }

    if (valid) {
      //  Đăng nhập thành công
      errorMsg.textContent = "";
      loginPage.style.display = "none";
      adminWrapper.style.display = "flex";
    } else {
      //  Sai tài khoản hoặc mật khẩu
      errorMsg.textContent = "Sai tài khoản hoặc mật khẩu!";
      loginForm.classList.add("shake");
      setTimeout(() => loginForm.classList.remove("shake"), 400);
    }
  });

  // === Đăng xuất ===
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      adminWrapper.style.display = "none";
      loginPage.style.display = "flex";
      loginForm.reset();
      errorMsg.textContent = "";
    });
  }
});