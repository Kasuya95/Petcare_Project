// src/pages/auth/Register.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import AuthService from "../../services/auth.service";
import { UserContext } from "../../context/UserContext";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Card from "../components/Card";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { username, email, password } = user;

    if (!username || !email || !password) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    try {
      const res = await AuthService.register(username, email, password);

      if (res.status === 201) {
        Swal.fire("Success", "สมัครสมาชิกสำเร็จ 🐶", "success").then(() =>
          navigate("/login")
        );
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "สมัครไม่สำเร็จ",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <Card className="w-full max-w-md shadow-2xl relative" shadow="lg">
        {/* ปุ่มปิด */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle hover:bg-error/10"
          title="ปิด"
        >
          <X size={20} className="text-gray-600 hover:text-error" />
        </button>

        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={logo} alt="PetCare" className="h-20 object-contain" />
          <h2 className="text-2xl font-bold">สมัครสมาชิก</h2>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Username"
            name="username"
            value={user.username}
            placeholder="กรอก username"
            onChange={handleChange}
            clearable
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={user.email}
            placeholder="กรอก email"
            onChange={handleChange}
            clearable
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={user.password}
            placeholder="กรอก password"
            onChange={handleChange}
            clearable
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
          >
            🐾 สมัครสมาชิก
          </Button>

          <div className="divider text-sm">หรือ</div>

          <p className="text-center text-sm">
            มีบัญชีอยู่แล้ว?{" "}
            <button
              onClick={() => navigate("/login")}
              className="link link-primary font-medium"
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
