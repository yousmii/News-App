import React, {useEffect, useState} from "react";

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
  const menuToggler = () => setMenuOpen((p) => !p);


  useEffect(() => {
      axios.get('/api/@me', {
      headers: {
          'Content-Type': 'application/json'
      }
  })
      .then(response => {
          if (response.status === 200) {
              setUsername(response.data.username)
              console.log(response.data.username)
          }
          else {
              console.log("Not logged in")
          }
      })
      .catch(error => {
          console.log(error)
      })
  }, [])
  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        <a href={"/"}>
          <span className={styles.logo}>
            <BsNewspaper />
            <div>News Aggregator</div>
          </span>
        </a>
        {username != null
            ? (<h2>
                <button onClick={handleLogout}>{username}</button>
            </h2>)
            : (<div className={styles.header__loginbutton}>
                <a href={"/login"}>
                    <IoPersonCircle />
                 </a>
                </div>)}

      </div>
    </div>
  );
};

export default Header;
