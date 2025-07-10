import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', 'jest-canvas-mock'],
    testMatch: ['**/__tests__/**/*.test.tsx'],
};

export default config;
