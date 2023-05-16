import React from "react";
import styles from "./AdminNavbar.module.scss";

const AdminNavbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__content}>
        <a href={"/admin/rss"}>
          <div className={styles.title}>RSS feeds</div>
        </a>
        |
        <a href={"/admin/users"}>
          <div className={styles.title}>Users</div>
        </a>
      </div>
    </div>
  );
};
export default AdminNavbar;
