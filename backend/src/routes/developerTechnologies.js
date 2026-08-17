const express = require("express");
const driver = require("../config/database");

const router = express.Router();

router.get("/:name", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer)-[:HAS_SKILL]->(s:Skill)-[:USES]->(t:Technology)
      WHERE d.name = $developer
      RETURN d.name AS developer,
             collect(DISTINCT t.name) AS technologies
      `,
      {
        developer: req.params.name
      }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        message: "Developer not found"
      });
    }

    const record = result.records[0];

    res.json({
      developer: record.get("developer"),
      technologies: record.get("technologies")
    });
  } catch (error) {
    console.error(
      "Error fetching developer technologies:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch developer technologies"
    });
  } finally {
    await session.close();
  }
});

module.exports = router;