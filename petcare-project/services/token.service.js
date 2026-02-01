import { Cookies } from "react-cookie";

const cookie = new Cookies();

/**
 * GET USER (parse JSON)
 */
const getUser = () => {
  const user = cookie.get("user");
  if (!user) return null;

  try {
    return typeof user === "string" ? JSON.parse(user) : user;
  } catch {
    return null;
  }
};

/**
 * GET ACCESS TOKEN (deprecated - now using cookies)
 */
const getAccessToken = () => {
  return null; // Not needed anymore
};

/**
 * SET USER (save role ด้วย)
 */
const setUser = (user) => {
  if (!user) {
    removeUser();
    return;
  }

  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,          // ⭐ สำคัญ
    // No accessToken needed
  };

  cookie.set("user", JSON.stringify(userData), {
    path: "/",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    sameSite: "lax",
  });
};

/**
 * REMOVE USER
 */
const removeUser = () => {
  cookie.remove("user", { path: "/" });
};

const TokenService = {
  getAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
