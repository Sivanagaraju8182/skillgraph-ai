const express = require("express");
const driver = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (j:JobRole)
      RETURN j.name AS name
      ORDER BY j.name
    `);

    const jobRoles = result.records.map((record) => ({
      name: record.get("name")
    }));

    res.json(jobRoles);
  } catch (error) {
    console.error("Error fetching job roles:", error.message);

    res.status(500).json({
      message: "Failed to fetch job roles"
    });
  } finally {
    await session.close();
  }
});

module.exports = router;