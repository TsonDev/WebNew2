let editingIndex = null; // Biến toàn cục để lưu vị trí subject đang chỉnh sửa
let studentId = new URLSearchParams(window.location.search).get('id');
let key = `subjects:${studentId}`;
let subjects = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
let subjectId = editingIndex !== null ? subjects[editingIndex].subjectId : Math.ceil(Math.random() * 1000000);
// Hiển thị thông tin chi tiết sinh viên
if (studentId) {
    let students = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let student = students.find(s => s.userId == studentId);

    if (student) {
        let tableContent = `<tr>
            <th>MSV</th>
            <th>Image</th>
            <th>Họ và tên</th>
            <th>Ngày sinh</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Password</th>
            <th>Lớp</th>
            <th>Quê quán</th>
            <th>Giới tính</th>
        </tr>`;
        tableContent += `<tr>
            <td> ${student.userId}</td>
            <td><img src="${student.image}" alt="Ảnh sinh viên" width="100" height="100"/></td>    
            <td> ${student.userName}</td>
            <td> ${student.userBirth}</td>
            <td>${student.emailAddress}</td>
            <td> ${student.phoneNumber}</td>
            <td> ${student.password}</td>
            <td> ${student.class}</td>
            <td> ${student.address}</td>
            <td>${student.gender === '2' ? 'Nữ' : 'Nam'}</td>
        </tr>`;
        document.getElementById('student-detail').innerHTML = tableContent;
    } else {
        document.getElementById('student-detail').innerHTML = '<p>Không tìm thấy sinh viên.</p>';
    }
} else {
    document.getElementById('student-detail').innerHTML = '<p>Không có ID sinh viên được cung cấp.</p>';
}

// Lưu môn học
function saveSubject() {
    let subjectName = document.getElementById('subject').value;
    let subjectSoTc = parseInt(document.getElementById('soTc').value);
    let money = parseFloat(document.getElementById('money').value);
    let teacher = document.getElementById('teacher').value;
    let dateStart = document.getElementById('subject_start').value;
    let dateEnd = document.getElementById('subject_end').value;
    let money_last = money * subjectSoTc;

    if (!studentId) {
        alert("Không tìm thấy ID sinh viên.");
        return;
    }
    // validate
    let isValid = true; // Cờ kiểm tra hợp lệ
    // kiem tra ten mon
    if (!subjectName) {
        document.getElementById('subjectError').style.display = "block";
        document.getElementById('subjectError').innerHTML = "Nhập tên môn!";
        isValid = false;
    
    } else {
        document.getElementById('subjectError').style.display = "none";
        document.getElementById('subjectError').innerHTML = '';
    }
    // Kiểm tra họ tên
    if (!teacher) {
        document.getElementById('teacherError').style.display = "block";
        document.getElementById('teacherError').innerHTML = "Vui lòng nhập họ và tên giảng viên!";
        isValid = false;
    } else {
        document.getElementById('teacherError').style.display = "none";
        document.getElementById('teacherError').innerHTML = '';
    }
    // Kiểm tra nếu tất cả các thông tin cần thiết đã được nhập
    if (!subjectName || !subjectSoTc || !money || !teacher) {
        alert("Nhập đầy đủ thông tin");
        isValid = false;
    }
    if(isValid){
    let subjectData = {
        subjectId: Math.floor(100000 + Math.random() * 900000),
        subjectName: subjectName,
        subjectSoTc: subjectSoTc,
        money: money_last,
        teacherName: teacher,
        dateStart: dateStart,
        dateEnd: dateEnd,
        pointTx1: null,  // điểm sẽ được lưu khi nhập
        pointTx2: null,
        pointKt: null,
        totalPoint: null
    };

    if (editingIndex !== null) {
        subjects[editingIndex] = subjectData;
        editingIndex = null;
    } else {
        subjects.push(subjectData);
    }

    localStorage.setItem(key, JSON.stringify(subjects));
    renderListSubject(subjects);
    console.log(subjects)
    alert("Lưu thành công!");
}
}
function savePoint() {
    // Kiểm tra nếu có chỉ mục đang chỉnh sửa
    if (editingIndex === null) {
        alert('Vui lòng chọn môn học để nhập điểm.');
        return;
    }

    // Lấy danh sách môn học từ localStorage
    let subjects = JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];
    let subject = subjects[editingIndex]; // Xác định môn học cần chỉnh sửa
    // validat

    // Lấy giá trị điểm từ các ô nhập liệu
    let pointTx1 = parseFloat(document.getElementById('point_tx1').value);
    let pointTx2 = parseFloat(document.getElementById('point_tx2').value);
    let pointKt = parseFloat(document.getElementById('point_kt').value);
    // validate
    isValid2=true
    if (!subject) {
        alert('Không tìm thấy môn học để lưu điểm.');
        return;
    }
    if(pointTx1<0 || pointTx1>10){
        document.getElementById("point_tx1-error").style.display='block'
        document.getElementById("point_tx1-error").innerHTML='Nhập điểm trong khoảng 0-10'
        isValid2=false
    }
    else{
        document.getElementById("point_tx1-error").style.display='none'
    }
    if(pointTx2<0 || pointTx2>10){
        document.getElementById("point_tx2-error").style.display='block'
        document.getElementById("point_tx2-error").innerHTML='Nhập điểm trong khoảng 0-10'
        isValid2=false
    }
    else{
        document.getElementById("point_tx2-error").style.display='none'
    }
    if(pointKt<0 || pointKt>10){
        document.getElementById("point_kt-error").style.display='block'
        document.getElementById("point_kt-error").innerHTML='Nhập điểm trong khoảng 0-10'
        isValid2=false
    }
    else{
        document.getElementById("point_kt-error").style.display='none'
    }
    
    // Kiểm tra điểm hợp lệ
    if (!isValid2) {
        alert('Vui lòng nhập đầy đủ và chính xác các điểm.');
        return;
    }
    else{
    // Cập nhật điểm cho môn học
    subject.pointTx1 = pointTx1;
    subject.pointTx2 = pointTx2;
    subject.pointKt = pointKt;
    subject.totalPoint = ((pointTx1*0.2 + pointTx2*0.3 + pointKt*0.5)).toFixed(2); // Tính điểm trung bình

    // Lưu lại danh sách môn học vào localStorage
    localStorage.setItem(`subjects:${studentId}`, JSON.stringify(subjects));

    // Hiển thị lại danh sách điểm
    renderListPoint(subjects);

    // Đặt lại chỉ mục chỉnh sửa và thông báo thành công
    editingIndex = null;
    alert('Lưu điểm thành công!');
    }
}


