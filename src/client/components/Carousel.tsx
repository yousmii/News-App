import React, {useEffect, useRef, useState} from 'react';
import styles from './Carousel.module.scss';
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


type CarouselProps = {
  handleFilter: (label: string) => void;
};

function Carousel({ handleFilter }: CarouselProps) {
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/labels');
        if (response.status === 200) {
          setLabels(response.data);
        } else {
          console.log('Could not get labels');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false regardless of the API call result
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (loading) {
      return;
    }
    const labelsContainer = labelsContainerRef.current!;
    const labelsList = labelsContainer.querySelector(`.${styles.labelList}`);
    const labelWidth = 100; // Set the width of each label item
    let currentPosition = labelsContainer.scrollLeft;


    // Function to scroll the labels to the left or right
    const scrollLabels = (direction: 'left' | 'right') => {
      if (direction === 'left') {
        currentPosition = currentPosition - (labelWidth * 4);
        if (currentPosition < 0) {
          currentPosition = 0;
        }
        labelsContainer.scrollTo({
          left: currentPosition,
          behavior: 'smooth',
        });
      } else if (direction === 'right') {
        currentPosition = currentPosition + (labelWidth * 4);
        if (currentPosition > (labelsList?.scrollWidth || 0)) {
          currentPosition = (labelsList?.scrollWidth || 0);
        }
        labelsContainer.scrollTo({
          left: currentPosition,
          behavior: 'smooth',
        });
      }

      // Show or hide the navigation buttons based on the scroll position
      updateNavigation();
    };

    // Function to show or hide the navigation buttons based on scroll position
    const updateNavigation = () => {
      const containerWidth = labelsContainer.offsetWidth;
      const listWidth = labelsList?.scrollWidth || 0;

      const leftButton = document.getElementById(styles.left_button);
      const rightButton = document.getElementById(styles.right_button);

      if (leftButton && (currentPosition === 0)) {
        leftButton.style.opacity = "0.3";
        leftButton.setAttribute("disabled","disabled")
      } else if (leftButton) {
          leftButton.style.opacity = "1";
          leftButton.removeAttribute('disabled')
      }

      if (rightButton && ((currentPosition + containerWidth) >= listWidth)) {
        rightButton.style.opacity = "0.3";
        rightButton.setAttribute("disabled","disabled")
      } else if(rightButton) {
          rightButton.style.opacity = "1";
          rightButton.removeAttribute('disabled')
      }
    };

    // Populate the labels in the DOM
    const labelsListElement = labelsList as HTMLUListElement;
    labels.forEach((label: string) => {
      const buttonItem = document.createElement('button');
      buttonItem.textContent = label;
      buttonItem.className = styles.label;
      buttonItem.onclick = () => handleFilter(label);
      labelsListElement?.appendChild(buttonItem);
    });

    // Show or hide the navigation buttons based on the number of labels
    updateNavigation();

    // Attach event listeners to the buttons
    const leftButton = document.getElementById(styles.left_button);
    const rightButton = document.getElementById(styles.right_button);

    const handleLeftClick = () => {
      scrollLabels('left');
    };

    const handleRightClick = () => {
      scrollLabels('right');
    };

    if (leftButton) {
      leftButton.addEventListener('click', handleLeftClick);
    }

    if (rightButton) {
      rightButton.addEventListener('click', handleRightClick);
    }

    return () => {
      // Clean up event listeners when the component unmounts
      if (leftButton) {
        leftButton.removeEventListener('click', handleLeftClick);
      }

      if (rightButton) {
        rightButton.removeEventListener('click', handleRightClick);
      }
    };
  }, [labels]);

  return (
    <div className={styles.carousel}>
      <button id={styles.left_button}>
        <FontAwesomeIcon icon={faArrowRight} rotation={180} style={{color: "#153a7a",}} />
      </button>
      <div className={styles.labelsContainer} ref={labelsContainerRef}>
        <ul className={styles.labelList}>

        </ul>
      </div>
      <button id={styles.right_button} disabled={loading || !labels.length}>
        <FontAwesomeIcon icon={faArrowRight} style={{color: "#153a7a",}} />
      </button>
    </div>
  );
}

export default Carousel;


