let editingIndex = null; // Biến toàn cục để lưu vị trí sinh viên đang chỉnh sửa

// Hàm lưu thông tin sinh viên
function save() {
    let imageInput = document.getElementById('image');
    let fullname = document.getElementById('fullname').value;
    let birthday = document.getElementById('birthday').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let pass = document.getElementById('pass').value;
    let address = document.getElementById('address').value;
    let classElem = document.getElementById('class').value;
    let gender = '';

    let isValid = true; // Cờ kiểm tra hợp lệ

    // Kiểm tra hình ảnh
    if (!imageInput.files || imageInput.files.length === 0) {
        document.getElementById("imageError").style.display = 'block';
        isValid = false;
    } else {
        document.getElementById("imageError").style.display = 'none';
    }

    // Kiểm tra giới tính
    if (document.getElementById('male').checked) {
        gender = document.getElementById('male').value;
    } else if (document.getElementById('female').checked) {
        gender = document.getElementById('female').value;
    }

    // Kiểm tra họ tên
    if (!fullname) {
        document.getElementById('fullname-error').style.display = "block";
        document.getElementById('fullname-error').innerHTML = "Vui lòng nhập họ và tên!";
        isValid = false;
    } else if (fullname.length > 30) {
        document.getElementById('fullname-error').style.display = "block";
        document.getElementById('fullname-error').innerHTML = "Tên tối đa 30 ký tự!";
        isValid = false;
    } else {
        document.getElementById('fullname-error').style.display = "none";
        document.getElementById('fullname-error').innerHTML = '';
    }

    // Kiểm tra ngày sinh
    if (!validateDate(birthday)) {
        document.getElementById('birthdayError').style.display = "block";
        document.getElementById('birthdayError').innerHTML = 'Nhập lại theo định dạng dd-mm-yyyy';
        isValid = false;
    } else {
        document.getElementById('birthdayError').style.display = "none";
        document.getElementById('birthdayError').innerHTML = '';
    }

    // Kiểm tra số điện thoại
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
        document.getElementById('phoneError').style.display = "block";
        document.getElementById('phoneError').innerHTML = 'Số điện thoại phải có đúng 10 chữ số!';
        isValid = false;
    } else {
        document.getElementById('phoneError').style.display = "none";
        document.getElementById('phoneError').innerHTML = '';
    }

    // Kiểm tra email
    if (!validateEmail(email)) {
        document.getElementById('emailError').style.display = "block";
        document.getElementById('emailError').innerHTML = 'Nhập đúng định dạng email!';
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = "none";
        document.getElementById('emailError').innerHTML = '';
    }

    // Kiểm tra mật khẩu
    if (!pass) {
        document.getElementById('passError').style.display = "none";
        document.getElementById('passError').innerHTML = 'Mật khẩu không được để trống!';
        isValid = false;
    } else {
        document.getElementById('passError').style.display = "none";
        document.getElementById('passError').innerHTML = '';
    }

    // Kiểm tra nếu tất cả các thông tin cần thiết đã được nhập
    if (!fullname || !phone || !email || !pass || !imageInput.files || imageInput.files.length === 0) {
        alert("Nhập đầy đủ thông tin");
        isValid = false;
    }

    // Nếu form hợp lệ
    if (isValid) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

            // Nếu đang ở chế độ cập nhật, giữ nguyên userId của sinh viên
            let userId = editingIndex !== null ? students[editingIndex].userId : Math.ceil(Math.random() * 1000000);
            let studentData = {
                userId: userId,
                image: base64Image, // Lưu ảnh dưới dạng base64
                userName: fullname,
                userBirth : birthday,
                emailAddress: email,
                phoneNumber: phone,
                password: pass,
                class: classElem,
                address: address,
                gender: gender
            };

            // Nếu đang ở chế độ cập nhật, xóa sinh viên cũ và thêm bản mới
            if (editingIndex !== null) {
                students.splice(editingIndex, 1); // Xóa sinh viên cũ
                editingIndex = null; // Reset lại chế độ chỉnh sửa
            }

            // Thêm sinh viên mới hoặc sinh viên cập nhật vào danh sách
            students.push(studentData);
            localStorage.setItem('users', JSON.stringify(students));
            renderListStudent();
            alert("Lưu thành công")
        };

        reader.readAsDataURL(imageInput.files[0]);
    }
}


