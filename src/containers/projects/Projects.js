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
  const {isDark} = useContext(StyleContext); // You can keep this if dark mode context is needed

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch("/profile.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        setRepos(json.data.user.pinnedItems.edges);
      } catch (error) {
        console.error(
          `${error} (Projects section failed. Check if /profile.json exists and is correctly structured.)`
        );
        setRepos("Error");
      }
    };

    fetchRepoData();
  }, []);

  if (
    !(typeof repos === "string" || repos instanceof String) &&
    openSource.display
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="opensource">
          <h1 className="project-title">Open Source Projects</h1>
          <div className="repo-cards-div-main">
            {repos.map((v, i) => {
              if (!v) {
                console.error(`Repository at index ${i} is undefined.`);
                return null;
              }
              return (
                <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />
              );
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
  } else {
    return <FailedLoading />;
  }
}
