document.addEventListener("DOMContentLoaded", () => {
  // === KEY LƯU TRỮ ===
  // Đảm bảo các key này khớp với tệp script.js của bạn
  
  const CART_STORAGE_KEY = "soiStuCart";
  const USER_STORAGE_KEY = "soi_registered_user";
  const ORDER_HISTORY_KEY = "soi_order_history";

  // THÊM: Biến allProducts (từ tệp products.js đã nạp)
  const allProducts = typeof products !== "undefined" ? products : [];

  // === BIẾN TRANG GIỎ HÀNG ===
  const cartItemsContainer = document.getElementById("cart-items-list");
  const cartTotalPriceEl = document.getElementById("cart-total-price");
  const cartContainer = document.querySelector(".cart-container"); // Toàn bộ main content

  // === BIẾN MODAL ĐẶT HÀNG (MỚI) ===
  const checkoutBtn = document.querySelector(".btn-checkout");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutModalContent = document.querySelector(
    ".checkout-modal-content"
  );
  const cancelCheckoutBtn = document.getElementById("cancelCheckoutBtn");
  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  const defaultAddressDisplay = document.getElementById(
    "defaultAddressDisplay"
  );
  const newAddressInput = document.getElementById("newAddressInput");
  const addressOptions = document.querySelectorAll(
    'input[name="addressOption"]'
  );
  const checkoutTotalPrice = document.getElementById("checkoutTotalPrice");
  const checkoutFinalPrice = document.getElementById("checkoutFinalPrice");

  // =============================================
  //     MỚI: BIẾN CHO THÔNG TIN KH, SP, VÀ QR
  // =============================================
  const checkoutUserName = document.getElementById("checkoutUserName");
  const checkoutUserEmail = document.getElementById("checkoutUserEmail");
  const checkoutProductList = document.getElementById("checkoutProductList");
  const checkoutUserPhone = document.getElementById("checkoutUserPhone");
  const paymentRadioButtons = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const qrBankImage = document.getElementById("qrBankImage");
  const qrMomoImage = document.getElementById("qrMomoImage");
  // =============================================

  // Tải giỏ hàng từ localStorage
  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

  // === HÀM HỖ TRỢ ===
  const formatPrice = (price) => {
    if (isNaN(price)) {
      return "Giá không xác định";
    }
    // Định dạng tiền Việt Nam
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartSummary(); // Cập nhật lại tổng tiền
  }

  // === HÀM XỬ LÝ MODAL ĐẶT HÀNG (MỚI) ===

  /**
   * Hiển thị modal, kiểm tra giỏ hàng và nạp thông tin user
   */
  function showCheckoutModal() {
    // 1. Kiểm tra giỏ hàng có trống không
    if (cart.length === 0) {
      alert(
        "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng."
      );
      return;
    }

    // 2. Lấy thông tin user (để lấy địa chỉ)
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) {
      alert(
        "Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
      return;
    }
    const user = JSON.parse(userJson);

    // =============================================
    //     MỚI: ĐIỀN THÔNG TIN KHÁCH HÀNG
    // =============================================
    if (checkoutUserName)
      checkoutUserName.textContent = `${user.firstName} ${user.lastName}`;
    if (checkoutUserEmail) checkoutUserEmail.textContent = user.email;
    if (checkoutUserPhone) checkoutUserPhone.textContent = user.phone || 'Chưa đăng ký';
    // =============================================

    // 3. Điền địa chỉ mặc định
    if (defaultAddressDisplay) {
      defaultAddressDisplay.textContent =
        user.address || "Chưa có địa chỉ (Vui lòng nhập mới)";
    }

    // =============================================
    //     MỚI: ĐIỀN DANH SÁCH SẢN PHẨM
    // =============================================
    if (checkoutProductList) {
      checkoutProductList.innerHTML = ""; // Xóa list cũ
      cart.forEach((item) => {
        const itemHtml = `
                    <div class="checkout-product-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="details">
                            <div class="name">${item.name}</div>
                            <div class="size-qty">Size: ${item.size} (x${
          item.quantity
        })</div>
                        </div>
                        <div class="price">${formatPrice(
                          item.price * item.quantity
                        )}</div>
                    </div>
                `;
        checkoutProductList.innerHTML += itemHtml;
      });
    }
    // =============================================

    // 4. Điền tóm tắt đơn hàng (lấy tổng tiền từ giỏ hàng)
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (checkoutTotalPrice) checkoutTotalPrice.innerText = formatPrice(total);
    if (checkoutFinalPrice) checkoutFinalPrice.innerText = formatPrice(total); // Giả sử free ship

    // 5. Reset form về mặc định
    document.querySelector(
      'input[name="addressOption"][value="default"]'
    ).checked = true;
    document.querySelector(
      'input[name="paymentMethod"][value="cash"]'
    ).checked = true;
    if (newAddressInput) {
      newAddressInput.style.display = "none";
      newAddressInput.value = ""; // Xóa input cũ
    }

    // =============================================
    //     MỚI: Ẩn tất cả QR khi reset
    // =============================================
    if (qrBankImage) qrBankImage.classList.remove("is-visible");
    if (qrMomoImage) qrMomoImage.classList.remove("is-visible");
    // =============================================

    // 6. Hiển thị modal
    if (checkoutModal) checkoutModal.classList.add("active");
  }

  /**
   * Ẩn modal đặt hàng
   */
  function hideCheckoutModal() {
    if (checkoutModal) checkoutModal.classList.remove("active");
  }

  /**
   * Xử lý khi người dùng xác nhận
   */
  function handleConfirmOrder() {
    // Lấy địa chỉ đã chọn
    const addressChoice = document.querySelector(
    'input[name="addressOption"]:checked'
    ).value;
    let deliveryAddress = "";

    if (addressChoice === "default") {
    deliveryAddress = defaultAddressDisplay.textContent;
    } else {
    deliveryAddress = newAddressInput.value.trim();
    if (deliveryAddress === "") {
        alert("Vui lòng nhập địa chỉ giao hàng mới.");
        return; // Dừng lại nếu chưa nhập
    }
    }

    // Lấy phương thức thanh toán
    const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
    ).value;

    // === BẮT ĐẦU CẬP NHẬT ===

    // 1. Lấy tổng tiền
    const orderTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 2. Tạo đối tượng đơn hàng mới
    const newOrder = {
        id: `SOI-${new Date().getTime()}`, // Tạo ID đơn hàng duy nhất
        date: new Date().toISOString(), // Lưu lại ngày đặt
        items: cart, // Lưu lại toàn bộ giỏ hàng
        total: orderTotal,
        address: deliveryAddress,
        paymentMethod: paymentMethod
    };

    // 3. Tải lịch sử cũ và thêm đơn hàng mới vào (mới nhất ở trên)
    let orderHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)) || [];
    orderHistory.unshift(newOrder);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orderHistory));

    // 4. Xóa giỏ hàng hiện tại
    cart = []; // Xóa mảng
    saveCart(); // Lưu mảng rỗng vào localStorage

    // 5. Thông báo cho người dùng
    alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!

