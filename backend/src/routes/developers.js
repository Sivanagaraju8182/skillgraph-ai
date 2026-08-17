const express = require("express");
const driver = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (d:Developer)
      RETURN d.name AS name
      ORDER BY d.name
    `);

    const developers = result.records.map((record) => ({
      name: record.get("name")
    }));

    res.json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error.message);

    res.status(500).json({
      message: "Failed to fetch developers"
    });
  } finally {
    await session.close();
  }
});

module.exports = router;