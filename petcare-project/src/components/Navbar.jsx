import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";
import AuthService from "../../services/auth.service";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { userInfo, logOut } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout(); // clear token
    logOut(); // update context
    navigate("/"); // navigate to home
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="navbar-start">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="PetCare Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="navbar-center">
        {userInfo && userInfo.role === "ADMIN" && (
          <Link to="/admin/dashboard" className="btn btn-outline btn-sm mx-2">
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="navbar-end gap-2">
        {userInfo ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={userInfo.image || "https://gitlab.com/Kasuya95/nft8bits/-/raw/main/3.jpg?ref_type=heads"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  
                </Link>
              </li>
              <li>
                <Link to="/my-booking">My Booking</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link className="btn btn-ghost btn-sm" to="/register">
              Register
            </Link>
            <Link className="btn btn-primary btn-sm" to="/login">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
