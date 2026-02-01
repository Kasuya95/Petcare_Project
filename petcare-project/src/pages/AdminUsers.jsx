import { useEffect, useState } from "react";
import userApi from "../../services/user.service";
import Swal from "sweetalert2";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userApi.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดผู้ใช้");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "USER" ? "ADMIN" : currentRole === "ADMIN" ? "SERVICE" : "USER";
    
    const { value: selectedRole } = await Swal.fire({
      title: "เลือกบทบาท",
      input: "select",
      inputOptions: {
        USER: "ผู้ใช้ทั่วไป",
        SERVICE: "ผู้ให้บริการ",
        ADMIN: "ผู้ดูแล",
      },
      inputValue: currentRole,
      showCancelButton: true,
      confirmButtonText: "อัปเดต",
      cancelButtonText: "ยกเลิก",
    });

    if (selectedRole && selectedRole !== currentRole) {
      try {
        await userApi.updateUserRole(userId, selectedRole);
        Swal.fire("สำเร็จ", "อัปเดตบทบาทแล้ว", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถเปลี่ยนบทบาท", "error");
      }
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const { isConfirmed } = await Swal.fire({
      title: "ลบผู้ใช้?",
      text: `ลบ "${username}"? การกระทำนี้ไม่สามารถยกเลิกได้`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });

    if (isConfirmed) {
      try {
        await userApi.deleteUser(userId);
        Swal.fire("สำเร็จ", "ลบผู้ใช้แล้ว", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถลบผู้ใช้", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">👥 จัดการผู้ใช้</h2>
        {loading ? (
          <div className="text-center py-10">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4">กำลังโหลด...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary text-primary-content">
                  <th className="text-xs sm:text-sm">#</th>
                  <th className="text-xs sm:text-sm">ชื่อผู้ใช้</th>
                  <th className="text-xs sm:text-sm hidden sm:table-cell">อีเมล</th>
                  <th className="text-xs sm:text-sm">บทบาท</th>
                  <th className="text-xs sm:text-sm hidden md:table-cell">สร้างเมื่อ</th>
                  <th className="text-xs sm:text-sm">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u, i) => (
                    <tr key={u._id} className="hover:bg-base-300 transition-colors">
                      <td className="text-xs sm:text-sm">{i + 1}</td>
                      <td className="font-medium text-xs sm:text-sm">{u.username}</td>
                      <td className="text-xs sm:text-sm hidden sm:table-cell text-gray-600">{u.email}</td>
                      <td>
                        <span className={`badge badge-sm ${u.role === "ADMIN" ? "badge-error" : "badge-primary"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {new Date(u.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td>
                        <div className="flex flex-col sm:flex-row gap-1">
                          <button
                            className="btn btn-xs btn-warning text-xs"
                            onClick={() => handleChangeRole(u._id, u.role)}
                            title="เปลี่ยนบทบาท"
                          >
                            เปลี่ยน
                          </button>
                          <button
                            className="btn btn-xs btn-error text-xs"
                            onClick={() => handleDeleteUser(u._id, u.username)}
                            title="ลบผู้ใช้"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-4">
                      ไม่มีผู้ใช้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
