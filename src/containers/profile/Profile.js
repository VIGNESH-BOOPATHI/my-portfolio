import React, {useState, useEffect, lazy, Suspense} from "react";
import Contact from "../contact/Contact";
import Loading from "../loading/Loading";

const GithubProfileCard = lazy(
  () => import("../../components/githubProfileCard/GithubProfileCard")
);
const renderLoader = () => <Loading />;

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/profile.json`)
      .then(res => {
        if (!res.ok) throw new Error("Could not load profile.json");
        return res.json();
      })
      .then(data => {
        setProfile(data.data.user);
      })
      .catch(err => {
        console.error("❌ GitHub profile load failed:", err);
        setProfile("Error");
      });
  }, []);

  return (
    <>
      {profile && typeof profile !== "string" && (
        <section>
          <Suspense fallback={renderLoader()}>
            <GithubProfileCard
              prof={profile}
              key={profile.id || profile.name}
            />
          </Suspense>
        </section>
      )}
      <section>
        <Contact />
      </section>
    </>
  );
}
