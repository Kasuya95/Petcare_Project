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

const Login = () => {
  const navigate = useNavigate();
  const { userInfo, logIn } = useContext(UserContext);

  const [user, setUser] = useState({
    identifier: "",
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
    const { identifier, password } = user;

    if (!identifier || !password) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    try {
      const res = await AuthService.login(identifier, password);

      if (res.status === 200) {
        Swal.fire("Success", "เข้าสู่ระบบสำเร็จ 🐾", "success");
        logIn?.(res.data.user);

        if (res.data.user.role === "SERVICE") {
          navigate("/service/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      Swal.fire(
        "Login failed",
        err.response?.data?.message ||
          "Email / Username หรือ Password ไม่ถูกต้อง",
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
          <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Email หรือ Username"
            name="identifier"
            value={user.identifier}
            onChange={handleChange}
            placeholder="กรอก email หรือ username"
            clearable
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="กรอก password"
            clearable
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
          >
            🐶 เข้าสู่ระบบ
          </Button>

          <div className="divider text-sm">หรือ</div>

          <p className="text-center text-sm">
            ยังไม่มีบัญชี?{" "}
            <button
              onClick={() => navigate("/register")}
              className="link link-primary font-medium"
            >
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
