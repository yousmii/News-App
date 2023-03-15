import React, { useState } from "react";

import styles from "./Header.module.scss";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import { NavLink, Link} from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggler = () => setMenuOpen((p) => !p);

  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        <div>
          <span className={styles.logo}>
            <BsNewspaper />
            <div>News Aggregator</div>
          </span>
        </div>
        <div>
          <nav className={`${styles.nav} ${menuOpen ? styles[`nav--open`] : {}}`}>

              <NavLink to="/" className={styles.nav__item}>
                  Home
              </NavLink>

              <a className={styles.nav__item} href={"/login"}>
                  Login
              </a>

          </nav>
        </div>


      </div>
    </div>
    );
};

const Button = () => {
    return <button className={styles.button}>Test</button>;
};

export default Header;