// lấy element của trang
const maSVElement = document.getElementById('maSV')
const formsignupElement =document.getElementById('formsignup')
const userNameElement =document.getElementById('userName')
const birthDayElement = document.getElementById('birthDay')
const phoneNumberElement =document.getElementById('phoneNumber')
const emailAddressElement =document.getElementById('emailAddress')
const passwordElement =document.getElementById('password')
const rePasswordElement =document.getElementById('rePassword')
const addressElement =document.getElementById('address')
const genderElement =''

// lấy data from local
const userLocal =JSON.parse(localStorage.getItem('users')) || []
console.log(userLocal)
// tạo user admin
// Khởi tạo user mới
const userAd = {
    userId : '00000',
    userName : 'Trần Hùng Sơn',
    birthday : '28-07-2004',
    phoneNumber : '0978887435',
    emailAddress : 'tranhungson.hn2004@gmail.com',
    password : 'tranhungson!@#',
    address : 'Hà Nam'
}

// Lấy dữ liệu từ localStorage, nếu chưa có thì khởi tạo mảng rỗng
let userLocalAd = JSON.parse(localStorage.getItem('usersAd')) || [];

// Kiểm tra xem userAd đã tồn tại hay chưa dựa trên userId
const isUserExists = userLocalAd.some(user => user.userId === userAd.userId);

// Chỉ thêm user nếu chưa tồn tại trong localStorage
if (!isUserExists) {
    userLocalAd.push(userAd);
    localStorage.setItem('usersAd', JSON.stringify(userLocalAd));
}

// lắng nghe sự kiện form đăng kí
formsignupElement.addEventListener('submit',function(e){
    // ngăn chạn load trang
    e.preventDefault();
    // validate data
    let isValid = true; // Cờ kiểm tra hợp lệ

    // Kiểm tra mã sinh viên
    if (maSVElement.value.length !== 6 || !/^\d{6}$/.test(maSVElement.value)) {
        document.getElementById('maSVError').style.display = "block";
        document.getElementById('maSVError').innerHTML = "Mã sinh viên phải có đúng 6 chữ số.";
        isValid = false;
    } else {
        document.getElementById('maSVError').style.display = "none";
    }

    // Kiểm tra trùng lặp mã sinh viên
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let filteredStudents = students.filter(student => 
        student.userId === maSVElement.value.trim()
    );
    if (filteredStudents.length > 0) {
        document.getElementById('maSVError').style.display = "block";
        document.getElementById('maSVError').innerHTML = "Nhập mã sinh viên khác.";
        isValid = false;
    }
    else{
        document.getElementById('maSVError').style.display = "none";
    }
    // if (filteredStudents) {
    //     document.getElementById('maSVError').style.display = "block";
    //     document.getElementById('maSVError').innerHTML = "Mã sinh viên đã tồn tại";
    //     isValid = false;
    // }
    // else{
    //     document.getElementById('maSVError').style.display = "none";
    // }

    // Kiểm tra họ tên
    if (!userNameElement.value) {
        document.getElementById('userNameError').style.display = "block";
        document.getElementById('userNameError').innerHTML = 'Không được để trống họ và tên!';
        isValid = false;
    } else if (userNameElement.value.length > 30) {
        document.getElementById('userNameError').style.display = "block";
        document.getElementById('userNameError').innerHTML = 'Tên đặt tối đa 30 ký tự!';
        isValid = false;
    } else {
        document.getElementById('userNameError').style.display = "none";
    }

    // Kiểm tra ngày sinh
    if (!validateDate(birthDayElement.value)) {
        document.getElementById('birthDayError').style.display = "block";
        document.getElementById('birthDayError').innerHTML = 'Nhập lại theo định dạng xx-yy-zzzz';
        isValid = false;
    } else {
        document.getElementById('birthDayError').style.display = "none";
    }

    // Kiểm tra số điện thoại
    if (!phoneNumberElement.value || phoneNumberElement.value.length !== 10 || !/^\d+$/.test(phoneNumberElement.value)) {
        document.getElementById('phoneNumberError').style.display = "block";
        document.getElementById('phoneNumberError').innerHTML = 'Số điện thoại phải có đúng 10 chữ số!';
        isValid = false;
    } else {
        document.getElementById('phoneNumberError').style.display = "none";
    }

    // Kiểm tra email
    if (!validateEmail(emailAddressElement.value)) {
        document.getElementById('emailAddressError').style.display = "block";
        document.getElementById('emailAddressError').innerHTML = 'Nhập đúng định dạng email!';
        isValid = false;
    } else {
        document.getElementById('emailAddressError').style.display = "none";
    }

    // Kiểm tra mật khẩu khớp
    if (passwordElement.value !== rePasswordElement.value) {
        document.getElementById("rePasswordError").style.display = 'block';
        document.getElementById("rePasswordError").innerHTML = 'Xác nhận mật khẩu không khớp!';
        isValid = false;
    } else {
        document.getElementById("rePasswordError").style.display = 'none';
    }

    // Nếu không hợp lệ, ngăn chặn submit
    
    if(isValid){
        // lấy dữ liệu 
        const user = {
            userId : maSVElement.value,
            userName : userNameElement.value,
            userBirth : birthDayElement.value,
            phoneNumber : phoneNumberElement.value,
            emailAddress : emailAddressElement.value,
            password : passwordElement.value,
            class :"",
            point :"",
            address : addressElement.value
        }
        // push data into local
        userLocal.push(user)
        localStorage.setItem('users',JSON.stringify(userLocal))
        console.log(user)
         // push data admin into local 
        // userLocalAd.push(userAd)
        // localStorage.setItem('usersAd',JSON.stringify(userLocalAd))
        // console.log(user)

        // chuyển hướng về đăng nhập
        setTimeout(function(){
            window.location.href='SignIn.html'
        },2000)
    }
    else if(!userNameElement.value && !phoneNumberElement.value && !emailAddressElement.value &&!passwordElement.value){
        alert("Nhập đủ thông tin")
    }
}); 

function validateDate(dateString) {
    // Định dạng regex cho dd-mm-yyyy
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = dateString.match(regex);

    if (!match) {
        return false; // Không khớp định dạng
    }

    // Tách ngày, tháng, năm từ chuỗi
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Kiểm tra năm, tháng, ngày hợp lệ
    if (year < 1900 || year > new Date().getFullYear()) {
        return false; // Năm không hợp lệ
    }
    if (month < 1 || month > 12) {
        return false; // Tháng không hợp lệ
    }

    // Tính số ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return false; // Ngày không hợp lệ
    }

    return true; // Hợp lệ
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
