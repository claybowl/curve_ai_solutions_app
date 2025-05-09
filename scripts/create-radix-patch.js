"use client"

const fs = require("fs")
const path = require("path")

console.log("Creating patch for @radix-ui/react-use-effect-event...")

const patchDir = path.join(__dirname, "../patches/@radix-ui+react-use-effect-event+0.0.0")
if (!fs.existsSync(patchDir)) {
  fs.mkdirSync(patchDir, { recursive: true })
}

const patchContent = `diff --git a/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs b/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
index 1234567..abcdefg 100644
--- a/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
+++ b/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
@@ -1,5 +1,13 @@
 import * as React from 'react';
-export const useEffectEvent = React.useEffectEvent || ((callback) => {
+
+// Custom implementation of useEffectEvent since it's not available in React yet
+export const useEffectEvent = ((callback) => {
   const ref = React.useRef(callback);
   ref.current = callback;
   return React.useCallback((...args) => ref.current(...args), []);
+});
+
+// Export for compatibility
+export default {
+  useEffectEvent
 });`

const patchFile = path.join(patchDir, "patch")
fs.writeFileSync(patchFile, patchContent)

console.log("✅ Patch file created successfully!")
