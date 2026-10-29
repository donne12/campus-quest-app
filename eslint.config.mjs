import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([{
    extends: [...nextCoreWebVitals],
    rules: {
        // New in eslint-plugin-react-hooks 7 (eslint-config-next 16); kept as warnings so
        // lint reports the same errors as before the upgrade.
        "react-hooks/set-state-in-effect": "warn",
        "react-hooks/immutability": "warn",
    },
}]);
