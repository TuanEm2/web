document.addEventListener("DOMContentLoaded", function () {
  // ===== DANH SÁCH ADMIN =====
  const ADMINS = [
    { username: "admin1", password: "1" },
  ];

  const adminTableBody = document.querySelector("#adminUsersTable tbody");
  ADMINS.forEach((admin) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${admin.username}</td>
      <td>${admin.password}</td>
    `;
    adminTableBody.appendChild(row);
  });

  // ===== DANH SÁCH KHÁCH HÀNG =====
  const USER_STORAGE_KEY = 'soi_registered_user';

  const users=getUsers();

  // ====== HÀM LẤY USERS TỪ LOCAL STORAGE ======
  function getUsers() {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
  }

  function saveUsers() {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }


  const usersTable = document.querySelector("#customerUsersTable tbody");
  const addCustomerBtn = document.querySelector(".add-customer-btn");
  const searchCustomer = document.querySelector("#searchCustomer");




  

  // ======= RENDER DANH SÁCH =======
  function renderCustomers() {
    usersTable.innerHTML = "";
    users.forEach((c, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.email}</td>
        <td>${c.password}</td>
        <td>${c.firstName}</td>
        <td>${c.lastName}</td>
        <td>${c.phone}</td>
        <td>${c.address}</td>
        <td>${c.createdAt ? c.createdAt : "—"}</td>
        <td>
          <button class="btn-edit">Sửa</button>
          <button class="btn-delete">Xóa</button>
        </td>
      `;
      attachCustomerEvents(row, i);
      usersTable.appendChild(row);
    });
    applyFilters();
  }

  // ======= TẢI DỮ LIỆU (hoặc tạo mẫu nếu chưa có) =======
  function loadCustomers() {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
    } else {
      // --- DỮ LIỆU NGẪU NHIÊN BAN ĐẦU ---
      users = [
        {
          email: "nguyenvana@example.com",
          password: "123456",
          firstName: "Nguyễn",
          lastName: "Văn A",
          phone: "0905123456",
          address: "12 Nguyễn Huệ, TP. Hồ Chí Minh",
          createdAt: new Date().toLocaleString("vi-VN"),
        },
        {
          email: "tranthib@example.com",
          password: "abcdef",
          firstName: "Trần",
          lastName: "Thị B",
          phone: "0987123123",
          address: "45 Lê Lợi, Hà Nội",
          createdAt: new Date().toLocaleString("vi-VN"),
        },
        {
          email: "leminhc@example.com",
          password: "qwerty",
          firstName: "Lê",
          lastName: "Minh C",
          phone: "0912345678",
          address: "23 Trần Phú, Đà Nẵng",
          createdAt: new Date().toLocaleString("vi-VN"),
        },
        {
          email: "phamd@example.com",
          password: "zxcvbn",
          firstName: "Phạm",
          lastName: "D",
          phone: "0978123456",
          address: "56 Lý Thường Kiệt, Cần Thơ",
          createdAt: new Date().toLocaleString("vi-VN"),
        },
        {
          email: "hoangk@example.com",
          password: "password",
          firstName: "Hoàng",
          lastName: "K",
          phone: "0934343434",
          address: "78 Nguyễn Trãi, Huế",
          createdAt: new Date().toLocaleString("vi-VN"),
        },
      ];
      saveCustomers();
    }
    renderCustomers();
  }

  // ======= TÌM KIẾM KHÁCH HÀNG =======
  function applyFilters() {
    const keyword = searchCustomer.value.trim().toLowerCase();
    usersTable.querySelectorAll("tr").forEach((row) => {
      const match = row.textContent.toLowerCase().includes(keyword);
      row.style.display = match ? "" : "none";
    });
  }

  searchCustomer.addEventListener("input", applyFilters);

  // ======= THÊM KHÁCH HÀNG =======
  addCustomerBtn.addEventListener("click", () => {
    const newRow = document.createElement("tr");
    newRow.classList.add("editing");
    newRow.innerHTML = `
      <td contenteditable="true">email@example.com</td>
      <td contenteditable="true">password</td>
      <td contenteditable="true">First Name</td>
      <td contenteditable="true">Last Name</td>
      <td contenteditable="true">0123456789</td>
      <td contenteditable="true">Địa chỉ</td>
      <td>${new Date().toLocaleString("vi-VN")}</td>
      <td>
        <button class="btn-save-inline">Lưu</button>
        <button class="btn-cancel-inline">Hủy</button>
      </td>
    `;
    usersTable.appendChild(newRow);
    newRow.scrollIntoView({ behavior: "smooth" });

    newRow.querySelector(".btn-save-inline").addEventListener("click", () => {
      users.push({
        email: newRow.children[0].textContent.trim(),
        password: newRow.children[1].textContent.trim(),
        firstName: newRow.children[2].textContent.trim(),
        lastName: newRow.children[3].textContent.trim(),
        phone: newRow.children[4].textContent.trim(),
        address: newRow.children[5].textContent.trim(),
        createdAt: newRow.children[6].textContent.trim(),
    });
      saveCustomers();
      renderCustomers();
    });

    newRow
      .querySelector(".btn-cancel-inline")
      .addEventListener("click", () => newRow.remove());
  });

  // ======= SỬA / XÓA KHÁCH HÀNG =======
  function attachCustomerEvents(row, index) {
    row.querySelector(".btn-edit").addEventListener("click", () => {
      const c = users[index];
      row.classList.add("editing");
      row.innerHTML = `
        <td contenteditable="true">${c.email}</td>
        <td contenteditable="true">${c.password}</td>
        <td contenteditable="true">${c.firstName}</td>
        <td contenteditable="true">${c.lastName}</td>
        <td contenteditable="true">${c.phone}</td>
        <td contenteditable="true">${c.address}</td>
        <td>${c.createdAt}</td>
        <td>
          <button class="btn-save-inline">Lưu</button>
          <button class="btn-cancel-inline">Hủy</button>
        </td>
      `;
      row.querySelector(".btn-save-inline").addEventListener("click", () => {
        users[index] = {
          email: row.children[0].textContent.trim(),
          password: row.children[1].textContent.trim(),
          firstName: row.children[2].textContent.trim(),
          lastName: row.children[3].textContent.trim(),
          phone: row.children[4].textContent.trim(),
          address: row.children[5].textContent.trim(),
          createdAt: c.createdAt, // Giữ nguyên ngày tạo
        };
        saveCustomers();
        renderCustomers();
      });
      row
        .querySelector(".btn-cancel-inline")
        .addEventListener("click", renderCustomers);
    });

    row.querySelector(".btn-delete").addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
        users.splice(index, 1);
        saveCustomers();
        renderCustomers();
      }
    });
  }

  // ======= KHỞI CHẠY =======
  loadCustomers();
});
