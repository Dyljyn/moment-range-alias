// Karma configuration
// Generated on Mon Mar 05 2018 13:20:43 GMT+0100 (Central European Standard Time)

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'karma-typescript'],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-typescript'
        ],
        files: [
            { pattern: 'src/**/*.ts' }
        ],
        preprocessors: {
            '**/*.ts': 'karma-typescript'
        },
        exclude: [],
        reporters: ['progress', 'karma-typescript'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        customLaunchers: {
            Headless_Chrome: {
                base: 'Chrome',
                flags: [
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222'
                ]
            }
        },
        browsers: ['Headless_Chrome'],
        singleRun: false,
        concurrency: Infinity,
        karmaTypescriptConfig: {
            compilerOptions: {
                target: "es5",
                sourceMap: true
            },
            coverageOptions: {
                exclude: [/\.(d|test)\.ts$/i, /.*node_modules.*/]
            },
            tsconfig: './tsconfig.json'
        }
    })
};