// Chỉnh sửa môn học
function editSubject(index) {
    let subjects = JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];
    let subject = subjects[index];

    if (subject) {
        document.getElementById('subject').value = subject.subjectName;
        document.getElementById('soTc').value = subject.subjectSoTc;
        document.getElementById('money').value = subject.money / subject.subjectSoTc; // Chuyển về giá gốc
        document.getElementById('teacher').value = subject.teacherName;
        document.getElementById('subject_start').value = subject.dateStart;
        document.getElementById('subject_end').value = subject.dateEnd;

        editingIndex = index; // Đặt chế độ chỉnh sửa
    } else {
        alert('Môn học không tìm thấy');
    }
}

// Xóa môn học
function deleteSubject(index) {
    let subjects = JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];
    if (index >= 0 && index < subjects.length) {
        subjects.splice(index, 1);
        localStorage.setItem(`subjects:${studentId}`, JSON.stringify(subjects));
        renderListSubject(subjects);
        alert('Xóa môn học thành công!');
    } else {
        alert('Môn học không tồn tại.');
    }
}

// Chỉnh sửa điểm của môn học
function editPoint(index) {
    let subjects = JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];
    let subject = subjects[index];

    if (subject) {
        document.getElementById('subject').value = subject.subjectName;
        document.getElementById('soTc').value = subject.subjectSoTc;
        document.getElementById('point_tx1').value = subject.pointTx1 || '';
        document.getElementById('point_tx2').value = subject.pointTx2 || '';
        document.getElementById('point_kt').value = subject.pointKt || '';

        editingIndex = index; // Đặt chế độ chỉnh sửa
    } else {
        alert('Môn học không tìm thấy');
    }
}

// Xóa điểm của môn học
function deletePoint(index) {
    let subjects = JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];
    if (index >= 0 && index < subjects.length) {
        // Đặt lại các điểm của môn học về null
        subjects[index].pointTx1 = null;
        subjects[index].pointTx2 = null;
        subjects[index].pointKt = null;
        subjects[index].totalPoint = null;

        localStorage.setItem(`subjects:${studentId}`, JSON.stringify(subjects));
        renderListPoint(subjects);
        alert('Đã xóa điểm của môn học.');
    } else {
        alert('Không thể xóa điểm của môn học.');
    }
}

// Cập nhật danh sách môn học
function renderListSubject(subjects = null) {
    subjects = subjects || JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];

    let tableContent = `<tr>
        <th>id</th>
        <th>Tên môn</th>
        <th>Số tc</th>
        <th>Giá</th>
        <th>Giảng viên</th>
        <th>Ngày bắt đầu</th>
        <th>Ngày kết thúc</th>
        <th>Hành động</th>
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
            <td>
                <a href='#' onclick='editSubject(${index})'>Cập nhật</a> | 
                <a href='#' onclick='deleteSubject(${index})'>Xóa</a>
            </td>
        </tr>`;
    });

    document.getElementById('list-subjects').innerHTML = tableContent;
}

// Cập nhật danh sách điểm
function renderListPoint(subjects = null) {
    subjects = subjects || JSON.parse(localStorage.getItem(`subjects:${studentId}`)) || [];

    if (!subjects || subjects.length === 0) {
        document.getElementById('list-points').innerHTML = '<p>Chưa có điểm nào được lưu.</p>';
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
        <th>Hành động</th>
    </tr>`;

    subjects.forEach((subject, index) => {
        tableContent += `<tr>
            <td>${index + 1}</td>
            <td>${subject.subjectName || 'N/A'}</td>
            <td>${subject.subjectSoTc || 'N/A'}</td>
            <td>${subject.pointTx1 !== null ? subject.pointTx1 : 'Chưa có'}</td>
            <td>${subject.pointTx2 !== null ? subject.pointTx2 : 'Chưa có'}</td>
            <td>${subject.pointKt !== null ? subject.pointKt : 'Chưa có'}</td>
            <td>${subject.totalPoint !== null ? subject.totalPoint : 'Chưa có'}</td>
            <td>
                <a href='#' onclick='editPoint(${index})'>Cập nhật</a> | 
                <a href='#' onclick='deletePoint(${index})'>Xóa</a>
            </td>
        </tr>`;
    });

    document.getElementById('list-points').innerHTML = tableContent;
}


// Tải lại danh sách khi trang được load
window.onload = function () {
    // Kiểm tra URL hiện tại để xác định trang đang được tải
    if (window.location.href.includes("admin_point.html")) {
        renderListPoint();
    } 
    if (window.location.href.includes("admin_subject.html")) {
        renderListSubject();
    }
};
// Quay lại trang quản lý sinh viên
function back() {
    window.location.href = 'admin.html';

}

