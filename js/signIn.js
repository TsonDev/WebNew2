// Lấy các phần tử từ form
const formsigninElement = document.getElementById('formsignin');
const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');

// Đặt trường nhập mật khẩu thành kiểu 'password' và ngăn sao chép
passwordElement.type = 'password';
passwordElement.setAttribute('oncopy', 'return false');
passwordElement.setAttribute('onpaste', 'return false');
passwordElement.setAttribute('oncut', 'return false');

// Bắt sự kiện submit
formsigninElement.addEventListener('submit', function(e) {
    e.preventDefault();

    // Lấy dữ liệu người dùng từ localStorage
    const userLocal = JSON.parse(localStorage.getItem('users')) || [];
    const userLocalAd = JSON.parse(localStorage.getItem('usersAd')) || [];
    
    // Tìm kiếm user và admin
    const findUser = userLocal.find(user =>
        user.emailAddress.trim() === usernameElement.value && user.password === passwordElement.value
    );
    const findUserAd = userLocalAd.find(user =>
        user.emailAddress === usernameElement.value && user.password === passwordElement.value
    );

    if (usernameElement.value === "" && passwordElement.value === "") {
        alert("Nhập đủ thông tin");
    } else if (findUser) {
        // Lưu trữ thông tin người dùng để hiển thị trên index.html
        localStorage.setItem('currentUser', JSON.stringify(findUser));
        window.location.href = 'index.html';
    } else if (findUserAd) {
        window.location.href = 'admin.html';
    } else {
        alert('Tài khoản hoặc mật khẩu không đúng');
    }
});
