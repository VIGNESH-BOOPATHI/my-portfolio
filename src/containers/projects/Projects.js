import React, { useState, useEffect, useContext, Suspense, lazy } from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import { openSource, socialMediaLinks } from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";
import axios from "axios";

export default function Projects() {
  const GithubRepoCard = lazy(() =>
    import("../../components/githubRepoCard/GithubRepoCard")
  );
  const FailedLoading = () => null;
  const renderLoader = () => <Loading />;
  const [repo, setRepo] = useState([]);
  const { isDark } = useContext(StyleContext);

  useEffect(() => {
    const fetchPinnedRepos = async () => {
      try {
        const username = process.env.REACT_APP_GITHUB_USERNAME;
        const token = process.env.REACT_APP_GITHUB_TOKEN;

        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const response = await axios.post(
          "https://api.github.com/graphql",
          {
            query: `
              query {
                user(login: "${username}") {
                  pinnedItems(first: 6, types: [REPOSITORY]) {
                    edges {
                      node {
                        ... on Repository {
                          id
                          name
                          description
                          url
                          forkCount
                          stargazers {
                            totalCount
                          }
                          diskUsage
                          primaryLanguage {
                            name
                            color
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
          },
          { headers }
        );

        setRepo(response.data.data.user.pinnedItems.edges);
      } catch (error) {
        console.error(
          `${error} (Projects section failed to load. Also check API token permissions or GraphQL query.)`
        );
        setRepo("Error");
      }
    };

    fetchPinnedRepos();
  }, []);

  if (
    !(typeof repo === "string" || repo instanceof String) &&
    openSource.display
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="opensource">
          <h1 className="project-title">Open Source Projects</h1>
          <div className="repo-cards-div-main">
            {repo.map((v, i) => {
              if (!v) {
                console.error(`Repo #${i} is undefined`);
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
