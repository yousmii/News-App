import React, {Component} from "react";
import styles from "../components/Admin.module.scss";




export default function Admin() {
  class RSSForm extends Component {

    handleSubmit = (  e : React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("submitted");

      const body = e.target.body.value;

      fetch('post_rss', {
        method: "POST",
        body: JSON.stringify(body)
      }).then((response) => {
        console.log(response);
        return response.json(); // do something with response JSON
      });
  };

  }


  return (
    <div className={styles.container}>
      <div className={styles.forms}>
        <div className={styles.form}>
          <h1>Add new RSS Feed</h1>
          <form onSubmit={handleSubmit} method="post">
            <label>Feed URL:</label>
            <input
              title="feedurl"
              type="text"
              id="feed_url"
              name="feed_url"
              required
            />
            <br />
            <label>Feed Name:</label>
            <input
              title="feedname"
              type="text"
              id="feed_name"
              name="feed_name"
              required
            />
            <br />
            <div className={styles.buttons}>
              <input
                className={styles.button + " " + styles.add}
                type="submit"
                value="Add Feed"
              />
              <input
                className={styles.button + " " + styles.remove}
                type="submit"
                value="Delete Feed"
              />
            </div>
          </form>
        </div>
        <div className={styles.form}>
          <h1>Add new Admin</h1>
          <form method="post">
            <label>Username:</label>
            <input
              title="username"
              type="text"
              id="username"
              name="username"
              required
            />
            <br />
            <label>Password:</label>
            <input
              title="password"
              type="password"
              id="password"
              name="password"
              required
            />
            <br />
            <div className={styles.buttons}>
              <input
                className={styles.button + " " + styles.add}
                type="submit"
                value="Add Admin"
              />
              <input
                className={styles.button + " " + styles.remove}
                type="submit"
                value="Delete Admin"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
