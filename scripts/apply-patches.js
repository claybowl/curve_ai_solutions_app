const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Applying patches for Radix UI components...")

// Create patches directory if it doesn't exist
const patchesDir = path.join(__dirname, "../patches")
if (!fs.existsSync(patchesDir)) {
  fs.mkdirSync(patchesDir, { recursive: true })
}

// Apply patches using patch-package
try {
  execSync("npx patch-package", { stdio: "inherit" })
  console.log("✅ Patches applied successfully!")
} catch (error) {
  console.error("❌ Failed to apply patches:", error)
  process.exit(1)
}
