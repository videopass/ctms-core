module.exports = function () {
	return {
		files: ['src/**/*.ts', { pattern: 'src/**/*.test.ts', ignore: true }],

		tests: ['src/**/*.test.ts'],
		testFramework: 'jest',
		env: {
			type: 'node',
		},
	}
}
