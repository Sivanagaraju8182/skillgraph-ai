import { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";

function GraphView({
  developer,
  skills,
  technologies,
  recommendations,
}) {
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];

    const nodeMap = new Map();

    const addNode = (id, label, type) => {
      if (!nodeMap.has(id)) {
        const node = {
          id,
          label,
          type,
        };

        nodeMap.set(id, node);
        nodes.push(node);
      }
    };

    const addLink = (source, target) => {
      const exists = links.some(
        (link) =>
          link.source === source &&
          link.target === target
      );

      if (!exists) {
        links.push({
          source,
          target,
        });
      }
    };

    // Developer
    const developerId = `developer-${developer}`;

    addNode(
      developerId,
      developer,
      "Developer"
    );

    // Skills
    skills.forEach((skill) => {
      const skillId = `skill-${skill}`;

      addNode(
        skillId,
        skill,
        "Skill"
      );

      addLink(
        developerId,
        skillId
      );
    });

    // Technologies
    technologies.forEach((technology) => {
      const technologyId = `technology-${technology}`;

      addNode(
        technologyId,
        technology,
        "Technology"
      );

      const relatedSkills = skills.filter(
        (skill) => {
          if (
            skill === "React" &&
            technology === "React.js"
          ) {
            return true;
          }

          if (
            skill === "JavaScript" &&
            technology === "React.js"
          ) {
            return true;
          }

          if (
            skill === "Node.js" &&
            technology === "Node.js"
          ) {
            return true;
          }

          if (
            skill === "SQL" &&
            technology === "PostgreSQL"
          ) {
            return true;
          }

          if (
            skill === "Python" &&
            technology === "TensorFlow"
          ) {
            return true;
          }

          if (
            skill === "Machine Learning" &&
            technology === "TensorFlow"
          ) {
            return true;
          }

          if (
            skill === "Java" &&
            technology === "Spring Boot"
          ) {
            return true;
          }

          return false;
        }
      );

      relatedSkills.forEach((skill) => {
        addLink(
          `skill-${skill}`,
          technologyId
        );
      });
    });

    // Projects and Job Roles
    recommendations.forEach(
      (recommendation) => {
        const projectId = `project-${recommendation.project}`;

        addNode(
          projectId,
          recommendation.project,
          "Project"
        );

        // Developer → Project
        addLink(
          developerId,
          projectId
        );

        // Project → Technology
        recommendation.technologies.forEach(
          (technology) => {
            const technologyId =
              `technology-${technology}`;

            if (
              nodeMap.has(technologyId)
            ) {
              addLink(
                projectId,
                technologyId
              );
            }
          }
        );

        // Project → Job Role
        const roleId =
          `role-${recommendation.jobRole}`;

        addNode(
          roleId,
          recommendation.jobRole,
          "Job Role"
        );

        addLink(
          projectId,
          roleId
        );
      }
    );

    return {
      nodes,
      links,
    };
  }, [
    developer,
    skills,
    technologies,
    recommendations,
  ]);

  const getNodeColor = (type) => {
    switch (type) {
      case "Developer":
        return "#586ed0";

      case "Skill":
        return "#7b61c9";

      case "Technology":
        return "#238b70";

      case "Project":
        return "#d18b28";

      case "Job Role":
        return "#c45b75";

      default:
        return "#68748a";
    }
  };

  return (
    <div className="graph-visualization">
      <ForceGraph2D
        graphData={graphData}
        width={900}
        height={500}
        backgroundColor="#ffffff"
        nodeLabel={(node) =>
          `${node.type}: ${node.label}`
        }
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.08}
        cooldownTicks={100}
        d3VelocityDecay={0.35}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        nodeCanvasObject={(
          node,
          ctx,
          globalScale
        ) => {
          const label = node.label;

          const fontSize = Math.max(
            11 / globalScale,
            3
          );

          const radius =
            node.type === "Developer"
              ? 8
              : 6;

          ctx.beginPath();

          ctx.arc(
            node.x,
            node.y,
            radius,
            0,
            2 * Math.PI
          );

          ctx.fillStyle =
            getNodeColor(node.type);

          ctx.fill();

          ctx.strokeStyle =
            "#ffffff";

          ctx.lineWidth = 1.5;

          ctx.stroke();

          ctx.font =
            `600 ${fontSize}px Sans-Serif`;

          ctx.textAlign = "center";

          ctx.textBaseline = "top";

          ctx.fillStyle =
            "#172033";

          ctx.fillText(
            label,
            node.x,
            node.y + radius + 3
          );
        }}
      />
    </div>
  );
}

export default GraphView;