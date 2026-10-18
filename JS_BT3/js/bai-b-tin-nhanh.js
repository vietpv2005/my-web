/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const oTimKiem = document.querySelector("#o-tim-kiem");
const list = document.querySelector("#list");
const boDem = document.querySelector("#bo-dem");
const khongThay = document.querySelector("#khong-thay");
const tinTieuDe = document.querySelector("#tin-tieu-de");
const tinNoiDung = document.querySelector("#tin-noi-dung");
const nutDang = document.querySelector("#nut-dang");
const baoLoi = document.querySelector("#bao-loi");

// F1. Bộ đếm "Đang hiển thị x/y tin" trong #bo-dem.
function capNhatBoDem() {
    const tatCaTin = list.querySelectorAll("li");
    const y = tatCaTin.length;
    let x = 0;
    tatCaTin.forEach(li => {
        if (!li.classList.contains("an")) {
            x++;
        }
    });
    boDem.textContent = `Đang hiển thị ${x}/${y} tin`;
}

// Hàm lọc tin dựa trên giá trị trong ô tìm kiếm
function locTin() {
    const tuKhoa = oTimKiem.value.trim().toLowerCase();
    const tatCaTin = list.querySelectorAll("li");
    let soTinKhop = 0;

    tatCaTin.forEach(li => {
        const h3 = li.querySelector("h3");
        const p = li.querySelector("p");
        const tieuDeText = h3 ? h3.textContent.toLowerCase() : "";
        const noiDungText = p ? p.textContent.toLowerCase() : "";

        if (tuKhoa === "" || tieuDeText.includes(tuKhoa) || noiDungText.includes(tuKhoa)) {
            li.classList.remove("an");
            soTinKhop++;
        } else {
            li.classList.add("an");
        }
    });

    if (soTinKhop === 0 && tatCaTin.length > 0) {
        khongThay.classList.remove("an");
        khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem.value}"`;
    } else {
        khongThay.classList.add("an");
    }

    capNhatBoDem();
}

capNhatBoDem();

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup) và thông báo #khong-thay.
oTimKiem.addEventListener("keyup", locTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list.
list.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "BUTTON" && e.target.classList.contains("more")) {
        const p = e.target.parentElement.querySelector("p");
        if (p) {
            p.classList.toggle("day-du");
            if (p.classList.contains("day-du")) {
                e.target.textContent = "Thu gọn <<";
            } else {
                e.target.textContent = "Read more >>";
            }
        }
    }
});


// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list.
nutDang.addEventListener("click", () => {
    const tieuDeVal = tinTieuDe.value.trim();
    const noiDungVal = tinNoiDung.value.trim();

    if (tieuDeVal === "" || noiDungVal === "") {
        baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
        return;
    }

    // Xoá thông báo lỗi nếu có
    baoLoi.textContent = "";

    // Tạo phần tử <li> mới
    const liMoi = document.createElement("li");

    const spanTime = document.createElement("span");
    spanTime.className = "time";
    spanTime.textContent = typeof homNay === "function" ? homNay() : "";

    const h3 = document.createElement("h3");
    h3.textContent = tieuDeVal;

    const p = document.createElement("p");
    p.textContent = noiDungVal;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "more";
    button.textContent = "Read more >>";

    liMoi.append(spanTime, h3, p, button);

    // Chèn vào đầu #list
    list.prepend(liMoi);

    // Xoá trắng hai ô nhập
    tinTieuDe.value = "";
    tinNoiDung.value = "";
    baoLoi.textContent = "";

    // Áp dụng bộ lọc hiện tại để tin mới tự động ẩn/hiện đúng với từ khoá đang tìm kiếm
    locTin();
});