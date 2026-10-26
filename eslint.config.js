import dx from "@eoussama/dx";



export default dx().prepend({
  ignores: ["README.md", "docs/guide/**", "docs/demos/**", "docs/index.md", "test-results/**", "playwright-report/**"],
});
