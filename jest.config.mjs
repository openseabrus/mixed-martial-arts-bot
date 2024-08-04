/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  // preset: "ts-jest",
  testEnvironment: "node",
  /* transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  }, */
  setupFiles: ["dotenv/config"],
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    "'^.+\\.[tj]sx?$'": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
