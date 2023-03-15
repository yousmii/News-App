import React, { useState } from "react";

import styles from "./Header.module.scss";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";

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
            <div className={styles.header__item__search}></div>
            <a className={styles.header__item__login} href={"/login"}>
              <IoPersonCircle />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

const Button = () => {
  return <button className={styles.button}>Test</button>;
};

export default Header;
