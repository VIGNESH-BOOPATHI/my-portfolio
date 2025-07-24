import React, { Suspense, useContext, useEffect, useState } from "react";
import "./twitter.scss";
import Loading from "../loading/Loading";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { twitterDetails } from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";

export default function Twitter() {
  const { isDark } = useContext(StyleContext);
  const [shouldShowFallback, setShouldShowFallback] = useState(false);

  const renderLoader = () => <Loading />;

  useEffect(() => {
    // Timeout to detect if iframe failed
    const timer = setTimeout(() => {
      const twitterDiv = document.getElementById("twitter");
      if (
        twitterDiv &&
        !twitterDiv.querySelector("iframe") &&
        !twitterDiv.querySelector(".twitter-timeline")
      ) {
        setShouldShowFallback(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!twitterDetails.display || !twitterDetails.userName) {
    return null;
  }

  return (
    <Suspense fallback={renderLoader()}>
      <div className="tw-main-div" id="twitter">
        <div className="centerContent">
          {shouldShowFallback ? (
            <div className="error-message">
              <h2>🚫 Unable to load Twitter timeline.</h2>
              <p>
                Check your privacy settings, network restrictions, or disable any ad blockers.
              </p>
            </div>
          ) : (
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName={twitterDetails.userName}
              options={{
                height: 400,
                width: window.innerWidth < 600 ? 320 : 550
              }}
              placeholder={renderLoader()}
              autoHeight={false}
              borderColor={isDark ? "#fff" : "#000"}
              key={isDark ? "dark" : "light"}
              theme={isDark ? "dark" : "light"}
              noFooter={true}
              noScrollbar={true}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}
