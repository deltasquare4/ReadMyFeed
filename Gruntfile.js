/**
  * Grunt Configuration File for Mesh
  */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        // we need to make sure our js code always adheres to script jshint standards
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                indent: 2,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: 'single',
                sub: true,
                undef: true,
                trailing: true,
                laxcomma: true,
                lastsemic: true,
                browser: false,
                white: false,
                es5: true,
                globals: {
                    module: true,
                    exports: true,
                    require:  true,
                    process: true,
                    __dirname: true,
                    log: true
                }
            },
            uses_defaults: [
                'app/**/*.js',
                'config/**/*.js',
                'lib/**/*.js',
                'models/**/*.js',
                'synchronizer/**/*.js'
            ]
        },

        simplemocha: {
            options: {
                slow: 60,
                growl: true,
                ui: 'bdd',
                debug: true,
                recursive: true,
                bail: true,
                reporter: 'spec',
                timeout: 10000,
                require: ['test/test.setup']
            },

            all: { src: 'test/**/*.js' }
        },

        // run jshint whenever a file is saved
        watch: {
          
            js: {
                files: [
                    'app/**/*.js',
                    'config/**/*.js',
                    'lib/**/*.js',
                    'models/**/*.js',
                    'synchronizer/**/*.js'
                ],
                tasks: ['jshint', 'simplemocha']
            }

        }

    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'simplemocha']);
    grunt.registerTask('mocha', ['simplemocha']); // alias for simplicity
};
