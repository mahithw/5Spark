const fs = require("fs");
const path = require("path");

const TOKEN_PATH = path.join(__dirname, "tokens.json");

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf8");
}

function loadTokens() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const raw = fs.readFileSync(TOKEN_PATH, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = { saveTokens, loadTokens };