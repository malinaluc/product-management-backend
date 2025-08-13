/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/?(*.)+(spec|test).ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
    clearMocks: true,

    setupFilesAfterEnv: ["<rootDir>/tests/e2e/utils/server.testkit.ts"],
    testTimeout: 30000,

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/index.ts",
        "!src/**/*.d.ts",
        "!src/**/types/**",
        "!src/**/models/**"
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/tests/"
    ]
};