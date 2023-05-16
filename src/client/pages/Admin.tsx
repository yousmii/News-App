import React, { Component, useEffect, useState } from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../components/Admin.module.scss";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { IoPersonCircle } from "react-icons/io5";
import { BiRss } from "react-icons/bi";
import { BsKeyFill, BsRssFill } from "react-icons/bs";

export default function Admin() {
  useEffect(() => {
    axios
      .get("/api/@me", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (!response.data.is_admin) {
          window.location.href = "/403";
        } else if (response.data.status !== 200) {
          window.location.href = "/403";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // prevent unauthorized access to admin page

  return (
    <div>
      <div className={styles.titlecontainer}>
        <div className={styles.logo}>
          <IoPersonCircle />
        </div>
        <div className={styles.title}>Hello admin</div>
      </div>

      <div className={styles.pagescontainer}>
        <a href={"/admin/rss"}>
          <div className={styles.pagecontainer}>
            <div className={styles.pagecontent}>
              <div className={styles.logorss}>
                <BsRssFill />
              </div>
              RSS Feeds
            </div>
          </div>
        </a>
        <a href={"/admin/users"}>
          <div className={styles.pagecontainer}>
            <div className={styles.pagecontent}>
              <div className={styles.logouser}>
                <IoPersonCircle />
              </div>
              Users
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
