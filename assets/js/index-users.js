// Biến toàn cục để lưu trữ thông tin người dùng đã đăng ký (giả lập)
// Dữ liệu sẽ được lưu trong localStorage của trình duyệt
const USER_STORAGE_KEY = 'soi_registered_user'; 

/**
 * Hàm chuyển đổi hiển thị giữa các trang (sections) trong một file HTML.
 * @param {string} pageId - ID của phần tử trang cần hiển thị ('login', 'create_account', 'reset_password').
 */
function showPage(pageId) {
    // Logic ẩn/hiện trang
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active-page');
    });

    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active-page');
    }
}

/**
 * Kiểm tra định dạng email cơ bản.
 * @param {string} email - Chuỗi email cần kiểm tra.
 * @returns {boolean} - Trả về true nếu định dạng hợp lệ.
 */
function isValidEmail(email) {
    // Regex cơ bản để kiểm tra định dạng email (vd: user@domain.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// ------------------- HÀM XỬ LÝ ĐĂNG NHẬP (LOGIN) -------------------

/**
 * Xử lý sự kiện Sign In: Kiểm tra thông tin với tài khoản đã đăng ký (từ localStorage).
 */
function handleLogin() {
    // Lấy thông tin đăng nhập từ form
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput.value || !passwordInput.value) {
        alert("❗ Vui lòng điền đầy đủ Email và Mật khẩu.");
        return;
    }

    // Lấy thông tin tài khoản đã đăng ký từ localStorage
    const registeredUserJson = localStorage.getItem(USER_STORAGE_KEY);
    
    if (registeredUserJson) {
        const registeredUser = JSON.parse(registeredUserJson);

        // Kiểm tra thông tin
        if (emailInput.value === registeredUser.email && passwordInput.value === registeredUser.password) {
            // Đăng nhập thành công
            alert("🎉 Đăng nhập thành công! Chào mừng trở lại.");
            
            // Chuyển hướng đến trang chủ (giả lập)
            window.location.href = "index.html"; 

        } else {
            // Đăng nhập không thành công (Sai email/mật khẩu)
            alert("❌ Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại Email hoặc Mật khẩu.");
        }
    } else {
        // Không có tài khoản nào được đăng ký
        alert("❌ Thông tin đăng nhập không chính xác. Hiện chưa có tài khoản nào được đăng ký.");
    }
}

// ------------------- HÀM XỬ LÝ ĐĂNG KÝ (SIGN UP) -------------------

/**
 * Xử lý sự kiện Sign Up: Lưu thông tin đăng ký (nếu hợp lệ).
 */
function handleSignup() {
    // Lấy giá trị của các trường input
    const form = document.getElementById('create_account').querySelector('.login-form');

    const firstName = form.querySelector('input[placeholder="First Name"]').value.trim();
    const lastName = form.querySelector('input[placeholder="Last Name"]').value.trim();
    const emailInput = document.getElementById('signupEmail'); // Lấy element Email bằng id
    const email = emailInput.value.trim();
    const address = form.querySelector('input[placeholder="Address"]').value.trim();
    const phone = form.querySelector('input[placeholder="Phone Number"]').value.trim(); 
    const password = form.querySelector('input[placeholder="Password"]').value;
    const emailErrorSpan = document.getElementById('emailError'); // Lấy element thông báo lỗi Email

    // Xóa lỗi cũ
    emailErrorSpan.textContent = '';

    // CẬP NHẬT KIỂM TRA (thêm phone)
    if (!firstName || !lastName || !email || !address || !phone || !password) { 
        alert("❗ Vui lòng điền đầy đủ các trường thông tin.");
        return;
    }

    // KIỂM TRA ĐỊNH DẠNG EMAIL
    if (!isValidEmail(email)) {
        emailErrorSpan.textContent = '❌ Email không hợp lệ. Vui lòng nhập đúng định dạng.';
        emailInput.focus();
        return;
    }

    // THÊM MỚI: KIỂM TRA ĐỊNH DẠNG SĐT (Regex 10 số, bắt đầu bằng 0)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("⚠️ Số điện thoại không hợp lệ. Vui lòng nhập SĐT 10 số, bắt đầu bằng 0.");
        return;
    }

    // Yêu cầu: Password phải có từ 6 kí tự trở lên
    if (password.length < 6) {
        alert("⚠️ Đăng ký thất bại. Mật khẩu phải có tối thiểu 6 ký tự.");
        return;
    }

    // CẬP NHẬT: Thêm SĐT vào đối tượng newUser
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        phone: phone, // THÊM MỚI
        password: password
    };

    let users= JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
    users.push(newUser);

    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        alert("✅ Đăng ký thành công! Bạn đã có thể đăng nhập.");

        // Xóa dữ liệu form và chuyển về trang đăng nhập
        form.reset(); 
        showPage('login');

    } catch (e) {
        alert("❌ Lỗi khi lưu trữ tài khoản. Vui lòng thử lại.");
    }
}

// ------------------- HÀM XỬ LÝ QUÊN MẬT KHẨU (FORGOT PASSWORD) -------------------

/**
 * Xử lý sự kiện Submit (Quên mật khẩu): Thông báo Hoàn tất gửi mail (giữ nguyên).
 */
function handleResetPassword() {
    const emailInput = document.getElementById('resetEmail');
    
    if (emailInput && emailInput.value.trim() !== '') {
        alert("📧 Hoàn tất! Vui lòng kiểm tra email của bạn để thực hiện đặt lại mật khẩu.");
        
        // Xóa email và chuyển về trang đăng nhập
        emailInput.value = '';
        showPage('login'); 
    } else {
        alert("❗ Vui lòng nhập địa chỉ email.");
    }
}