import React, {Component} from "react";
import styles from "../components/Admin.module.scss";

export default function Admin() {
    return (
        <div className={styles.container}>
            <div className={styles.forms}>
                <RSSForm/>
                <AdminForm/>
            </div>
        </div>
    );
}

class RSSForm extends Component {
    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitted");

        const feedName = e.target.feed_name.value;
        const feedUrl = e.target.feed_url.value;

        const formData = {feed_name: feedName, feed_url: feedUrl};

        fetch('api/post_rss', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response);
            if (response.ok) {
                // RSS feed was successfully added
                alert("RSS feed was successfully added to the database!");
            } else {
                // Display error message to user
                response.text().then((errorMessage) => {
                    alert("There was an error adding the RSS feed: " + errorMessage);
                });
            }
            return response.json();
        });
    };


    render() {
        return (
            <div className={styles.form}>
                <h1>Add new RSS Feed</h1>
                <form onSubmit={this.handleSubmit} method="post">
                    <label>Feed URL:</label>
                    <input
                        title="feedurl"
                        type="text"
                        id="feed_url"
                        name="feed_url"
                        required
                    />
                    <br/>
                    <label>Feed Name:</label>
                    <input
                        title="feedname"
                        type="text"
                        id="feed_name"
                        name="feed_name"
                        required
                    />
                    <br/>
                    <input
                        className={styles.button + " " + styles.add}
                        type="submit"
                        value="Add Feed"
                    />
                </form>
            </div>
        );
    }
}

class AdminForm extends Component {
    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitted");

        const adminName = e.target.username.value;
        const adminPassword = e.target.password.value;

        const formData = {admin_name: adminName, admin_password: adminPassword};

        fetch('api/post_admin', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response);
            if (response.ok) {
                // RSS feed was successfully added
                alert("Admin was successfully added to the database!");
            } else {
                // Display error message to user
                response.text().then((errorMessage) => {
                    alert("There was an error adding the admin: " + errorMessage);
                });
            }
            return response.json();
        });
    };

    render() {
        return (
            <div className={styles.form}>
                <h1>Add new Admin</h1>
                <form onSubmit={this.handleSubmit} method="post">
                    <label>Username:</label>
                    <input
                        title="username"
                        type="text"
                        id="username"
                        name="username"
                        required
                    />
                    <br/>
                    <label>Password:</label>
                    <input
                        title="password"
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                    <br/>
                    <input
                        className={styles.button + " " + styles.add}
                        type="submit"
                        value="Add Admin"
                    />
                </form>
            </div>
        );
    }
}
