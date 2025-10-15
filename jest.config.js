export default {
  testEnvironment: "jsdom", // Ensures Jest uses a browser-like environment
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Setup for React Testing Library
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      useESM: true,
    }], // Use ts-jest for TypeScript files
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Treat TypeScript files as ES modules
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore these paths
  testTimeout: 10000, // Increase timeout for CI
};