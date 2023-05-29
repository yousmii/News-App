import React, { useEffect, useState } from "react";

import styles from "./Header.module.scss";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";
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
            Dashboard
          </a>
        )}
        <a href={"/"}>
          <span className={styles.header__logo}>- News Aggregator -</span>
        </a>
        {username != null ? (
          <div>
            <button className={styles.pointer} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.header__loginbutton}>
            <a href={"/login"}>
              <IoPersonCircle />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
