// Đảm bảo rằng KEY lưu trữ thông tin người dùng phải trùng với key trong index-users.js
const USER_STORAGE_KEY = 'soi_registered_user'; 



/**
 * Hiển thị Modal thông tin người dùng và nạp dữ liệu từ localStorage
 */
function showUserInfoModal(event) {
    if (event) {
        // Ngăn chặn chuyển hướng đến #
        event.preventDefault(); 
        
        // --- CẬP NHẬT: Đóng menu bằng cách xóa inline styles ---
        const menu = document.querySelector('.user-item-menu');
        if (menu) {
            // Xóa các thuộc tính style đã được thiết lập inline
            // Điều này cho phép quy tắc CSS :hover hoạt động trở lại
            menu.removeAttribute('style'); 
        }
        // --------------------------------------------------------
    }

    const modal = document.getElementById('userInfoModal');
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    
    // Lấy thông tin người dùng từ localStorage 
    if (userJson) {
        const user = JSON.parse(userJson);

        // Nạp dữ liệu vào modal
        document.querySelector('#modalFirstName .value').textContent = user.firstName || 'N/A';
        document.querySelector('#modalLastName .value').textContent = user.lastName || 'N/A';
        document.querySelector('#modalEmail .value').textContent = user.email || 'N/A';
        document.querySelector('#modalAddress .value').textContent = user.address || 'Chưa đăng ký';
        document.querySelector('#modalPhone .value').textContent = user.phone || 'Chưa đăng ký'; 
        
        // Hiển thị modal
        if(modal) modal.classList.add('active');

    } else {
        alert("❌ Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin tài khoản.");
        // Chuyển hướng đến trang đăng nhập
        window.location.href = "user.html"; 
    }
}

/**
 * Ẩn Modal
 */
function hideModal() {
    const modal = document.getElementById('userInfoModal');
    if(modal) modal.classList.remove('active');
}

/**
 * Ẩn Modal khi click ra ngoài lớp phủ (nhưng không phải là modal-content)
 */
function closeModal(event) {
    // Kiểm tra xem liệu phần tử được click có phải là chính modal-overlay
    if (event.target === document.getElementById('userInfoModal')) {
        hideModal();
    }
}

/**
 * === HÀM XỬ LÝ ĐĂNG XUẤT ===
 * (Dành cho trang index.html)
 */
function handleLogout(event) {
    if (event) event.preventDefault();

    // === BẮT ĐẦU CẬP NHẬT ===
    // Định nghĩa các Key lưu trữ (PHẢI KHỚP với các tệp js khác)
    const CART_STORAGE_KEY = 'soiStuCart';
    const ORDER_HISTORY_KEY = 'soi_order_history';
    // USER_STORAGE_KEY đã được định nghĩa ở đầu tệp

    // Hiển thị thông báo xác nhận
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        // 1. Xóa thông tin người dùng
        localStorage.removeItem(USER_STORAGE_KEY);
        
        // 2. Xóa giỏ hàng
        localStorage.removeItem(CART_STORAGE_KEY);
        
        // 3. Xóa lịch sử đơn hàng
        localStorage.removeItem(ORDER_HISTORY_KEY);
        
        // 4. Chuyển hướng về trang index
        window.location.href = 'index.html';
    }
    // === KẾT THÚC CẬP NHẬT ===
}
 
