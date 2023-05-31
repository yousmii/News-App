import React, { useEffect, useState, useRef } from "react";
import styles from "./modules/Article.module.scss";
import { ShareButton } from './ShareButton';
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";

function RenderArticles({ articles }: { articles: any }) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/@me", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUsername(response.data.username);
        } else {
          console.log("Not logged in");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(articles);
  }, [articles]);

  const TrackHistory = (link: string) => {
    const linkData = {
      link: link,
    };
    axios
      .put("/api/articles/view", linkData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.log(error);
      });
    if (username !== null) {
      axios
        .post("/api/history", linkData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (!Cookies.get("history_index")) {
        Cookies.set("history_index", "0");
      }
      let AddCookie: boolean = false;
      if (
        Cookies.get("history_" + Cookies.get("history_index")) === undefined
      ) {
        let array: string[] = [];
        Cookies.set(
          "history_" + Cookies.get("history_index"),
          JSON.stringify(array)
        );
      }
      let cookieValue = Cookies.get("history_" + Cookies.get("history_index"));
      if (typeof cookieValue === "string") {
        let Cookie_history = JSON.parse(cookieValue);
        Cookie_history.push(link);
        if (Cookie_history.length > 100) {
          AddCookie = true;
        }
        Cookies.set(
          "history_" + Cookies.get("history_index"),
          JSON.stringify(Cookie_history)
        );
      }
      let indexValue = Cookies.get("history_index");
      if (typeof indexValue === "string" && AddCookie) {
        let newIndex: string = indexValue + 1;
        Cookies.set("history_index", newIndex);
      }
    }
  };

  function dropDown(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    let menu = e.currentTarget.nextSibling as HTMLElement;
    if (menu?.hasAttribute("enabled")) {
      menu.removeAttribute("enabled");
    } else {
      menu?.setAttribute("enabled", "enabled");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.articlescontainer}>
        {articles.map(
          ({
            link,
            image,
            title,
            description,
            pub_date,
            similarArticles,
          }: {
            link: any;
            title: any;
            image: any;
            description: any;
            pub_date: any;
            similarArticles: any;
          }) => {
            return (
              <div
                key={link}
                onClick={() => TrackHistory(link)}
                className={styles.article}
              >
                <a
                  href={link}
                  target={"blank"}
                  className={styles.article__link}
                >
                  <div className={styles.article__content}>
                    <img
                      className={styles.article__img}
                      src={image !== null ? image : "img.png"}
                      alt={title}
                    />
                    <div className={styles.article__info}>
                      <div className={styles.article__sourcedata}>
                        <div className={styles.sources}>
                          <div>
                            <img
                              className={styles.favicon}
                              alt={"favicon"}
                              src={
                                "http://www.google.com/s2/favicons?domain=" + link
                              }
                            />
                          </div>
                          { similarArticles.length > 0 && (
                            <div id={styles.sourcesMenu}>
                              <div id={styles.alsoBy} onClick={(e) => dropDown(e)}>
                                <FontAwesomeIcon icon={faCaretDown} style={{color: "#1b3665",}} />
                              </div>
                              <div id={styles.extraSources}>
                                {similarArticles.length > 0 ?
                                    <div>
                                      {similarArticles.map((similarArticleId: any) => (
                                          <a id={styles.source}
                                            href={`${similarArticleId}`}
                                             key={similarArticleId}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <img
                                              src={
                                                "http://www.google.com/s2/favicons?domain=" +
                                                similarArticleId
                                              }
                                              alt="favicon"
                                              className={styles.favicon}
                                            />
                                          </a>
                                      ))}
                                    </div>
                                : null}
                              </div>
                            </div>)
                          }
                        </div>
                        <ShareButton url={link}/>
                        <p className={styles.time_ago}>
                          {moment(pub_date).fromNow()}
                        </p>
                      </div>
                      <div className={styles.articletext}>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.description}>{description}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default RenderArticles;