Cảm ơn bạn đã mua hàng tại SỢI! Bạn sẽ được chuyển về trang chủ.`);

    // 6. Ẩn modal và chuyển hướng về trang chủ
    hideCheckoutModal();
    window.location.href = 'index.html';

    // === KẾT THÚC CẬP NHẬT ===
}

  // === HÀM TRANG GIỎ HÀNG ===

  // Cập nhật tổng tiền
  function updateCartSummary() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (cartTotalPriceEl) {
      cartTotalPriceEl.innerText = formatPrice(total);
    }
  }

  // Xóa một mục khỏi giỏ hàng
  function removeItemFromCart(index) {
    const item = cart[index];
    if (!item) return;

    if (
      confirm(
        `Bạn có chắc muốn xóa "${item.name} - Size ${item.size}" khỏi giỏ hàng?`
      )
    ) {
      cart.splice(index, 1); // Xóa 1 mục tại vị trí index
      saveCart(); // Lưu lại giỏ hàng mới
      renderCartItems(); // Vẽ lại giỏ hàng

      // THÊM: Gắn lại sự kiện sau khi render
      // (Vì renderCartItems không còn tự gọi nó nữa)
      setupCartActions();
    }
  }

  // "Vẽ" các sản phẩm ra HTML
  // (THAY THẾ TOÀN BỘ HÀM NÀY)
  function renderCartItems() {
    if (!cartItemsContainer) {
      console.error("Lỗi: Không tìm thấy 'cart-items-list'.");
      return;
    }

    // 1. Xóa nội dung cũ
    cartItemsContainer.innerHTML = "";

    // 2. Kiểm tra giỏ hàng rỗng
    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p style="text-align: center; padding: 30px; font-size: 1.1rem; color: #555;">Giỏ hàng của bạn đang trống.</p>';
      updateCartSummary(); // Cập nhật tổng tiền về 0
      return;
    }

    // 3. Lặp và tạo HTML cho từng sản phẩm
    cart.forEach((item, index) => {
      const itemPriceValue = parseFloat(item.price || 0);
      const itemQuantity = parseInt(item.quantity || 1);

      // Lấy thông tin đầy đủ của sản phẩm từ allProducts
      const productInfo = allProducts.find((p) => p.id == item.id); // Dùng == để an toàn
      // Lấy size, fallback về size hiện tại nếu không tìm thấy product (dù hiếm)
      const availableSizes = productInfo ? productInfo.size : [item.size];

      // Tạo HTML cho các nút chọn size
      let sizeOptionsHTML = "";
      availableSizes.forEach((s) => {
        sizeOptionsHTML += `<span class="edit-size-option ${
          s === item.size ? "active" : ""
        }" data-size="${s}">${s}</span>`;
      });

      const itemHtml = `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-view">
                        <div class="item-image-container">
                            <img class="item-image" src="${item.image}" alt="${
        item.name
      }">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">${item.name}</h3>
                            <p class="item-size">Size: ${item.size}</p>
                        </div>
                        <div class="item-slide-wrapper">
                            <div class="item-pricing">
                                <p class="item-price">${formatPrice(
                                  itemPriceValue
                                )}</p> 
                                <p class="item-quantity">Số Lượng: <strong>${itemQuantity}</strong></p>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-edit"><span>Sửa</span></button>
                            <button class="btn-delete"><span>Hủy</span></button>
                        </div>
                    </div>

                    <div class="item-edit-form">
                        <div class="form-group">
                            <label>Chọn Size:</label>
                            <div class="edit-size-selector">
                                ${sizeOptionsHTML}
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Số lượng:</label>
                            <div class="edit-quantity-selector">
                                <button class="qty-btn" data-action="decrease">-</button>
                                <input type="number" class="qty-input" value="${itemQuantity}" min="1">
                                <button class="qty-btn" data-action="increase">+</button>
                            </div>
                        </div>
                        <div class="edit-actions">
                            <button class="btn-save">Lưu</button>
                            <button class="btn-cancel">Đóng</button>
                        </div>
                    </div>
                </div>
            `;
      cartItemsContainer.innerHTML += itemHtml;
    });

    // 4. Cập nhật tổng tiền
    updateCartSummary();

    // 5. Bỏ addEventListenersToCartItems() ở đây
    // (Sẽ gọi ở ngoài sau khi render)
  }

  // Gắn sự kiện cho các nút Xóa/Sửa
  // (THAY THẾ TOÀN BỘ HÀM addEventListenersToCartItems BẰNG HÀM NÀY)
  function setupCartActions() {
    if (!cartItemsContainer) return;

    // Xóa listener cũ (nếu có) để tránh gắn nhiều lần
    // Bằng cách thay thế node
    const newContainer = cartItemsContainer.cloneNode(true); // Sao chép
    cartItemsContainer.parentNode.replaceChild(
      newContainer,
      cartItemsContainer
    ); // Thay thế

    // Cập nhật lại biến tham chiếu sau khi thay thế
    const activeCartItemsContainer = document.getElementById("cart-items-list");

    activeCartItemsContainer.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      if (!cartItem) return;

      // Lấy index và dữ liệu
      const index = parseInt(cartItem.dataset.index);
      if (isNaN(index)) return; // Thoát nếu không phải index

      const itemData = cart[index];
      if (!itemData) return;

      // --- XỬ LÝ NÚT SỬA ---
      if (e.target.closest(".btn-edit")) {
        // Đóng tất cả các item khác đang sửa
        document.querySelectorAll(".cart-item.is-editing").forEach((item) => {
          if (item !== cartItem) {
            item.classList.remove("is-editing");
          }
        });
        // Mở item này
        cartItem.classList.add("is-editing");
      }

      // --- XỬ LÝ NÚT ĐÓNG (TRONG FORM SỬA) ---
      if (e.target.closest(".btn-cancel")) {
        cartItem.classList.remove("is-editing");
        // Reset form về giá trị ban đầu
        const editForm = cartItem.querySelector(".item-edit-form");
        editForm.querySelector(".qty-input").value = itemData.quantity;
        editForm.querySelectorAll(".edit-size-option").forEach((opt) => {
          opt.classList.toggle("active", opt.dataset.size === itemData.size);
        });
      }

      // --- XỬ LÝ NÚT LƯU (TRONG FORM SỬA) ---
      if (e.target.closest(".btn-save")) {
        const editForm = cartItem.querySelector(".item-edit-form");

        const newQty = parseInt(editForm.querySelector(".qty-input").value);
        const newSizeEl = editForm.querySelector(".edit-size-option.active");

        if (newQty < 1) {
          alert("Số lượng phải lớn hơn 0");
          return;
        }

        if (!newSizeEl) {
          alert("Vui lòng chọn size!");
          return;
        }
        const newSize = newSizeEl.dataset.size;

        // Cập nhật mảng cart
        cart[index].quantity = newQty;
        cart[index].size = newSize;

        // Lưu vào localStorage
        saveCart();

        // Cập nhật giao diện (phần xem)
        const view = cartItem.querySelector(".cart-item-view");
        view.querySelector(".item-size").innerText = `Size: ${newSize}`;
        view.querySelector(".item-quantity strong").innerText = newQty;

        // Đóng form
        cartItem.classList.remove("is-editing");
      }

      // --- XỬ LÝ NÚT HỦY (XÓA) ---
      if (e.target.closest(".btn-delete")) {
        // Hàm removeItemFromCart đã bao gồm renderCartItems và saveCart
        removeItemFromCart(index);
      }

      // --- XỬ LÝ CHỌN SIZE (TRONG FORM SỬA) ---
      if (e.target.closest(".edit-size-option")) {
        const selectedSizeEl = e.target.closest(".edit-size-option");
        // Xóa active ở các nút khác
        cartItem
          .querySelectorAll(".edit-size-option")
          .forEach((opt) => opt.classList.remove("active"));
        // Thêm active cho nút được chọn
        selectedSizeEl.classList.add("active");
      }

      // --- XỬ LÝ +/- (TRONG FORM SỬA) ---
      if (e.target.closest(".qty-btn")) {
        const btn = e.target.closest(".qty-btn");
        const action = btn.dataset.action;
        const input = cartItem.querySelector(".qty-input");
        let currentValue = parseInt(input.value);

        if (action === "increase") {
          input.value = currentValue + 1;
        } else if (action === "decrease" && currentValue > 1) {
          input.value = currentValue - 1;
        }
      }
    });
  }

  // === KHỞI CHẠY ===

  // 1. Kiểm tra đăng nhập (Logic "gác cổng")
  if (!localStorage.getItem(USER_STORAGE_KEY)) {
    alert("Vui lòng đăng nhập để xem giỏ hàng");
    window.location.href = "user.html";
    return; // Dừng thực thi nếu chưa đăng nhập
  }

  // 2. Nếu đã đăng nhập, hiển thị giỏ hàng
  renderCartItems();

  // 3. THAY ĐỔI: Gọi hàm setupCartActions mới
  setupCartActions();

  // 4. [MỚI] GẮN SỰ KIỆN CHO CHECKOUT
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Ngăn nút submit form (nếu có)
      showCheckoutModal();
    });
  }
  if (cancelCheckoutBtn) {
    cancelCheckoutBtn.addEventListener("click", hideCheckoutModal);
  }
  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", handleConfirmOrder);
  }

  // 5. [MỚI] Gắn sự kiện cho radio button địa chỉ
  if (addressOptions) {
    addressOptions.forEach((radio) => {
      radio.addEventListener("change", () => {
        // Nếu chọn "new", thì hiện ô input. Nếu không thì ẩn.
        if (radio.value === "new") {
          if (newAddressInput) newAddressInput.style.display = "block";
        } else {
          if (newAddressInput) newAddressInput.style.display = "none";
        }
      });
    });
  }

  // 6. [MỚI] Xử lý click đóng modal

  // Ngăn click vào content modal làm đóng modal
  if (checkoutModalContent) {
    checkoutModalContent.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện nổi bọt lên .modal-overlay
    });
  }
  // Cho phép click ra ngoài (click vào .modal-overlay) để đóng
  if (checkoutModal) {
    checkoutModal.addEventListener("click", hideCheckoutModal);
  }

  // =============================================
  //     MỚI: GẮN SỰ KIỆN CHO RADIO THANH TOÁN
  // =============================================
  if (paymentRadioButtons.length > 0 && qrBankImage && qrMomoImage) {
    paymentRadioButtons.forEach((radio) => {
      radio.addEventListener("change", () => {
        // Lấy giá trị của radio đang được chọn
        const selectedValue = document.querySelector(
          'input[name="paymentMethod"]:checked'
        ).value;

        // Ẩn tất cả QR trước
        qrBankImage.classList.remove("is-visible");
        qrMomoImage.classList.remove("is-visible");

        // Hiển thị QR tương ứng
        if (selectedValue === "transfer") {
          qrBankImage.classList.add("is-visible");
        } else if (selectedValue === "online") {
          qrMomoImage.classList.add("is-visible");
        }
        // Nếu là 'cash', không làm gì cả (vì đã ẩn hết ở trên)
      });
    });
  }
  // =============================================
});
