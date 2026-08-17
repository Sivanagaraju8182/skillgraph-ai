import { useEffect, useState } from "react";
import {
  getDevelopers,
  getDeveloperSkills,
  getDeveloperTechnologies,
  getRecommendations,
} from "./api";
import GraphView from "./components/GraphView";

function App() {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [skills, setSkills] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        setError("");

        const data = await getDevelopers();

        setDevelopers(data);

        if (data.length > 0) {
          setSelectedDeveloper(data[0].name);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the graph database.");
      } finally {
        setLoadingDevelopers(false);
      }
    };

    loadDevelopers();
  }, []);

  useEffect(() => {
    if (!selectedDeveloper) {
      return;
    }

    const loadDeveloperData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [
          skillsData,
          technologiesData,
          recommendationsData,
        ] = await Promise.all([
          getDeveloperSkills(selectedDeveloper),
          getDeveloperTechnologies(selectedDeveloper),
          getRecommendations(selectedDeveloper),
        ]);

        setSkills(skillsData.skills || []);
        setTechnologies(technologiesData.technologies || []);
        setRecommendations(
          recommendationsData.recommendations || []
        );
      } catch (err) {
        console.error(err);

        setSkills([]);
        setTechnologies([]);
        setRecommendations([]);

        setError("Unable to load developer graph data.");
      } finally {
        setLoadingData(false);
      }
    };

    loadDeveloperData();
  }, [selectedDeveloper]);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">
            GRAPH DATABASE APPLICATION
          </p>

          <h1>SkillGraph AI</h1>

          <p className="subtitle">
            Explore connections between developers, skills,
            technologies, projects and job roles.
          </p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          CognoDB Connected
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="error">
            <strong>Connection Error</strong>
            <span>{error}</span>
          </div>
        )}

        <section className="selector-card">
          <div>
            <p className="section-label">Developer</p>
            <h2>Select a developer</h2>
          </div>

          {loadingDevelopers ? (
            <div className="loading">
              Loading developers...
            </div>
          ) : developers.length === 0 ? (
            <div className="empty">
              No developers available.
            </div>
          ) : (
            <select
              value={selectedDeveloper}
              onChange={(event) =>
                setSelectedDeveloper(event.target.value)
              }
            >
              {developers.map((developer) => (
                <option
                  key={developer.name}
                  value={developer.name}
                >
                  {developer.name}
                </option>
              ))}
            </select>
          )}
        </section>

        {loadingData ? (
          <div className="loading-card">
            <div className="spinner"></div>
            <p>Exploring graph relationships...</p>
          </div>
        ) : (
          <>
            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="section-label">
                    Relationships
                  </p>

                  <h2>Skills & Technologies</h2>
                </div>
              </div>

              <div className="grid two">
                <div className="card">
                  <h3>Skills</h3>

                  {skills.length === 0 ? (
                    <p className="muted">
                      No skills found.
                    </p>
                  ) : (
                    <div className="chips">
                      {skills.map((skill) => (
                        <span
                          className="chip"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3>Technologies</h3>

                  {technologies.length === 0 ? (
                    <p className="muted">
                      No technologies found.
                    </p>
                  ) : (
                    <div className="chips">
                      {technologies.map(
                        (technology) => (
                          <span
                            className="chip technology"
                            key={technology}
                          >
                            {technology}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="section-label">
                    Graph Traversal
                  </p>

                  <h2>
                    Project & Job Recommendations
                  </h2>
                </div>
              </div>

              {recommendations.length === 0 ? (
                <div className="empty-card">
                  No related projects or job roles found.
                </div>
              ) : (
                <div className="recommendations">
                  {recommendations.map(
                    (recommendation, index) => (
                      <div
                        className="recommendation-card"
                        key={`${recommendation.project}-${recommendation.jobRole}-${index}`}
                      >
                        <div className="recommendation-top">
                          <div>
                            <p className="section-label">
                              Project
                            </p>

                            <h3>
                              {recommendation.project}
                            </h3>
                          </div>

                          <span className="role">
                            {recommendation.jobRole}
                          </span>
                        </div>

                        <div>
                          <p className="technology-title">
                            Technologies
                          </p>

                          <div className="chips">
                            {recommendation.technologies.map(
                              (technology) => (
                                <span
                                  className="small-chip"
                                  key={technology}
                                >
                                  {technology}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            <section className="section">
              <div className="graph-card">
                <div>
                  <p className="section-label">
                    Interactive Graph
                  </p>

                  <h2>
                    Explore the relationship network
                  </h2>

                  <p className="graph-description">
                    This graph visualizes the connections
                    between the selected developer, their
                    skills, technologies and related job
                    roles.
                  </p>
                </div>

                <GraphView
                  developer={selectedDeveloper}
                  skills={skills}
                  technologies={technologies}
                  recommendations={recommendations}
                />
              </div>
            </section>

            <section className="section">
              <div className="graph-card">
                <div>
                  <p className="section-label">
                    Multi-Hop Traversal
                  </p>

                  <h2>How the graph connects</h2>

                  <p className="graph-description">
                    SkillGraph AI follows relationships across
                    multiple nodes to discover useful
                    connections.
                  </p>
                </div>

                <div className="graph-path">
                  <div className="graph-node">
                    <span>Developer</span>
                    <strong>
                      {selectedDeveloper}
                    </strong>
                  </div>

                  <div className="arrow">→</div>

                  <div className="graph-node">
                    <span>Skill</span>
                    <strong>
                      {skills[0] || "Skill"}
                    </strong>
                  </div>

                  <div className="arrow">→</div>

                  <div className="graph-node">
                    <span>Technology</span>
                    <strong>
                      {technologies[0] || "Technology"}
                    </strong>
                  </div>

                  <div className="arrow">→</div>

                  <div className="graph-node">
                    <span>Job Role</span>
                    <strong>
                      {recommendations[0]?.jobRole ||
                        "Job Role"}
                    </strong>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer>
        <p>
          SkillGraph AI • Powered by CognoDB + openCypher
        </p>
      </footer>
    </div>
  );
}

export default App;