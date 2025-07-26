import React, {useState, useEffect, lazy, Suspense} from "react";
import {openSource} from "../../portfolio";
import Contact from "../contact/Contact";
import Loading from "../loading/Loading";
import axios from "axios";

const renderLoader = () => <Loading />;
const GithubProfileCard = lazy(
  () => import("../../components/githubProfileCard/GithubProfileCard")
);

export default function Profile() {
  const [prof, setRepo] = useState(null);

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      try {
        const username = process.env.REACT_APP_GITHUB_USERNAME;
        const token = process.env.REACT_APP_GITHUB_TOKEN;

        const headers = token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {};

        const response = await axios.post(
          "https://api.github.com/graphql",
          {
            query: `
              query {
                user(login: "${username}") {
                  name
                  bio
                  location
                  avatarUrl
                  url
                  isHireable
                }
              }
            `
          },
          {headers}
        );

        setRepo(response.data.data.user);
      } catch (error) {
        console.error(
          `${error} (GitHub API failed — falling back to default contact only)`
        );
        setRepo("Error");
      }
    };

    if (openSource.showGithubProfile === "true") {
      fetchGitHubProfile();
    }
  }, []);

  return (
    <>
      {openSource.display &&
        openSource.showGithubProfile === "true" &&
        prof &&
        !(typeof prof === "string" || prof instanceof String) && (
          <Suspense fallback={renderLoader()}>
            <GithubProfileCard prof={prof} key={prof.id} />
          </Suspense>
        )}
      <Contact />
    </>
  );
}
