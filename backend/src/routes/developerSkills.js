const express = require("express");
const driver = require("../config/database");

const router = express.Router();

router.get("/:name", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer)-[:HAS_SKILL]->(s:Skill)
      WHERE d.name = $developer
      RETURN d.name AS developer,
             collect(s.name) AS skills
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
      skills: record.get("skills")
    });
  } catch (error) {
    console.error("Error fetching developer skills:", error.message);

    res.status(500).json({
      message: "Failed to fetch developer skills"
    });
  } finally {
    await session.close();
  }
});

module.exports = router;