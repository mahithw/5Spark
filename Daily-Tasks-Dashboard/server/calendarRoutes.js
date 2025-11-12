const express = require("express");
const { google } = require("googleapis");
const { oauth2Client, getAuthUrl } = require("./googleClient");
const { saveTokens, loadTokens } = require("./tokenStore");

const router = express.Router();

/** 1) Get Google OAuth URL */
router.get("/google/auth-url", (_req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

/** 2) OAuth callback */
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    saveTokens(tokens);
    res.send("Google Calendar connected. You can close this tab and return to the app.");
  } catch (err) {
    console.error("Error exchanging code for tokens:", err);
    res.status(500).send("Failed to authorize Google.");
  }
});

function ensureTokens() {
  const tokens = loadTokens();
  if (!tokens) return false;
  oauth2Client.setCredentials(tokens);
  return true;
}

/** 3) Get today's events as tasks in your Task shape */
router.get("/calendar/tasks-today", async (_req, res) => {
  if (!ensureTokens()) {
    return res.status(401).json({ error: "Not authenticated with Google yet." });
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59
    );

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    // Map Google events → Task[] matching your Task type
    const tasks = events.map((event, index) => {
      const idBase = event.id || `gcal-${index}`;
      const summary = event.summary || "(No title)";

      const startISO = event.start.dateTime || event.start.date;
      const endISO = event.end.dateTime || event.end.date;
      const startDateObj = new Date(startISO);
      const endDateObj = new Date(endISO);

      const dueDate = startISO.slice(0, 10); // YYYY-MM-DD

      // Estimate effort by duration (very rough)
      const durationHours = (endDateObj - startDateObj) / (1000 * 60 * 60);
      let effort = "medium";
      if (durationHours <= 0.5) effort = "low";
      else if (durationHours >= 2) effort = "high";

      // Scheduled time HH:MM from event start
      const hours = startDateObj.getHours().toString().padStart(2, "0");
      const minutes = startDateObj.getMinutes().toString().padStart(2, "0");
      const scheduledTime = `${hours}:${minutes}`;

      // Your Task type from AddTaskDialog
      return {
        id: `gcal-${idBase}`,
        title: summary,
        completed: false,
        priority: "medium",         // simple default for now
        dueDate,                    // YYYY-MM-DD
        isStandaloneTask: true,
        scheduledTime,
        effort,                     // 'low' | 'medium' | 'high'
        repeatPattern: undefined,   // Google recurrence could be mapped later
        subtasks: [
          {
            id: `${idBase}-0`,
            title: summary,
            completed: false,
            taskTitle: summary,
            scheduledTime,
            effort,
          },
        ],
      };
    });

    res.json({ tasks });
  } catch (err) {
    console.error("Error fetching calendar events:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

module.exports = router;