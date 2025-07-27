import React, { useState, useEffect, lazy, Suspense } from "react";
import { openSource } from "../../portfolio";
import Contact from "../contact/Contact";
import Loading from "../loading/Loading";

const GithubProfileCard = lazy(() =>
  import("../../components/githubProfileCard/GithubProfileCard")
);

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(
    openSource.showGithubProfile === "true"
  );

  useEffect(() => {
    if (!showProfile) return;

    const fetchProfileData = async () => {
      try {
        const response = await fetch("/profile.json");
        if (!response.ok) throw new Error("Failed to fetch profile.json");
        const json = await response.json();
        setProfile(json?.data?.user || null);
      } catch (error) {
        console.error(
          `${error} (GitHub contact section fallback triggered. Default Contact section will be used.)`
        );
        setShowProfile(false);
      }
    };

    fetchProfileData();
  }, [showProfile]);

  if (
    openSource.display &&
    showProfile &&
    profile &&
    typeof profile === "object"
  ) {
    return (
      <Suspense fallback={<Loading />}>
        <GithubProfileCard prof={profile} key={profile.id} />
      </Suspense>
    );
  }

  return <Contact />;
}
