import React, {useState, useEffect, useContext, Suspense, lazy} from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import {openSource, socialMediaLinks} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";

const GithubRepoCard = lazy(
  () => import("../../components/githubRepoCard/GithubRepoCard")
);
const FailedLoading = () => null;
const renderLoader = () => <Loading />;

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const {isDark} = useContext(StyleContext);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + "/profile.json");
        if (!response.ok) throw new Error("Failed to fetch profile.json");
        const json = await response.json();
        setRepos(json.data.user.pinnedItems.edges);
      } catch (error) {
        console.error("❌ Projects section failed to load:", error);
        setRepos("Error");
      }
    };

    fetchRepoData();
  }, []);

  if (typeof repos === "string" || !openSource.display) {
    return <FailedLoading />;
  }

  return (
    <Suspense fallback={renderLoader()}>
      <div className="main" id="opensource">
        <h1 className="project-title">Open Source Projects</h1>
        <div className="repo-cards-div-main">
          {repos.map((v, i) => {
            if (!v || !v.node) return null;
            return <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />;
          })}
        </div>
        <Button
          text="More Projects"
          className="project-button"
          href={socialMediaLinks.github}
          newTab={true}
        />
      </div>
    </Suspense>
  );
}
