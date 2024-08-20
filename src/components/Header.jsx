import React from "react";
import { Link } from "react-router-dom";
import { useInfos } from "../context/authContext"; 
import "./Header.css";

const Header = () => {
  const { logout, user, loginWithGoogle } = useInfos(); 

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="Header">
          <div className="navbar-header">
            <ul className="nav navbar-nav">
              <li>
                {user && <span className="navbar-text">Bonjour, {user.email}</span>}
              </li>
              <li>
                {user && (
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Déconnexion
                  </button>
                )}
              </li>
            </ul>

            {!user && (
              <ul className="nav navbar-nav">
                <li>
                  <button className="btn btn-primary" onClick={loginWithGoogle}>
                    Sign in with Google
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
