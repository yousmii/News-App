import React, {Component, useEffect, useState} from "react";
import styles from "../components/Admin.module.scss";

export default function Admin() {
    return (
        <div className={styles.container}>
            <div className={styles.forms}>
                <RSSForm/>
                <AdminForm/>
                <RssTable/>
                <AdminTable/>
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

interface RSSFeed {
    id: number;
    url: string;
    name: string;
}

const RssTable: React.FC = () => {
    const [rssFeeds, setRssFeeds] = useState<RSSFeed[]>([]);
    const [deleteId, setDeleteId] = useState<number>();


    useEffect(() => {
        fetch("/api/rss")
            .then((response) => response.json())
            .then((data) => setRssFeeds(data));
    }, [])

    const handleDelete = () => {
        if (deleteId) {
            fetch(`/api/delete_rss`, {method: "DELETE"})
                .then((response) => {
                    if (response.ok) {
                        setRssFeeds(rssFeeds.filter((feed) => feed.id !== deleteId));
                        setDeleteId(undefined);
                    }
                })
                .catch((error) => console.error(error));
        }
    };


    return (
        <div>
            <h1>RSS Table</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>URL</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {rssFeeds.map((rssFeed) => (
                    <tr key={rssFeed.id}>
                        <td>{rssFeed.id}</td>
                        <td>{rssFeed.url}</td>
                        <td>{rssFeed.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <label htmlFor="deleteId">Delete Feed by ID:</label>
            <input
                type="number"
                id="deleteId"
                value={deleteId ?? ""}
                onChange={(event) => setDeleteId(parseInt(event.target.value))}
            />
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

interface AdminInterface {
    name: string;
    password: string;
    cookie_id: string;
}

const AdminTable: React.FC = () => {
    const [admins, setAdmins] = useState<AdminInterface[]>([]);
    const [deleteName, setDeleteName] = useState<string>();


    useEffect(() => {
        fetch("/api/admins")
            .then((response) => response.json())
            .then((data) => setAdmins(data));
    }, []);

    const handleDelete = () => {
        if (deleteName) {
            fetch(`/api/delete_admin`, {method: "DELETE"})
                .then((response) => {
                    if (response.ok) {
                        setAdmins(admins.filter((admin) => admin.name !== deleteName));
                        setDeleteName(undefined);
                    }
                })
                .catch((error) => console.error(error));
        }
    };

    return (
        <div>
            <h1>Admin Table</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>URL</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {admins.map((admin) => (
                    <tr key={admin.name}>
                        <td>{admin.name}</td>
                        <td>{admin.password}</td>
                        <td>{admin.cookie_id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <label htmlFor="deleteName">Delete Admin by Name:</label>
            <input
                type="string"
                id="deleteName"
                value={deleteName ?? ""}
                onChange={(event) => setDeleteName(parseInt(event.target.value))}
            />
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};



