import React, {Component, useEffect, useState} from "react";
import styles from "../components/Admin.module.scss";
import axios from "axios";

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
                    alert("Not an admin");
                    // window.location.href = "/";
                } else if (response.data.status !== 200) {
                    alert("Not logged in");
                    // window.location.href = "/";
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // prevent unauthorized access to admin page

    return (
        <div className={styles.container}>
            <RSSForm/>
            <RegisterFormAdmin/>
            <RssTable/>
            <AdminTable/>
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

        fetch("api/post_rss", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
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
            <div className={[styles.form, styles.noScroll].join(' ')}>
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

// class AdminForm extends Component {
//     handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         console.log("submitted");
//
//         const adminName = e.target.username.value;
//         const adminPassword = e.target.password.value;
//
//         const formData = {admin_name: adminName, admin_password: adminPassword};
//
//         fetch('api/post_admin', {
//             method: "POST",
//             body: JSON.stringify(formData),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => {
//             console.log(response);
//             if (response.ok) {
//                 // RSS feed was successfully added
//                 alert("Admin was successfully added to the database!");
//             } else {
//                 // Display error message to user
//                 response.text().then((errorMessage) => {
//                     alert("There was an error adding the admin: " + errorMessage);
//                 });
//             }
//             return response.json();
//         });
//     };
//
//     render() {
//         return (
//             <div className={styles.form}>
//                 <h1>Add new Admin</h1>
//                 <form onSubmit={this.handleSubmit} method="post">
//                     <label>Username:</label>
//                     <input
//                         title="username"
//                         type="text"
//                         id="username"
//                         name="username"
//                         required
//                     />
//                     <br/>
//                     <label>Password:</label>
//                     <input
//                         title="password"
//                         type="password"
//                         id="password"
//                         name="password"
//                         required
//                     />
//                     <br/>
//                     <input
//                         className={styles.button + " " + styles.add}
//                         type="submit"
//                         value="Add Admin"
//                     />
//                 </form>
//             </div>
//         );
//     }
// }

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
            .post("/api/registerAdmin", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                window.location.href = "/admin";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className={[styles.form, styles.noScroll].join(' ')}>
            <h1>Admin</h1>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="csrf_token" value={csrfToken}/>
                <label>Username:</label>
                <input type="text" name="username"/>
                <br/>
                <label>Email address:</label>
                <input type="email" name="email_address"/>
                <br/>
                <label>Password:</label>
                <input type="password" name="password1"/>
                <br/>
                <label>Confirm password:</label>
                <input type="password" name="password2"/>
                <br/>
                <input className={styles.button} type="submit" value="Register"/>
            </form>
        </div>
    );
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
    }, []);

    const handleDelete = () => {
        if (deleteId) {
            axios
                .get(`/api/delete_feed`, {
                    params: {
                        delete_id: deleteId,
                    },
                })
                .then((response) => {
                    if (response.data["status"] == 200) {
                        setRssFeeds(rssFeeds.filter((rssFeed) => rssFeed.id !== deleteId));
                        setDeleteId(undefined);
                        alert(response.data["message"]);
                    } else {
                        alert(response.data["message"]);
                    }
                })
                .catch((error) => console.error(error));
        }
    };

    return (
        <div className={styles.form}>
            <h1>RSS Table</h1>
            <div>
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
            </div>
            <label htmlFor="deleteId">Delete Feed by ID:</label>
            <input
                type="number"
                id="deleteId"
                value={deleteId ?? ""}
                onChange={(event) => setDeleteId(parseInt(event.target.value))}
            />
            <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
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
            axios
                .get(`/api/delete_admin`, {
                    params: {
                        delete_name: deleteName,
                    },
                })
                .then((response) => {
                    if (response.data["status"] == 200) {
                        setAdmins(admins.filter((admin) => admin.name !== deleteName));
                        setDeleteName(undefined);
                        alert(response.data["message"]);
                    } else {
                        alert(response.data["message"]);
                    }
                })
                .catch((error) => console.error(error));
        }
    };

    return (
        <div className={styles.form}>
            <h1>Admin Table</h1>
            <table>
                <thead>
                <tr>
                    <th>name</th>
                </tr>
                </thead>
                <tbody>
                {admins.map((admin) => (
                    <tr key={admin.name}>
                        <td>{admin.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <label htmlFor="deleteName">Delete Admin by Name:</label>
            <input
                type="string"
                id="deleteName"
                value={deleteName ?? ""}
                onChange={(event) => setDeleteName(event.target.value as string)}
            />
            <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
        </div>
    );
};
