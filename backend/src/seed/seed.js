const driver = require("../config/database");

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Clearing existing graph data...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating graph data...");

    await session.run(`
      CREATE
        (j:Developer {name: "Jagadeesh"}),
        (rahul:Developer {name: "Rahul"}),
        (priya:Developer {name: "Priya"}),
        (anjali:Developer {name: "Anjali"}),

        (js:Skill {name: "JavaScript"}),
        (python:Skill {name: "Python"}),
        (react:Skill {name: "React"}),
        (node:Skill {name: "Node.js"}),
        (sql:Skill {name: "SQL"}),
        (ml:Skill {name: "Machine Learning"}),
        (java:Skill {name: "Java"}),

        (reactTech:Technology {name: "React.js"}),
        (nodeTech:Technology {name: "Node.js"}),
        (postgres:Technology {name: "PostgreSQL"}),
        (mongo:Technology {name: "MongoDB"}),
        (tensorflow:Technology {name: "TensorFlow"}),
        (spring:Technology {name: "Spring Boot"}),

        (fraud:Project {name: "Fraud Detection System"}),
        (emergency:Project {name: "Emergency Response Platform"}),
        (ecommerce:Project {name: "E-Commerce Platform"}),
        (health:Project {name: "AI Health Prediction"}),

        (fullstack:JobRole {name: "Full Stack Developer"}),
        (backend:JobRole {name: "Backend Developer"}),
        (frontend:JobRole {name: "Frontend Developer"}),
        (mlEngineer:JobRole {name: "Machine Learning Engineer"}),
        (javaDeveloper:JobRole {name: "Java Developer"})
    `);

    await session.run(`
      MATCH
        (j:Developer {name: "Jagadeesh"}),
        (rahul:Developer {name: "Rahul"}),
        (priya:Developer {name: "Priya"}),
        (anjali:Developer {name: "Anjali"}),

        (js:Skill {name: "JavaScript"}),
        (python:Skill {name: "Python"}),
        (react:Skill {name: "React"}),
        (node:Skill {name: "Node.js"}),
        (sql:Skill {name: "SQL"}),
        (ml:Skill {name: "Machine Learning"}),
        (java:Skill {name: "Java"}),

        (reactTech:Technology {name: "React.js"}),
        (nodeTech:Technology {name: "Node.js"}),
        (postgres:Technology {name: "PostgreSQL"}),
        (mongo:Technology {name: "MongoDB"}),
        (tensorflow:Technology {name: "TensorFlow"}),
        (spring:Technology {name: "Spring Boot"}),

        (fraud:Project {name: "Fraud Detection System"}),
        (emergency:Project {name: "Emergency Response Platform"}),
        (ecommerce:Project {name: "E-Commerce Platform"}),
        (health:Project {name: "AI Health Prediction"}),

        (fullstack:JobRole {name: "Full Stack Developer"}),
        (backend:JobRole {name: "Backend Developer"}),
        (frontend:JobRole {name: "Frontend Developer"}),
        (mlEngineer:JobRole {name: "Machine Learning Engineer"}),
        (javaDeveloper:JobRole {name: "Java Developer"})

      CREATE
        // Developer → Skill
        (j)-[:HAS_SKILL]->(js),
        (j)-[:HAS_SKILL]->(react),
        (j)-[:HAS_SKILL]->(node),
        (j)-[:HAS_SKILL]->(sql),
        (j)-[:HAS_SKILL]->(python),

        (rahul)-[:HAS_SKILL]->(java),
        (rahul)-[:HAS_SKILL]->(sql),
        (rahul)-[:HAS_SKILL]->(node),

        (priya)-[:HAS_SKILL]->(python),
        (priya)-[:HAS_SKILL]->(ml),
        (priya)-[:HAS_SKILL]->(sql),

        (anjali)-[:HAS_SKILL]->(js),
        (anjali)-[:HAS_SKILL]->(react),
        (anjali)-[:HAS_SKILL]->(sql),

        // Skill → Technology
        (js)-[:USES]->(reactTech),
        (react)-[:USES]->(reactTech),
        (node)-[:USES]->(nodeTech),
        (sql)-[:USES]->(postgres),
        (python)-[:USES]->(tensorflow),
        (ml)-[:USES]->(tensorflow),
        (java)-[:USES]->(spring),

        // Developer → Project
        (j)-[:BUILT]->(fraud),
        (j)-[:BUILT]->(emergency),
        (rahul)-[:BUILT]->(ecommerce),
        (priya)-[:BUILT]->(health),
        (anjali)-[:BUILT]->(ecommerce),

        // Project → Technology
        (fraud)-[:USES]->(python),
        (fraud)-[:USES]->(tensorflow),
        (fraud)-[:USES]->(postgres),

        (emergency)-[:USES]->(nodeTech),
        (emergency)-[:USES]->(postgres),
        (emergency)-[:USES]->(reactTech),

        (ecommerce)-[:USES]->(reactTech),
        (ecommerce)-[:USES]->(nodeTech),
        (ecommerce)-[:USES]->(mongo),

        (health)-[:USES]->(tensorflow),
        (health)-[:USES]->(python),

        // Technology → Job Role
        (reactTech)-[:RELEVANT_TO]->(frontend),
        (reactTech)-[:RELEVANT_TO]->(fullstack),

        (nodeTech)-[:RELEVANT_TO]->(backend),
        (nodeTech)-[:RELEVANT_TO]->(fullstack),

        (postgres)-[:RELEVANT_TO]->(backend),
        (postgres)-[:RELEVANT_TO]->(fullstack),

        (mongo)-[:RELEVANT_TO]->(backend),

        (tensorflow)-[:RELEVANT_TO]->(mlEngineer),

        (spring)-[:RELEVANT_TO]->(javaDeveloper)
    `);

    console.log("Graph seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();