/* BÀI B — VIẾT CODE: Giỏ hàng của xưởng in
   Hoàn thiện class GioHang và hàm napGioHang.
   Không đổi tên class, tên phương thức, tên hàm; không sửa phần "DỮ LIỆU ĐÃ CHO". */

// ---------- DỮ LIỆU ĐÃ CHO (không sửa) ----------
const DANH_MUC = [
    { id: "TC01", ten: "Thiệp cưới cotton", loai: "thiep cuoi", gia: 1500 },
    { id: "TC02", ten: "Thiệp cưới kraft", loai: "thiep cuoi", gia: 900 },
    { id: "DT01", ten: "Danh thiếp ép kim", loai: "danh thiep", gia: 1200 },
    { id: "PB01", ten: "Phong bì lót lụa", loai: "phu kien", gia: 500 }
];

// ---------- PHẦN BẠN VIẾT ----------
function GioHang() {
    // Mỗi dòng của giỏ là một object { id, ten, loai, gia, soLuong }.
    this.dsDong = [];
}

// 1. Thêm sản phẩm; trả về true nếu thêm được, false nếu soLuong không hợp lệ.
GioHang.prototype.them = function(sanPham, soLuong) {
    if (typeof soLuong !== 'number' || !Number.isInteger(soLuong) || soLuong <= 0) {
        return false;
    }
    // Kiểm tra xem sản phẩm (theo id) đã có trong giỏ chưa
    const dongTonTai = this.dsDong.find(d => d.id === sanPham.id);
    if (dongTonTai) {
        dongTonTai.soLuong += soLuong;
    } else {
        // Tạo bản sao của sản phẩm để tránh làm thay đổi object bên ngoài
        this.dsDong.push({
            id: sanPham.id,
            ten: sanPham.ten,
            loai: sanPham.loai,
            gia: sanPham.gia,
            soLuong: soLuong
        });
    }
    return true;
};

// 2. Xoá dòng có id tương ứng; trả về true nếu có xoá, false nếu không tìm thấy.
GioHang.prototype.xoa = function(id) {
    const index = this.dsDong.findIndex(d => d.id === id);
    if (index !== -1) {
        this.dsDong.splice(index, 1);
        return true;
    }
    return false;
};

// 3. Tổng tiền cả giỏ.
GioHang.prototype.tongTien = function() {
    return this.dsDong.reduce((tong, d) => tong + d.gia * d.soLuong, 0);
};

// 4. Object thống kê: { "<loai>": tổng tiền của loại đó, ... }.
GioHang.prototype.thongKeTheoLoai = function() {
    const thongKe = {};
    this.dsDong.forEach(d => {
        const thanhTien = d.gia * d.soLuong;
        thongKe[d.loai] = (thongKe[d.loai] || 0) + thanhTien;
    });
    return thongKe;
};

// 5. Dòng có thành tiền lớn nhất (bản sao, có thêm thanhTien); null nếu giỏ rỗng.
GioHang.prototype.dongDatNhat = function() {
    if (this.dsDong.length === 0) return null;
    
    let maxDong = this.dsDong[0];
    let maxThanhTien = maxDong.gia * maxDong.soLuong;

    for (let i = 1; i < this.dsDong.length; i++) {
        const d = this.dsDong[i];
        const thanhTien = d.gia * d.soLuong;
        if (thanhTien > maxThanhTien) {
            maxThanhTien = thanhTien;
            maxDong = d;
        }
    }

    return {
        ...maxDong,
        thanhTien: maxThanhTien
    };
};

// 6. Mảng BẢN SAO các dòng, mỗi dòng có thêm thuộc tính thanhTien.
GioHang.prototype.layDanhSach = function() {
    return this.dsDong.map(d => ({
        ...d,
        thanhTien: d.gia * d.soLuong
    }));
};

// 7. Chuỗi JSON của mảng các dòng.
GioHang.prototype.xuatJSON = function() {
    const cleanList = this.dsDong.map(d => ({
        id: d.id,
        ten: d.ten,
        loai: d.loai,
        gia: d.gia,
        soLuong: d.soLuong
    }));
    return JSON.stringify(cleanList);
};

// 8. Tạo lại một GioHang từ chuỗi JSON do xuatJSON() sinh ra.
function napGioHang(chuoiJSON) {
    const gioMoi = new GioHang();
    try {
        const parsed = JSON.parse(chuoiJSON);
        if (Array.isArray(parsed)) {
            gioMoi.dsDong = parsed.map(d => ({
                id: d.id,
                ten: d.ten,
                loai: d.loai,
                gia: d.gia,
                soLuong: d.soLuong
            }));
        }
    } catch (e) {
        // Xử lý lỗi nếu JSON không hợp lệ
    }
    return gioMoi;
}

// ---------- CHẠY THỬ (không sửa) ----------
const gio = new GioHang();
gio.them(DANH_MUC[0], 100);
gio.them(DANH_MUC[3], 200);
gio.them(DANH_MUC[0], 50);
veGioHang(gio.layDanhSach(), gio.tongTien());
console.table(gio.layDanhSach());
hienThi(`JSON gửi lên máy chủ: ${gio.xuatJSON()}`);