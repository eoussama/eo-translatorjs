import dx from "@eoussama/dx";



export default dx().prepend({
  ignores: ["README.md", "demos/**", "tests/*.js", "tests/utils/**", "test-results/**", "playwright-report/**"],
});
