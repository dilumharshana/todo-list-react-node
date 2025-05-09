import "@testing-library/jest-dom";

// jest.setup.js
global.importMeta = {
  env: {
    VITE_API_URL: "http://localhost"
    // Add any other env vars used in your code
  }
};
