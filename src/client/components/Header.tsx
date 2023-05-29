import React, { useEffect, useState } from "react";

import styles from "./modules/Header.module.scss";

import { BiLogOutCircle, BiMenuAltRight } from "react-icons/bi";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import Login from "../assets/login.svg";
import Register from "../assets/register.svg";

import axios from "axios";
import Logout from "./Logout";
import handleLogout from "./Logout";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [is_admin, setIs_admin] = useState<boolean>(false);
  const menuToggler = () => setMenuOpen((p) => !p);

  useEffect(() => {
    axios
      .get("/api/@me", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUsername(response.data.username);
          setIs_admin(response.data.is_admin);
        } else {
          console.log("Not logged in");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        {is_admin && (
          <a href={"/admin"} id={styles.dashboard}>
            <MdDashboard />
          </a>
        )}

        <a href={"/"}>
          <span className={styles.header__logo}>News Central</span>
        </a>
        <div className={styles.header__accountactions}>
          {username != null ? (
            <div className={styles.header__logoutbutton}>
              <button onClick={handleLogout}>
                <BiLogOutCircle />
              </button>
            </div>
          ) : (
            <div>
              <div className={styles.header__loginbutton}>
                <a href={"/login"}>
                  <img src={Login} alt="Login" />
                </a>
              </div>

              <div className={styles.header__loginbutton}>
                <a href={"/register"}>
                  <img src={Register} alt="Register" />
                </a>
              </div>

              <div className={styles.header__loginbutton}>
                <a href={"/login"}>
                  <IoPersonCircle />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
