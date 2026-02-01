import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import TokenService from "../services/token.service";
import AuthService from "../services/auth.service";

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const logIn = (user) => setUserInfo(user);
  const logOut = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUserInfo(null);
    TokenService.removeUser();
  };

  function getUser() {
    const savedUser = TokenService.getUser() || null;
    return savedUser;
  }

  useEffect(() => {
    const user = getUser();
    setUserInfo(user);
  }, []);

  useEffect(() => {
    if (userInfo) {
      TokenService.setUser(userInfo);
    }
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
