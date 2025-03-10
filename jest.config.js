module.exports = {
  transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^react-router-dom$": "<rootDir>/src/__mocks__/react-router-dom.js"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(react-router-dom|@remix-run)/)"
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx}"
  ],
  testPathIgnorePatterns: ["/node_modules/", "/src/setupTests.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js",
      "!**/node_modules/**",
      "!src/setupTests.js",
      "!src/**/*.test.{js,jsx}",
      "!src/**/__mocks__/**",
      "!**/__tests__/**"
  ],
  coverageThreshold: {
      global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
      }
  }
};
