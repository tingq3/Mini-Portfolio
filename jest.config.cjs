module.exports = {
  setupFilesAfterEnv: [
    "jest-extended/all",
    '<rootDir>/tests/setup/serverBeforeEach.ts',
  ],
  maxWorkers: 1,
  // Run dev server during tests
  // https://www.npmjs.com/package/jest-dev-server
  globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',
  transform: {
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        preprocess: true
      }
    ],
    "^.+\\.js$": "babel-jest",
    // https://github.com/kulshekhar/ts-jest/issues/4081#issuecomment-1515758013
    "^.+\\.ts$": ["ts-jest", { tsconfig: './tsconfig.jest.json' }],
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: [
    "js",
    "ts",
    "svelte"
  ],
  // https://koenvg.medium.com/setting-up-jest-with-sveltekit-4f0a0e379668#3f2e
	moduleNameMapper: {
		'^\\$lib(.*)$': '<rootDir>/src/lib$1',
		'^\\$types(.*)$': '<rootDir>/src/types$1',
		'^\\$components(.*)$': '<rootDir>/src/components$1',
		'^\\$api(.*)$': '<rootDir>/tests/api$1',
		'^\\$app(.*)$': [
			'<rootDir>/.svelte-kit/dev/runtime/app$1',
			'<rootDir>/.svelte-kit/build/runtime/app$1'
		]
	}
};
