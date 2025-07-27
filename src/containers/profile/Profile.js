import React, { useState, useEffect, lazy, Suspense } from "react";
import { openSource } from "../../portfolio";
import Contact from "../contact/Contact";
import Loading from "../loading/Loading";

const renderLoader = () => <Loading />;
const GithubProfileCard = lazy(() =>
  import("../../components/githubProfileCard/GithubProfileCard")
);

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/profile.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        setProfile(json.data.user);
      } catch (error) {
        console.error(
          `${error} (GitHub contact section fallback triggered. Contact section will display default content.)`
        );
        setProfile("Error");
        openSource.showGithubProfile = "false"; // fall back to default contact
      }
    };

    if (openSource.showGithubProfile === "true") {
      fetchProfileData();
    }
  }, []);

  if (
    openSource.display &&
    openSource.showGithubProfile === "true" &&
    profile &&
    typeof profile !== "string"
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <GithubProfileCard prof={profile} key={profile.id} />
      </Suspense>
    );
  } else {
    return <Contact />;
  }
}
