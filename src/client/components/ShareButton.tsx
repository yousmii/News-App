import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import styles from "./modules/ShareButton.module.scss";

export const ShareButton = ({ url } : { url:string } ) => {
  const [isCopied, setIsCopied] = useState(false);

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className={styles.shareButtons}>
      <button onClick={shareOnFacebook} className={styles.shareButton}>
        <FontAwesomeIcon icon={faFacebook} />
      </button>
      <button onClick={shareOnTwitter} className={styles.shareButton}>
        <FontAwesomeIcon icon={faTwitter} />
      </button>
      <button onClick={copyToClipboard} className={styles.shareButton}>
        <FontAwesomeIcon icon={faCopy} data-tip="Copy to Clipboard" />
      </button>
    </div>
  );
};
