import dx from "@eoussama/dx";



export default dx().prepend({
  ignores: ["README.md", "demos/**", "test-results/**", "playwright-report/**"],
});
