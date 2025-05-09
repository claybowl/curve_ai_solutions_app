# Patches

This directory contains patches for npm packages that need modifications.
These patches are applied automatically after npm install using patch-package.
\`\`\`

Let's create the patch for the Radix UI package:

```diff file="patches/@radix-ui+react-use-effect-event+0.0.0.patch"
diff --git a/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs b/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
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
 });
