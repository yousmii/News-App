import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Component, useEffect, useState } from "react";
import { BiPlus, BiPlusCircle, BiRss } from "react-icons/bi";
import { BsRssFill } from "react-icons/bs";
import AdminNavbar from "../components/AdminNavbar";
import styles from "../components/SubAdmin.module.scss";

export default function RSS() {
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
      <h1 className={styles.title}>RSS Feeds</h1>
      <div className={styles.container}>
        <RSSForm />
        <RssTable />
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

    const formData = { feed_name: feedName, feed_url: feedUrl };

    fetch("../api/rss", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        // RSS feed was successfully added
        window.location.href = "/admin/rss";
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
      <div className={styles.formcontainer}>
        <h2 className={styles.heading}>Add new RSS Feed</h2>
        <form
          className={styles.form}
          onSubmit={this.handleSubmit}
          method="post"
        >
          <label className={styles.label}>Feed URL:</label>
          <input
            className={styles.input}
            title="feedurl"
            type="text"
            id="feed_url"
            name="feed_url"
            required
          />
          <label className={styles.label}>Feed Name:</label>
          <input
            className={styles.input}
            title="feedname"
            type="text"
            id="feed_name"
            name="feed_name"
            required
          />
          <input className={styles.button} type="submit" value="Add Feed" />
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

  useEffect(() => {
    fetch("/api/rss")
      .then((response) => response.json())
      .then((data) => setRssFeeds(data));
  }, []);

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/rss`, {
        params: {
          delete_id: id,
        },
      })
      .then((response) => {
        if (response.data["status"] == 200) {
          setRssFeeds(rssFeeds.filter((rssFeed) => rssFeed.id !== id));
          alert(response.data["message"]);
        } else {
          alert(response.data["message"]);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={styles.form}>
      <h1>RSS Table</h1>
      <div>
        <table>
          <thead>
            <tr className={styles.RssRow}>
              <th id={styles.name}>Name</th>
              <th id={styles.url}>URL</th>
            </tr>
          </thead>
          <tbody>
            {rssFeeds.map((rssFeed) => (
              <tr key={rssFeed.id} className={styles.RssRow} id={styles.feeds}>
                <td className={styles.RssData} id={styles.feedName}>
                  {rssFeed.name}
                </td>
                <td className={styles.RssData} id={styles.feedUrl}>
                  {rssFeed.url}
                </td>
                <td className={styles.RssData} id={styles.RssButton}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(rssFeed.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
