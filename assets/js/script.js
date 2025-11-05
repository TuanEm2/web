document.addEventListener('DOMContentLoaded', () => {

    // === KEY ĐĂNG NHẬP & LƯU TRỮ ===
    const USER_STORAGE_KEY = 'soi_registered_user';
    const CART_STORAGE_KEY = 'soiStuCart';
    const SEARCH_HISTORY_KEY = 'soi_search_history'; 

    // === BIẾN TOÀN CỤC ===

    // Sản phẩm & Phân trang
    const productListContainer = document.querySelector('.product-list');
    const paginationUl = document.querySelector('.paganigation-ul');
    const noProductMessage = document.querySelector('.no-product-search');

    // MỚI: Tách biệt allProducts (dữ liệu gốc) và currentProducts (dữ liệu hiển thị)
    const allProducts = (typeof products !== 'undefined') ? products : [];
    let currentProducts = allProducts; 
    let currentPage = 1;
    const productsPerPage = 8;

    // Lọc (Filter)
    const filterButton = document.querySelector('.filter');
    const searchFilterBox = document.getElementById('search-filter-box'); // MỚI: Dùng box dropdown
    const filterOptions = document.querySelectorAll('.filter-option-label'); // Vẫn dùng
    
    // MỚI: Nút apply bây giờ nằm trong searchFilterBox
    const applyFilterButton = searchFilterBox ? searchFilterBox.querySelector('.btn-apply-filter') : null; 
    
    // Các checkbox vẫn tìm trên toàn trang
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    const categoryBarButtons = {
        all: document.querySelector('.btn-all'),
        jackets: document.querySelector('.btn-jackets'),
        tshirts: document.querySelector('.btn-tshirts'),
        polos: document.querySelector('.btn-polos'),
        shirts: document.querySelector('.btn-shirts')
    };

    // Modal Chi tiết sản phẩm
    const productModal = document.getElementById('product-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');

    // Giỏ hàng
    const addToCartButton = productModal ? productModal.querySelector('.btn-add-to-cart') : null;
    const quantityInput = productModal ? productModal.querySelector('.quantity-input') : null;
    const minusBtn = productModal ? productModal.querySelector('.quantity-btn[data-action="decrease"]') : null;
    const plusBtn = productModal ? productModal.querySelector('.quantity-btn[data-action="increase"]') : null;
    const cartCountBadge = document.querySelector('.cart-count'); // MỚI: Biến cho số lượng cart

    let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    let currentModalProductId = null;

    // Modal Cảnh báo
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const alertCloseBtn = document.getElementById('alert-close-btn');

    // === BIẾN TÌM KIẾM ===
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions-box');
    const historyContainer = document.getElementById('search-history-container');
    const historyList = document.getElementById('search-history-list');
    const suggestionContainer = document.getElementById('search-suggestion-container');
    const suggestionList = document.getElementById('search-suggestion-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    let searchHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];


    // === HÀM HỖ TRỢ ===

    const formatPrice = (price) => {
        if (isNaN(price)) { return "Giá không xác định"; }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    function showAlert(message) {
        if (alertMessage) alertMessage.innerText = message;
        if (alertModal) alertModal.style.display = 'block';
        if (modalOverlay) modalOverlay.style.display = 'block';
    }

    function hideAlert() {
        if (alertModal) alertModal.style.display = 'none';
        // CẬP NHẬT: Kiểm tra cả productModal
        if (productModal && productModal.style.display !== 'block') {
             if (modalOverlay) modalOverlay.style.display = 'none';
        }
    }
    if (alertCloseBtn) alertCloseBtn.addEventListener('click', hideAlert);


    // === HÀM GIỎ HÀNG ===

    function updateCartCount() {
        if (!cartCountBadge) return; // Thoát nếu không tìm thấy
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountBadge.innerText = totalItems;
        // CẬP NHẬT: Dùng class 'hidden' thay vì 'display'
        if (totalItems > 0) {
            cartCountBadge.classList.remove('hidden');
        } else {
            cartCountBadge.classList.add('hidden');
        }
    }

    function saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }

    function setupQuantitySelector() {
        if (!minusBtn || !plusBtn || !quantityInput) return;
        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) { quantityInput.value = currentValue - 1; }
        });
        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) { this.value = 1; }
        });
    }

    function handleAddToCart() {
        if (!localStorage.getItem(USER_STORAGE_KEY)) {
            showAlert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }
        const productId = currentModalProductId;
        if (!productId) return;
        const quantity = parseInt(quantityInput.value);
        const selectedSizeEl = productModal.querySelector('.size-option.active');
        if (!selectedSizeEl) {
            showAlert('Vui lòng chọn size');
            return;
        }
        const size = selectedSizeEl.innerText;
        // CẬP NHẬT: Tìm sản phẩm từ allProducts
        const product = allProducts.find(p => p.id == productId); 
        if (!product) {
            showAlert('Lỗi: Không tìm thấy sản phẩm.');
            return;
        }
        
        const existingItem = cart.find(item => item.id == productId && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id, name: product.name, price: product.price,
                image: product.image, size: size, quantity: quantity
            });
        }
        saveCart();
        updateCartCount();
        closeAllModals();
        showAlert(`Đã thêm ${quantity} x ${product.name} (Size ${size}) vào giỏ hàng!`);
    }


    // === HÀM RENDER & LỌC ===

    // CẬP NHẬT: Hàm render bây giờ nhận productsToShow
    function renderProducts(page, productsToShow) { 
        if (!productListContainer || !noProductMessage) return;
        
        productListContainer.innerHTML = '';
        noProductMessage.classList.add('hidden');

        if (productsToShow.length === 0) {
            noProductMessage.classList.remove('hidden');
            if (paginationUl) paginationUl.style.display = 'none';
            return;
        }
        
        productListContainer.style.display = 'grid'; // Đảm bảo grid được bật lại
        if (paginationUl) paginationUl.style.display = 'flex'; // Bật lại phân trang

        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsForThisPage = productsToShow.slice(startIndex, endIndex);

        productsForThisPage.forEach(product => {
            const productHTML = `
                <div class="product-item" data-product-id="${product.id}" data-category="${product.category}">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${formatPrice(product.price)}</p>
                    </div>
                </div>
            `;
            productListContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    // CẬP NHẬT: Hàm phân trang nhận productsToPaginate
    function setupPagination(productsToPaginate) { 
        if (!paginationUl) return;
        paginationUl.innerHTML = '';
        const pageCount = Math.ceil(productsToPaginate.length / productsPerPage);

        if (pageCount <= 1) {
            paginationUl.style.display = 'none';
            return;
        }
        paginationUl.style.display = 'flex';
        
        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#'; a.innerText = i; a.dataset.page = i;
            if (i === currentPage) a.classList.add('active');
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(e.target.dataset.page);
                // CẬP NHẬT: Render dựa trên currentProducts
                renderProducts(currentPage, currentProducts); 
                
                paginationUl.querySelector('a.active')?.classList.remove('active');
                e.target.classList.add('active');
                if (productListContainer) productListContainer.scrollIntoView({ behavior: 'smooth' });
            });
            li.appendChild(a);
            paginationUl.appendChild(li);
        }
    }

    function filterAndRenderProducts() {
        const selectedCategories = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        const selectedSizes = Array.from(sizeCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        
        // CẬP NHẬT: Luôn lọc từ allProducts
        let filteredProducts = allProducts; 

        if (selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
        }
        if (selectedSizes.length > 0) {
            filteredProducts = filteredProducts.filter(product => product.size && product.size.some(size => selectedSizes.includes(size)));
        }
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
        
        currentProducts = filteredProducts; // Cập nhật danh sách hiện tại
        currentPage = 1;
        renderProducts(currentPage, currentProducts);
        setupPagination(currentProducts);
    }

    function setupCategoryBar() {
        function resetAllFilters() {
            categoryCheckboxes.forEach(cb => cb.checked = false);
            sizeCheckboxes.forEach(cb => cb.checked = false);
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            if (searchInput) searchInput.value = ''; // CẬP NHẬT: Xóa cả thanh tìm kiếm
        }

        function handleCategoryClick(e, categoryValue) {
            e.preventDefault();
            resetAllFilters(); // Reset filter và search

            // Lọc trực tiếp từ allProducts
            if (categoryValue === 'All') {
                currentProducts = allProducts;
            } else {
                currentProducts = allProducts.filter(
                    p => p.category.toLowerCase() === categoryValue.toLowerCase()
                );
            }

            currentPage = 1;
            renderProducts(currentPage, currentProducts);
            setupPagination(currentProducts);
            
            // CẬP NHẬT: Xử lý active class
            document.querySelectorAll('.category-bar ul li a').forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
        }

        if(categoryBarButtons.all) categoryBarButtons.all.addEventListener('click', (e) => handleCategoryClick(e, 'All'));
        if(categoryBarButtons.jackets) categoryBarButtons.jackets.addEventListener('click', (e) => handleCategoryClick(e, 'Jackets'));
        if(categoryBarButtons.tshirts) categoryBarButtons.tshirts.addEventListener('click', (e) => handleCategoryClick(e, 'T-Shirts'));
        if(categoryBarButtons.polos) categoryBarButtons.polos.addEventListener('click', (e) => handleCategoryClick(e, 'Polo'));
        if(categoryBarButtons.shirts) categoryBarButtons.shirts.addEventListener('click', (e) => handleCategoryClick(e, 'Shirts'));
        
        // Mặc định active 'Shop All'
        // (Đã thêm class 'active' vào HTML, nên dòng này không cần nữa, nhưng để cũng không sao)
        // if(categoryBarButtons.all) categoryBarButtons.all.classList.add('active');
    }

    // === HÀM FILTER MODAL (ĐÃ CẬP NHẬT) ===
    function setupFilterInteractions() {
        // 1. Logic Mở/Đóng Filter Dropdown
        if (filterButton && searchFilterBox) {
            filterButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Ngăn click lan ra document
                // Toggle hộp filter
                searchFilterBox.classList.toggle('hidden');
                // LUÔN LUÔN ẩn hộp gợi ý khi mở filter
                if (suggestionsBox) suggestionsBox.classList.add('hidden'); 
            });
        }

        // 2. Logic Nút Apply (bên trong dropdown)
        if (applyFilterButton) {
            applyFilterButton.addEventListener('click', function() {
                // Ẩn hộp filter đi
                if (searchFilterBox) searchFilterBox.classList.add('hidden');
                // Vẫn gọi hàm filter như cũ
                filterAndRenderProducts(); 
            });
        }

        // 3. Logic Highlight (Giữ nguyên)
        filterOptions.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (!checkbox) return;
            const updateSelectedClass = () => {
                if (checkbox.checked) {
                    label.classList.add('selected');
                } else {
                    label.classList.remove('selected');
                }
            };
            updateSelectedClass();
            checkbox.addEventListener('change', updateSelectedClass);
        });
    }

    // === HÀM MODAL (Đã gộp và cập nhật) ===

    function openProductModal(productId) {
        if (!productModal) return;
        // CẬP NHẬT: Tìm từ allProducts
        const product = allProducts.find(p => p.id == productId); 
        if (!product) return;
        
        currentModalProductId = product.id;
        if (quantityInput) quantityInput.value = 1;
        if (modalImage) modalImage.src = product.image;
        if (modalName) modalName.innerText = product.name;
        if (modalPrice) modalPrice.innerText = formatPrice(product.price);
        
        const sizeSelector = productModal.querySelector('.size-selector');
        if (sizeSelector) {
            sizeSelector.innerHTML = '';
            if (product.size && product.size.length > 0) {
                product.size.forEach(size => {
                    const sizeSpan = document.createElement('span');
                    sizeSpan.classList.add('size-option');
                    sizeSpan.innerText = size;
                    sizeSpan.addEventListener('click', () => {
                        sizeSelector.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
                        sizeSpan.classList.add('active');
                    });
                    sizeSelector.appendChild(sizeSpan);
                });
            } else {
                sizeSelector.innerText = "Không có tùy chọn size";
            }
        }
        productModal.style.display = 'block';
        if (modalOverlay) modalOverlay.style.display = 'block';
    }

    // CẬP NHẬT: Thêm searchFilterBox vào hàm đóng
    function closeAllModals() {
        if (productModal) productModal.style.display = 'none';
        if (searchFilterBox) searchFilterBox.classList.add('hidden'); // MỚI
        hideAlert(); // Đóng cả alert
        if (modalOverlay) modalOverlay.style.display = 'none'; 
        currentModalProductId = null;
    }

    // === CÁC HÀM TÌM KIẾM (Đã cập nhật) ===

    function saveSearchHistory() {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    }

    function addSearchTerm(term) {
        const cleanedTerm = term.trim().toLowerCase();
        if (cleanedTerm === '') return;
        // Lọc bỏ
        searchHistory = searchHistory.filter(item => item.toLowerCase() !== cleanedTerm);
        // Thêm vào đầu
        searchHistory.unshift(cleanedTerm);
        // Giới hạn 10
        searchHistory = searchHistory.slice(0, 10);
        saveSearchHistory();
    }

    function renderSearchHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        
        if (searchHistory.length === 0) {
            historyList.innerHTML = '<li class="no-history">Không có lịch sử tìm kiếm.</li>';
            if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
            return;
        }
        
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'inline-block';
        searchHistory.forEach(term => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> <span>${term}</span>`; // Thêm icon
            li.addEventListener('click', () => {
                searchInput.value = term;
                performSearch(term);
            });
            historyList.appendChild(li);
        });
    }

    function renderSuggestions(searchTerm) {
        if (!suggestionList) return;
        suggestionList.innerHTML = '';
        if (searchTerm === '') return;

        // Lọc từ allProducts
        const matchedProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5); // Giới hạn 5
        
        if (matchedProducts.length === 0) {
             suggestionList.innerHTML = '<li>Không tìm thấy sản phẩm.</li>';
             return;
        }

        matchedProducts.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <span>${product.name}</span>
            `;
            li.addEventListener('click', () => {
                searchInput.value = product.name; // Cập nhật input
                performSearch(product.name); // Tìm kiếm luôn
            });
            suggestionList.appendChild(li);
        });
    }

    function performSearch(searchTerm) {
        const cleanedTerm = searchTerm.trim().toLowerCase();
        
        if (cleanedTerm === '') {
            currentProducts = allProducts; // Reset về all
        } else {
            // Tìm kiếm từ allProducts
            currentProducts = allProducts.filter(p => p.name.toLowerCase().includes(cleanedTerm));
            addSearchTerm(searchTerm.trim()); // Chỉ lưu khi tìm kiếm (không phải lúc reset)
        }

        currentPage = 1;
        renderProducts(currentPage, currentProducts);
        setupPagination(currentProducts);
        hideSuggestionsBox();
        searchInput.blur(); // Mất focus khỏi ô search
        
        // CẬP NHẬT: Bỏ active category bar
        document.querySelectorAll('.category-bar ul li a').forEach(a => a.classList.remove('active'));
    }

    function showSuggestionsBox(mode) {
        if (!suggestionsBox || !historyContainer || !suggestionContainer) return;
        
        // MỚI: Luôn ẩn hộp filter khi hiển thị hộp gợi ý
        if (searchFilterBox) searchFilterBox.classList.add('hidden'); 

        if (mode === 'history') {
            renderSearchHistory();
            historyContainer.classList.remove('hidden');
            suggestionContainer.classList.add('hidden');
        } else { // mode === 'suggestions'
            historyContainer.classList.add('hidden');
            suggestionContainer.classList.remove('hidden');
        }
        suggestionsBox.classList.remove('hidden');
    }

    function hideSuggestionsBox() {
        if (suggestionsBox) suggestionsBox.classList.add('hidden');
    }

    // === GẮN SỰ KIỆN TÌM KIẾM (Đã cập nhật) ===
    function setupSearchListeners() {
        if (!searchInput) return;

        // Hiển thị gợi ý KHI GÕ PHÍM
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim().toLowerCase();
            if (searchTerm.length > 0) {
                renderSuggestions(searchTerm);
                showSuggestionsBox('suggestions');
            } else {
                showSuggestionsBox('history');
            }
        });

        // Hiển thị lịch sử KHI CLICK VÀO
        searchInput.addEventListener('focus', () => {
            // MỚI: Ẩn hộp filter nếu nó đang mở
            if (searchFilterBox) searchFilterBox.classList.add('hidden'); 

            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm.length > 0) {
                renderSuggestions(searchTerm);
                showSuggestionsBox('suggestions');
            } else {
                showSuggestionsBox('history');
            }
        });

        // Thực hiện tìm kiếm KHI NHẤN ENTER
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });

        // Nút XÓA LỊCH SỬ
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Ngăn đóng hộp gợi ý
                searchHistory = [];
                saveSearchHistory();
                renderSearchHistory(); // Render lại danh sách rỗng
            });
        }

        // Đóng hộp gợi ý KHI CLICK BÊN NGOÀI (CẬP NHẬT)
        document.addEventListener('click', (e) => {
            const searchWrapper = document.querySelector('.search-wrapper');
            // MỚI: Chỉ ẩn nếu click bên ngoài toàn bộ .search-wrapper
            if (searchWrapper && !searchWrapper.contains(e.target)) {
                hideSuggestionsBox();
                if (searchFilterBox) searchFilterBox.classList.add('hidden'); // Ẩn cả filter
            }
        });
    }

    // === KHỞI CHẠY VÀ GẮN SỰ KIỆN ===

    if (allProducts.length === 0) {
        console.error("LỖI: Biến 'products' không tồn tại hoặc rỗng. Tệp products.js có thể chưa được tải.");
        if (noProductMessage) {
            noProductMessage.innerText = "Lỗi tải sản phẩm. Vui lòng thử lại.";
            noProductMessage.classList.remove('hidden');
        }
        return; // Dừng thực thi nếu không có sản phẩm
    }

    // Khởi chạy tất cả
    setupCategoryBar();
    renderProducts(currentPage, allProducts); // Render tất cả lúc đầu
    setupPagination(allProducts);
    updateCartCount();
    setupQuantitySelector();
    setupFilterInteractions(); // ĐÃ CẬP NHẬT

    // Gắn sự kiện click sản phẩm
    if (productListContainer) {
        productListContainer.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                if (!localStorage.getItem(USER_STORAGE_KEY)) {
                    showAlert('Vui lòng đăng nhập để xem chi tiết sản phẩm');
                } else {
                    const productId = productItem.dataset.productId;
                    openProductModal(productId);
                }
            }
        });
    }

    // Gắn sự kiện đóng modal chung
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllModals);
    if (modalOverlay) modalOverlay.addEventListener('click', closeAllModals);

    // Gắn sự kiện thêm vào giỏ hàng
    if (addToCartButton) {
        addToCartButton.addEventListener('click', handleAddToCart);
    }

    // Khởi chạy Tìm kiếm
    setupSearchListeners();

});