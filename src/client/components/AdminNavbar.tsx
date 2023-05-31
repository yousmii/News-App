import React from "react";
import styles from "./modules/AdminNavbar.module.scss";

const AdminNavbar = () => {
  return (
    <div className={styles.navbar}>
      <a href={"/admin/rss"}>
        <div className={styles.title}>RSS feeds</div>
      </a>
      <a href={"/admin/users"}>
        <div className={styles.title}>Users</div>
      </a>
    </div>
  );
};
export default AdminNavbar;
