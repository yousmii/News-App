import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Component, useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { BsPersonBadgeFill } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";
import AdminNavbar from "../components/AdminNavbar";
import styles from "../components/SubAdmin.module.scss";

export default function Users() {
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

  return (
    <div>
      <AdminNavbar />
      <div>
        <h1 className={styles.title}>Users</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.formcontainer}>
          <RegisterFormAdmin />
        </div>
        <div className={styles.tablecontainer}>
          <AdminTable />
        </div>
      </div>
    </div>
  );
}

export function RegisterFormAdmin() {
  const [csrfToken, setCsrfToken] = useState("");
  useEffect(() => {
    // fetch the CSRF token from your backend
    axios
      .get("/api/csrf_token")
      .then((response) => {
        setCsrfToken(response.data.csrf_token);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // include the CSRF token in the form data as a hidden input field
    formData.append("csrf_token", csrfToken);
    // submit the form data to your backend
    const data = {
      username: formData.get("username"),
      email_address: formData.get("email_address"),
      password1: formData.get("password1"),
      password2: formData.get("password2"),
      csrf_token: csrfToken,
    };
    axios
      .post("../api/admins", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        window.location.href = "/admin/users";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h2 className={styles.heading}>Add new user</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="hidden"
          name="csrf_token"
          value={csrfToken}
        />
        <label className={styles.label}>Username:</label>
        <input className={styles.input} type="text" name="username" />

        <label className={styles.label}>Email address:</label>
        <input className={styles.input} type="email" name="email_address" />

        <label className={styles.label}>Password:</label>
        <input className={styles.input} type="password" name="password1" />

        <label className={styles.label}>Confirm password:</label>
        <input className={styles.input} type="password" name="password2" />

        <input className={styles.button} type="submit" value="Register" />
      </form>
    </div>
  );
}

interface AdminInterface {
  name: string;
  password: string;
  cookie_id: string;
}

const AdminTable: React.FC = () => {
  const [admins, setAdmins] = useState<AdminInterface[]>([]);

  useEffect(() => {
    fetch("/api/admins")
      .then((response) => response.json())
      .then((data) => setAdmins(data));
  }, []);

  const handleDelete = (delete_name: string) => {
    axios
      .delete(`/api/admins`, {
        params: {
          name: delete_name,
        },
      })
      .then((response) => {
        if (response.data["status"] == 200) {
          setAdmins(admins.filter((admin) => admin.name !== delete_name));
          alert(response.data["message"]);
        } else {
          alert(response.data["message"]);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.heading}>User Table</h2>
      <table>
        <thead>
          <tr>
            <th id={styles.adminNameHead}>Name</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.name} id={styles.admins}>
              <td id={styles.adminName}>{admin.name}</td>
              <td className={styles.RssData} id={styles.RssButton}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(admin.name)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
