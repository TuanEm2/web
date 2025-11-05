// ======================
// ADMIN - REVENUE DASHBOARD
// ======================
document.addEventListener("DOMContentLoaded", function () {
  const totalRevenueEl = document.getElementById("totalRevenue");
  const totalProductsEl = document.getElementById("totalProducts");
  const salesTableBody = document.querySelector("#salesTable tbody");
  const emptyNotice = document.getElementById("emptyNotice");

  const MASTER_ORDER_KEY = "soi_order_history";

  // ======================
  // Helper functions
  // ======================

  function formatVN(num) {
    return num.toLocaleString("vi-VN") + " ₫";
  }

  function formatISODateToVN(isoString) {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString("vi-VN");
    } catch (e) {
      return "Invalid Date";
    }
  }

  // ======================
  // MAIN RENDER FUNCTION
  // ======================
  function renderRevenue() {
    const saved = localStorage.getItem(MASTER_ORDER_KEY);
    if (!saved) {
      totalRevenueEl.textContent = "0 ₫";
      totalProductsEl.textContent = "0";
      emptyNotice.style.display = "block";
      return;
    }

    const masterOrders = JSON.parse(saved);
    let totalRevenue = 0;         // Thực tế (chỉ đơn đã giao)
    let expectedRevenue = 0;      // Dự kiến (đã giao + đang xử lý)
    let totalProducts = 0;
    let deliveredRows = [];

    masterOrders.forEach(order => {
      if (!order.items) return;
      const status = order.status || "processing";

      order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;

        if (status === "delivered") {
          totalRevenue += itemTotal;
          expectedRevenue += itemTotal;
          totalProducts += item.quantity;
          deliveredRows.push({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: itemTotal,
            date: order.date
          });
        } else if (status === "processing") {
          expectedRevenue += itemTotal;
        }
      });
    });

    // Cập nhật DOM
    totalRevenueEl.textContent = formatVN(totalRevenue);
    totalProductsEl.textContent = totalProducts.toString();

    // Render bảng bán hàng (chỉ các đơn đã giao)
    salesTableBody.innerHTML = "";

    if (deliveredRows.length === 0) {
      emptyNotice.style.display = "block";
    } else {
      emptyNotice.style.display = "none";
      deliveredRows.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><img src="${row.image || 'assets/images/default.png'}" alt="SP"></td>
          <td>${row.name}</td>
          <td>${row.price.toLocaleString("vi-VN")} đ</td>
          <td>${row.quantity}</td>
          <td>${row.total.toLocaleString("vi-VN")} đ</td>
          <td>${formatISODateToVN(row.date)}</td>
        `;
        salesTableBody.appendChild(tr);
      });
    }

    // Hiển thị doanh thu dự kiến (thêm ở góc trên hoặc console)
    console.log("💰 Doanh thu thực tế:", totalRevenue);
    console.log("📈 Doanh thu dự kiến:", expectedRevenue);
  }

  // ======================
  // Khởi chạy
  // ======================
  renderRevenue();
});
