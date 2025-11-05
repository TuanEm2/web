document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.querySelector("#ordersTable tbody");
  const addOrderBtn = document.querySelector(".add-order-btn");
  const filterStatus = document.getElementById("filterStatus");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const filterBtn = document.getElementById("filterDateBtn");
  const searchOrder = document.getElementById("searchOrder");

  // === KEY CHUNG ===
  // Sử dụng chung Key với trang của khách hàng
  const MASTER_ORDER_KEY = "soi_order_history"; 

  // 'masterOrders' là danh sách gốc (nested) từ localStorage
  let masterOrders = []; 
  // 'flatOrders' là danh sách đã được "trải phẳng" để hiển thị ra bảng
  let flatOrders = []; 

  // ======================
  // HELPERS
  // ======================
  
  /**
   * (MỚI) Lưu danh sách MASTER (nested) vào localStorage
   */
  function saveMasterOrders() {
    localStorage.setItem(MASTER_ORDER_KEY, JSON.stringify(masterOrders));
  }

  /**
   * (MỚI) Chuyển đổi ngày ISO (từ localStorage) sang "dd/mm/yyyy"
   */
  function formatISODateToVN(isoString) {
      if (!isoString) return "N/A";
      try {
          return new Date(isoString).toLocaleDateString("vi-VN");
      } catch (e) {
          return "Invalid Date";
      }
  }

  /**
   * (GIỮ NGUYÊN) Dùng để lọc
   */
  function parseVNDate(str) {
    if (!str) return null;
    // Hỗ trợ cả yyyy-mm-dd (từ input[type=date])
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str); 
    // Hỗ trợ cả dd/mm/yyyy (từ bảng)
    const parts = str.trim().split(/[\/\-\.]/); 
    if (parts.length !== 3) return null; // Bỏ qua nếu không đúng định dạng
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, day);
  }

  /**
   * (GIỮ NGUYÊN) Hiển thị trạng thái
   */
  function statusBadge(status) {
    const map = {
      processing: { text: "Đang xử lý", color: "#f1c40f" },
      delivered: { text: "Đã giao", color: "#27ae60" },
      canceled: { text: "Đã hủy", color: "#e74c3c" },
    };
    const s = map[status] || { text: status, color: "#999" };
    return `<span style="background:${s.color};color:white;padding:4px 8px;border-radius:6px;font-size:12px;">${s.text}</span>`;
  }

  // ======================
  // RENDER ORDERS
  // ======================
  /**
   * (GIỮ NGUYÊN) Render danh sách 'flatOrders'
   */
  function renderOrders() {
    ordersTable.innerHTML = "";
    flatOrders.forEach((o, i) => {
      const row = document.createElement("tr");
      // Lưu trạng thái vào data-status để lọc
      row.dataset.status = o.status; 
      row.innerHTML = `
        <td>${o.id}</td>
        <td>${o.customer}</td>
        <td>${o.product}</td>
        <td>${o.quantity}</td>
        <td>${o.total.toLocaleString("vi-VN")} đ</td>
        <td>${o.date}</td>
        <td>${statusBadge(o.status)}</td>
        <td>
          <button class="btn-edit" data-flat-index="${i}">Sửa</button>
          <button class="btn-delete" data-flat-index="${i}">Xóa</button>
        </td>
      `;
      // Gắn sự kiện (đã cập nhật)
      attachOrderEvents(row, i); 
      ordersTable.appendChild(row);
    });
    applyFilters();
  }

  // ======================
  // LOAD ORDERS (ĐÃ VIẾT LẠI)
  // ======================
  function loadOrders() {
    const saved = localStorage.getItem(MASTER_ORDER_KEY);
    masterOrders = saved ? JSON.parse(saved) : [];

    // Reset danh sách phẳng
    flatOrders = []; 
    
    // "Trải phẳng" dữ liệu từ masterOrders
    masterOrders.forEach((order, orderIndex) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item, itemIndex) => {
          
          // Tạo một hàng cho mỗi item
          flatOrders.push({
            id: order.id,
            // Lấy Tên khách hàng từ địa chỉ (vì order obj chỉ có address)
            customer: order.address, 
            product: item.name,
            quantity: item.quantity,
            total: item.price * item.quantity,
            date: formatISODateToVN(order.date), // Chuyển đổi ngày
            status: order.status || "processing", // Đặt mặc định nếu thiếu
            
            // Quan trọng: Lưu chỉ số gốc để cập nhật lại
            _originalOrderIndex: orderIndex, 
            _originalItemIndex: itemIndex 
          });
        });
      }
    });

    renderOrders(); // Render danh sách phẳng mới
  }

  // ======================
  // FILTER FUNCTION (ĐÃ CẬP NHẬT)
  // ======================
  function applyFilters() {
    const statusValue = filterStatus?.value.toLowerCase() || "all";
    const start = startDate?.value ? parseVNDate(startDate.value) : null;
    const end = endDate?.value ? parseVNDate(endDate.value) : null;
    const keyword = searchOrder?.value.trim().toLowerCase() || "";

    // Đặt lại ngày kết thúc về cuối ngày
    if (end) end.setHours(23, 59, 59, 999);

    const rows = ordersTable.querySelectorAll("tr");
    rows.forEach(row => {
      const rowStatus = row.dataset.status.toLowerCase();
      const dateText = row.children[5].textContent.trim();
      const orderDate = parseVNDate(dateText);
      const fullText = row.textContent.toLowerCase();

      const matchesStatus = statusValue === "all" || rowStatus === statusValue;
      
      let matchesDate = true;
      if (orderDate) {
          if (start && orderDate < start) matchesDate = false;
          if (end && orderDate > end) matchesDate = false;
      } else {
          // Nếu không có ngày, không lọc theo ngày
          if (start || end) matchesDate = false; 
      }

      const matchesKeyword = !keyword || fullText.includes(keyword);

      row.style.display = (matchesStatus && matchesDate && matchesKeyword) ? "" : "none";
    });
  }

  // Gắn sự kiện lọc (Giữ nguyên)
  [filterStatus, startDate, endDate, searchOrder].forEach(el => {
    if (el) el.addEventListener("input", applyFilters);
  });
  if (filterBtn) filterBtn.addEventListener("click", applyFilters);

  // ======================
  // ADD ORDER (ĐÃ TẮT)
  // ======================
  // Việc thêm đơn hàng từ admin rất phức tạp với cấu trúc mới.
  // Chúng ta sẽ ẩn nút này đi để tránh lỗi.
  if (addOrderBtn) {
    addOrderBtn.style.display = 'none'; 
  }

  // ======================
  // EDIT / DELETE (ĐÃ VIẾT LẠI)
  // ======================
  function attachOrderEvents(row, flatIndex) {
    const editBtn = row.querySelector(".btn-edit");
    const deleteBtn = row.querySelector(".btn-delete");

    // === SỰ KIỆN SỬA (CLICK EDIT) ===
    editBtn.addEventListener("click", () => {
      const flatItem = flatOrders[flatIndex];
      const originalOrder = masterOrders[flatItem._originalOrderIndex];

      row.classList.add("editing");
      // Hiển thị giao diện chỉnh sửa
      row.innerHTML = `
        <td>${flatItem.id}</td>
        <td>${flatItem.customer}</td> 
        <td>${flatItem.product}</td>
        <td>${flatItem.quantity}</td>
        <td>${flatItem.total.toLocaleString("vi-VN")} đ</td>
        <td>${flatItem.date}</td>
        <td>
          <select class="order-status">
            <option value="processing" ${originalOrder.status === "processing" ? "selected" : ""}>Đang xử lý</option>
            <option value="delivered" ${originalOrder.status === "delivered" ? "selected" : ""}>Đã giao</option>
            <option value="canceled" ${originalOrder.status === "canceled" ? "selected" : ""}>Đã hủy</option>
          </select>
        </td>
        <td>
          <button class="btn-save">Lưu</button>
          <button class="btn-cancel">Hủy</button>
        </td>
      `;

      const statusSelect = row.querySelector(".order-status");

      // === SỰ KIỆN LƯU (CLICK SAVE) ===
      row.querySelector(".btn-save").addEventListener("click", () => {
        const newStatus = statusSelect.value;
        
        // **Đây là phần đồng bộ:**
        // 1. Lấy đơn hàng GỐC (master)
        const orderToUpdate = masterOrders[flatItem._originalOrderIndex];
        if (orderToUpdate) {
            // 2. Cập nhật trạng thái cho đơn hàng GỐC
            orderToUpdate.status = newStatus;
            
            // 3. Lưu lại TOÀN BỘ danh sách GỐC vào localStorage
            saveMasterOrders();
            
            // 4. Tải lại (loadOrders) để làm mới bảng admin
            loadOrders(); 
        } else {
            alert("Lỗi: Không tìm thấy đơn hàng gốc!");
            loadOrders(); // Tải lại để hủy thay đổi
        }
      });

      // === SỰ KIỆN HỦY (CLICK CANCEL) ===
      row.querySelector(".btn-cancel").addEventListener("click", () => {
        renderOrders(); // Chỉ cần render lại danh sách phẳng
      });
    });

    // === SỰ KIỆN XÓA (CLICK DELETE) ===
    deleteBtn.addEventListener("click", () => {
      // Xác nhận xem nên xóa 1 item hay xóa cả đơn hàng.
      // Hiện tại, logic này sẽ xóa TOÀN BỘ đơn hàng.
      if (confirm(`Bạn có chắc chắn muốn xóa TOÀN BỘ đơn hàng [${flatOrders[flatIndex].id}] không?`)) {
        
        const flatItem = flatOrders[flatIndex];
        const orderIndexToRemove = flatItem._originalOrderIndex;

        // Xóa đơn hàng khỏi danh sách GỐC (master)
        masterOrders.splice(orderIndexToRemove, 1);
        
        // Lưu lại danh sách GỐC
        saveMasterOrders();
        
        // Tải lại toàn bộ
        loadOrders(); 
      }
    });
  }

  // Khởi chạy
  loadOrders();
});