// Hàm hiển thị danh sách sinh viên
function renderListStudent(students = null) {
    students = students || JSON.parse(localStorage.getItem('users')) || [];

    if (students.length === 0) {
        document.getElementById('list-student').style.display = 'none';
        return false;
    }
    document.getElementById('list-student').style.display = 'block';

    let tableContent = `<tr>
        <th>MSV</th>
        <th>Image</th>
        <th>Họ và tên</th>
        <th>Ngày sinh</th>
        <th>Email</th>
        <th>Điện thoại</th>
        <th>Password</th>
        <th>Lớp</th>
        <th>Môn</th>
        <th>Điểm tb</th>
        <th>Quê quán</th>
        <th>Giới tính</th>
        <th>Hành động</th>
    </tr>`;

    students.forEach((student, index) => {
        let genderTable = student.gender === '2' ? 'Nữ' : 'Nam';
        index++;
        tableContent += `<tr>
            <td>${student.userId}</td>
            <td><img src="${student.image}" alt="student image" width="50" height="50"/></td>
            <td>${student.userName}</td>
            <td>${student.userBirth}</td>
            <td>${student.emailAddress}</td>
            <td>${student.phoneNumber}</td>
            <td>${student.password}</td>
            <td>${student.class}</td>
            <td><a href='#' onclick='classSubject(${student.userId})'>Chi tiết</a></td>

            <td><a href ='#'onclick = 'classPoint(${student.userId})'>Chi tiết</a></td>
            <td>${student.address}</td>
            <td>${genderTable}</td>
            <td>
                <a href='#' onclick='editStudent(${index - 1})'>Cập nhật</a> | <a href='#' onclick='deleteStudent(${index - 1})'>Xóa</a>
            </td>
        </tr>`;
    });
    
    document.getElementById('list-students').innerHTML = tableContent;
}

// Hàm xóa sinh viên
function deleteStudent(id) {
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    students.splice(id, 1);
    localStorage.setItem('users', JSON.stringify(students));
    // alert("Xóa thành công")
    renderListStudent();
}

// Hàm chỉnh sửa sinh viên
function editStudent(id) {
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let student = students[id];

    if (student) {
        document.getElementById('fullname').value = student.userName;
        document.getElementById('birthday').value = student.userBirth;
        document.getElementById('email').value = student.emailAddress;
        document.getElementById('phone').value = student.phoneNumber;
        document.getElementById('address').value = student.address;
        document.getElementById('class').value = student.class;
        // document.getElementById('point').value = student.point;
        document.getElementById('pass').value = student.password;
        if (student.gender === '1') {
            document.getElementById('male').checked = true;
        } else {
            document.getElementById('female').checked = true;
        }

        editingIndex = id; // Đặt chế độ chỉnh sửa
        
    } else {
        alert('Student not found');
    }
}

// Hàm tìm kiếm theo id
function findById() {
    let searchName = document.getElementById('search-id').value.trim();
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

    let filteredStudents = students.filter(student => 
        student.userId.toString().includes(searchName)
    );

    renderListStudent(filteredStudents);
}
function findByName() {
    let searchName = document.getElementById('search-name').value.trim().toLowerCase();
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

    let filteredStudents = students.filter(student => 
        student.userName.toString().toLowerCase().includes(searchName)
    );

    renderListStudent(filteredStudents);
}

// menu popup
document.getElementById('menuButton').addEventListener('click', function() {
    const popup = document.getElementById('searchPopup');
    popup.style.display = popup.style.display === 'none' || popup.style.display === '' ? 'block' : 'none';
  });

function classSubject(userId) {
    setTimeout(function() {
        window.location.href = `admin_subject.html?id=${userId}`;
    }, 200);
}
// chi tiet diem theo id
function classPoint(userId) {
    setTimeout(function() {
        window.location.href = `admin_point.html?id=${userId}`;
    }, 200);
}
// Đăng suất
function Logout(){
    window.location.href="index.html"
}
// validate
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

