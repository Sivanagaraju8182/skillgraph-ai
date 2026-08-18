const express = require("express");
const cors = require("cors");
require("dotenv").config();

const driver = require("./config/database");

const developersRouter = require("./routes/developers");
const developerSkillsRouter = require("./routes/developerSkills");
const developerTechnologiesRouter = require("./routes/developerTechnologies");
const recommendationsRouter = require("./routes/recommendations");
const jobRolesRouter = require("./routes/jobRoles");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/developers", developersRouter);
app.use("/api/developers", developerSkillsRouter);
app.use(
  "/api/developer-technologies",
  developerTechnologiesRouter
);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/job-roles", jobRolesRouter);

// Database connection test
app.get("/", async (req, res) => {
  const session = driver.session();

  try {
    await session.run("RETURN 1 AS connected");

    res.json({
      message: "SkillGraph AI API is running",
      database: "Connected"
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      database: "Disconnected"
    });
  } finally {
    await session.close();
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});