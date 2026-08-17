const express = require("express");
const driver = require("../config/database");

const router = express.Router();

router.get("/:name", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer)-[:BUILT]->(p:Project)
            -[:USES]->(t:Technology)
            -[:RELEVANT_TO]->(j:JobRole)
      WHERE d.name = $developer
      RETURN DISTINCT
             p.name AS project,
             j.name AS jobRole,
             collect(DISTINCT t.name) AS technologies
      ORDER BY project
      `,
      {
        developer: req.params.name
      }
    );

    const recommendations = result.records.map((record) => ({
      project: record.get("project"),
      jobRole: record.get("jobRole"),
      technologies: record.get("technologies")
    }));

    res.json({
      developer: req.params.name,
      recommendations
    });
  } catch (error) {
    console.error(
      "Error fetching recommendations:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch recommendations"
    });
  } finally {
    await session.close();
  }
});

module.exports = router;