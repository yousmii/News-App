import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/modules/Searchbar.module.scss";
import moment from "moment";
import * as Loader from "react-loader-spinner";
import { BsFilter, BsSearch, BsTriangle, BsTriangleFill } from "react-icons/bs";
import Carousel from "../components/Carousel";

import Scroller from "../components/InfiteScroller";

function toggleLabel(labelArray: string[], label: string): string[] {
  const index = labelArray.indexOf(label);

  if (index > -1) {
    // Label found, remove it
    labelArray.splice(index, 1);
  } else {
    // Label not found, add it
    labelArray.push(label);
  }
  console.log("toggle");
  return labelArray;
}

export default function Homepage() {
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [finalQuery, setFinalQuery] = useState<string>("");
  const [sort, setSort] = useState<string>("Recency");
  const [activeLabels, setActiveLabels] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, []);

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

  const handleFilter = (labelFilter: string) => {
    let temp = toggleLabel(activeLabels, labelFilter);
    setActiveLabels([]);
    setActiveLabels((prevState) => prevState.concat(temp));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setFinalQuery(searchQuery);
    }
  };

  const onChange = (event: any) => {
    const value = event.target.value;
    setSort(value);
  };

  return (
    <div>
      <div className={styles.filteringContainer}>
        {/* Search Bar */}
        <div className={styles.searchBarContainer}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.searchBar}
          />
          <BsSearch className={styles.searchIcon} />
        </div>

        {/* Sort By */}
        <div className={styles.sortBy}>
          <select
            value={sort}
            className={styles.sortBySelect}
            onChange={onChange}
          >
            <option className={styles.sortOption} value="Recency">
              <p>Recent</p>
            </option>
            <option className={styles.sortOption} value="Popularity">
              <p>Trending</p>
            </option>
            {username ? (
              <option className={styles.sortOption} value="Recommended">
                <p>Recommended</p>
              </option>
            ) : null}
          </select>
          <BsFilter className={styles.sortIcon} />
        </div>
      </div>

      {/* Labels */}
      <div className={styles.carouselContainer}>
        <Carousel handleFilter={handleFilter} />
      </div>

      {/* Articles */}
      <div>
        <Scroller labels={activeLabels} sort={sort} query={finalQuery} />
      </div>
    </div>
  );
}
