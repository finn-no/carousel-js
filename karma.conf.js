/*globals module */
module.exports = function(config){
    'use strict';

    config.set({
        basePath: 'test',
        frameworks: ['jasmine', 'sinon', 'buster-assertions'],
        files: [
            '../src/lib/bane/*.js',
            'lib/buster/*.js',
            'lib/sinon/*.js',
            'lib/jquery*.js',
            'lib/test-helper*.js',
            '../src/finn/*.js',
            '../src/finn/carousel/*.js',
            'finn/*.js',
            'finn/carousel/*.js'
        ],

        exclude: [
        ],

        reporters: [
            'progress'
        ],
        port: 9876,
        runnerPort: 9100,

        colors: true,

        logLevel: config.LOG_INFO,

        loggers: [
            {type: 'console'}
        ],
        autoWatch: true,

        browsers: [
            'PhantomJS'
        ],
        captureTimeout: 60000,
        singleRun: false,
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-sinon',
            'karma-buster-assertions-plugin'
        ]
    });
};
