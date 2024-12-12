
function find() {

    let searchName = document.getElementById('search').value.toLowerCase();
    if (searchName === "") {
        return;
    }
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

    console.log(localStorage.getItem('users'));
    // Lọc danh sách sinh viên dựa trên tên
    let filteredStudents = students.filter(student =>
        student.userId.toString().toLowerCase().includes(searchName)
    );

    // Hiển thị kết quả tìm kiếm
    renderListStudent(filteredStudents);
}
function renderListStudent(students = null) {
    students = students || JSON.parse(localStorage.getItem('users')) || [];

    if (students.length === 0) {
        document.getElementById('list-student').style.display = 'none';
        return false;
    }
    document.getElementById('list-student').style.display = 'block';

    let tableContent = `<tr>
        <td>MSV</td>
        <td>Image</td>
        <td>Họ và tên</td>
        <td>Email</td>
        <td>Điện thoại</td>
        <td>Password</td>
        <td>Lớp</td>
        <td>Điểm tb</td>
        <td>Quê quán</td>
        <td>Giới tính</td>
        <td>Hành động</td>
    </tr>`;

    students.forEach((student, index) => {
        let genderTable = student.gender === '2' ? 'Nữ' : 'Nam';
        index++;
        tableContent += `<tr>
            <td>${student.userId}</td>
            <td><img src="${student.image}" alt="student image" width="50" height="50"/></td>
            <td>${student.userName}</td>
            <td>${student.emailAddress}</td>
            <td>${student.phoneNumber}</td>
            <td>${student.password}</td>
            <td>${student.class}</td>
            <td>${student.point}</td>
            <td>${student.address}</td>
            <td>${genderTable}</td>
            <td>
                <a href='#' onclick='deleteStudent(${index - 1})'>Xóa</a> | <a href='#' onclick="update(${index - 1})">Cập nhật</a>
            </td>
        </tr>`;
    });

    document.getElementById('list-students').innerHTML = tableContent;
}
// hiện thị ảnh khi đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const hthiElement = document.getElementById('hthi');

    if (currentUser && currentUser.image) {
        hthiElement.innerHTML = `<img src="${currentUser.image}" alt="User Image" style="width: 50px; height: 50px; border-radius:50%">`;
    } else {
        hthiElement.textContent = 'Chưa đăng nhập';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const signinLink = document.querySelector('a[href="./SignIn.html"]');
    const signupLink = document.querySelector('a[href="./SignUp.html"]');

    if (currentUser) {
        // Đổi "Đăng nhập" thành "Đăng xuất"
        signinLink.textContent = 'Đăng xuất';
        signinLink.href = '#';
        signinLink.addEventListener('click', function () {
            // Xóa thông tin người dùng khỏi localStorage và làm mới trang
            localStorage.removeItem('currentUser');
            location.reload();
        });

        // Ẩn "Đăng kí"
        signupLink.style.display = 'none';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log(currentUser)
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
        
    </tr>`;


    let genderTable = currentUser.gender === '2' ? 'Nữ' : 'Nam';

    tableContent += `<tr>
            <td>${currentUser.userId}</td>
            <td><img src="${currentUser.image}" alt="student image" width="50" height="50"/></td>
            <td>${currentUser.userName}</td>
            <td>${currentUser.userBirth}</td>
            <td>${currentUser.emailAddress}</td>
            <td>${currentUser.phoneNumber}</td>
            <td>${currentUser.password}</td>
            <td>${currentUser.class}</td>
            <td><a href='#' onclick='classSubject(${currentUser.userId})'>Chi tiết</a></td>

            <td><a href ='#'onclick = 'classPoint(${currentUser.userId})'>Chi tiết</a></td>
            <td>${currentUser.address}</td>
            <td>${genderTable}</td>
        </tr>`;


    document.getElementById('student-detail').innerHTML = tableContent;


});

function classSubject() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.error('Không tìm thấy thông tin người dùng.');
        return;
    }

    let subjects = localStorage.getItem(`subjects:${currentUser.userId}`);
    subjects = subjects ? JSON.parse(subjects) : []; // Chuyển đổi JSON và xử lý trường hợp null

    if (!Array.isArray(subjects)) {
        console.error('Dữ liệu môn học không đúng định dạng.');
        return;
    }

    let tableContent = `<tr>
        <th>Mã môn</th>
        <th>Tên môn</th>
        <th>Số tc</th>
        <th>Giá</th>
        <th>Giảng viên</th>
        <th>Ngày bắt đầu</th>
        <th>Ngày kết thúc</th>
        
    </tr>`;

    subjects.forEach((subject, index) => {
        tableContent += `<tr>
            <td>${subject.subjectId}</td>
            <td>${subject.subjectName}</td>
            <td>${subject.subjectSoTc}</td>
            <td>${subject.money}</td>
            <td>${subject.teacherName}</td>
            <td>${subject.dateStart}</td>
            <td>${subject.dateEnd}</td>
        </tr>`;
    });

    document.getElementById('list-subjects').innerHTML = tableContent; // Giả sử bạn hiển thị trong bảng có ID 'subjectsTable'
}
function classPoint() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.error('Không tìm thấy thông tin người dùng.');
        return;
    }

    let points = localStorage.getItem(`subjects:${currentUser.userId}`);
    points = points ? JSON.parse(points) : []; // Chuyển đổi JSON và xử lý trường hợp null

    if (!Array.isArray(points)) {
        console.error('Dữ liệu môn học không đúng định dạng.');
        return;
    }

    let tableContent = `<tr>
    <th>STT</th>
    <th>Tên môn</th>
    <th>Số tc</th>
    <th>Điểm TX1</th>
    <th>Điểm TX2</th>
    <th>Điểm cuối kỳ</th>
    <th>Điểm tổng</th>
</tr>`;

    points.forEach((subject, index) => {
        tableContent += `<tr>
        <td>${index + 1}</td>
        <td>${subject.subjectName || 'N/A'}</td>
        <td>${subject.subjectSoTc || 'N/A'}</td>
        <td>${subject.pointTx1 !== null ? subject.pointTx1 : 'Chưa có'}</td>
        <td>${subject.pointTx2 !== null ? subject.pointTx2 : 'Chưa có'}</td>
        <td>${subject.pointKt !== null ? subject.pointKt : 'Chưa có'}</td>
        <td>${subject.totalPoint !== null ? subject.totalPoint : 'Chưa có'}</td>
    </tr>`;
    });

    document.getElementById('list-points').innerHTML = tableContent; // Giả sử bạn hiển thị trong bảng có ID 'subjectsTable'
}