/**
 * === KHỞI CHẠY KHI TẢI TRANG ===
 * (Đây là phần quan trọng đã được cập nhật)
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    // Lấy các mục menu
    const menuInfo = document.getElementById('menuInfo');
    const menuOrders = document.getElementById('menuOrders');
    const menuLogout = document.getElementById('menuLogout');
    const menuLogin = document.getElementById('menuLogin');
    const menuRegister = document.getElementById('menuRegister');
    
    // 1. KIỂM TRA ĐĂNG NHẬP VÀ CẬP NHẬT HEADER/MENU
    if (userJson && userNameDisplay) {
        // ĐÃ ĐĂNG NHẬP
        const user = JSON.parse(userJson);
        userNameDisplay.textContent = user.firstName ? user.firstName : 'Tài khoản';
        
        // Hiển thị menu đã đăng nhập
        if (menuInfo) menuInfo.style.display = 'block';
        if (menuOrders) menuOrders.style.display = 'block';
        if (menuLogout) menuLogout.style.display = 'block';
        
        // Ẩn menu chưa đăng nhập
        if (menuLogin) menuLogin.style.display = 'none';
        if (menuRegister) menuRegister.style.display = 'none';
        
    } else if (userNameDisplay) {
        // CHƯA ĐĂNG NHẬP
        userNameDisplay.textContent = 'Tài khoản';
        
        // Ẩn menu đã đăng nhập
        if (menuInfo) menuInfo.style.display = 'none';
        if (menuOrders) menuOrders.style.display = 'none';
        if (menuLogout) menuLogout.style.display = 'none';
        
        // Hiển thị menu chưa đăng nhập (đã đặt mặc định là 'block' trong HTML, nhưng an toàn hơn cứ để JS)
        if (menuLogin) menuLogin.style.display = 'block';
        if (menuRegister) menuRegister.style.display = 'block';
    }

    // 2. LOGIC KIỂM TRA GIỎ HÀNG KHI CLICK
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
        cartLink.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chuyển trang ngay lập tức
            
            // Kiểm tra xem đã đăng nhập chưa
            const userIsLoggedIn = localStorage.getItem(USER_STORAGE_KEY);
            
            if (userIsLoggedIn) {
                // Đã đăng nhập, cho phép sang trang giỏ hàng
                window.location.href = 'cart.html';
            } else {
                // Chưa đăng nhập, thông báo và chuyển sang trang user
                alert('Vui lòng đăng nhập để xem giỏ hàng');
                window.location.href = 'user.html';
            }
        });
    }

    // 3. LOGIC CHO MENU THẢ XUỐNG (HOVER)
    const userItem = document.getElementById('userAccountItem');
    const userMenu = document.getElementById('userItemMenu');
    if (userItem && userMenu) {
        userItem.addEventListener('mouseenter', () => {
            userMenu.style.display = 'flex'; 
        });
        userItem.addEventListener('mouseleave', () => {
            userMenu.style.display = 'none';
        });

        // Xử lý khi click vào menu item (để đóng menu lại)
        userMenu.addEventListener('click', (e) => {
             if(e.target.tagName === 'A'){
                 userMenu.style.display = 'none';
             }
        });
    }
});

/* =================================
  LOGIC CHO MODAL LỊCH SỬ ĐƠN HÀNG
================================= */

// Key để đọc lịch sử (PHẢI GIỐNG key trong cart.js)
const ORDER_HISTORY_KEY = "soi_order_history";

// === HÀM HỖ TRỢ (Copy từ cart.js) ===
const formatPrice = (price) => {
    if (isNaN(price)) {
        return "Giá không xác định";
    }
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

const formatDate = (dateString) => {
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('vi-VN', options);
};

/**
 * Hiển thị Modal Lịch sử đơn hàng
 */
function showOrderHistoryModal(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation(); // Ngăn modal tự đóng
    }

    // Tải và render nội dung
    renderOrderHistory();

    // Hiển thị modal
    const modal = document.getElementById('orderHistoryModal');
    if (modal) modal.classList.add('active');

    // Đóng menu dropdown (vì đã click)
    const menu = document.getElementById('userItemMenu');
    if (menu) menu.style.display = 'none';
}

/**
 * Ẩn Modal Lịch sử đơn hàng
 */
function hideOrderHistoryModal() {
    const modal = document.getElementById('orderHistoryModal');
    if (modal) modal.classList.remove('active');
}

/**
 * Ẩn Modal Lịch sử khi click ra ngoài
 */
function closeOrderHistoryModal(event) {
    // Chỉ đóng khi click vào chính lớp phủ (modal-overlay)
    if (event.target === document.getElementById('orderHistoryModal')) {
        hideOrderHistoryModal();
    }
}

/**
 * Tải dữ liệu từ localStorage và render vào modal
 */
function renderOrderHistory() {
    const container = document.getElementById("order-list-content");
    if (!container) return;

    // Tải lịch sử
    const orderHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)) || [];

    // 1. Kiểm tra nếu không có đơn hàng
    if (orderHistory.length === 0) {
        container.innerHTML = '<p class="empty-history">Bạn chưa có đơn hàng nào.</p>';
        return;
    }

    // 2. Xóa nội dung cũ và lặp để render
    container.innerHTML = "";
    
    orderHistory.forEach(order => {
        // Render danh sách sản phẩm cho từng đơn hàng
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-product-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-product-details">
                        <div class="name">${item.name}</div>
                        <div class="size-qty">Size: ${item.size} (x${item.quantity})</div>
                    </div>
                    <div class="order-product-price">${formatPrice(item.price * item.quantity)}</div>
                </div>
            `;
        });

        // Render toàn bộ khung đơn hàng
        const orderHtml = `
            <div class="order-item">
                <div class="order-header">
                    <h3>Mã đơn: <span>${order.id}</span></h3>
                    <div class="order-total">${formatPrice(order.total)}</div>
                </div>
                <div class="order-details">
                    <p><strong>Ngày đặt:</strong> ${formatDate(order.date)}</p>
                    <p><strong>Địa chỉ giao:</strong> ${order.address}</p>
                    <p><strong>Thanh toán:</strong> ${order.paymentMethod}</p>
                </div>
                <div class="order-items-list">
                    <h4>Sản phẩm đã mua:</h4>
                    ${itemsHtml}
                </div>
            </div>
        `;
        
        container.innerHTML += orderHtml;
    });
}