var _ = require("lodash");
var path = require("path");
var fs = require("fs");

module.exports = function(grunt)
{
    grunt.initConfig(
    {
        jshint:
        {
            source:
            {
                src: [ "src/**/*.js" ]
            },
            build:
            {
                src: [ "Gruntfile.js" ],
                options:
                {
                    node: true
                }
            },
            tests:
            {
                src: [ "tests/**/*.js"],
                options:
                {
                    expr: true, // Allow chai syntax
                    globals:
                    {
                        "describe": false,
                        "it": false,
                        "xdescribe": false,
                        "xit": false,
                        "before": false,
                        "beforeEach": false,
                        "after": false,
                        "afterEach": false,
                        "requirejs": false,
                        "define": false,
                        "require": false,

                        // Remove these when time allows
                        "createSpyObj": false,
                        "expect": false,
                        "sinon": false,
                    }
                }
            },
            options:
            {
                scripturl: true,
                curly: false,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                devel: false,
                sub: true,
                undef: true,
                globals:
                {
                    "requirejs": false,
                    "define": false,
                    "require": false
                }
            }
        },

        compass: //SASS/SCSS
        {
            build:
            {
                options:
                {
                    sassDir: "src/scss",
                    cssDir: "build/css",
                    outputStyle: "compressed",
                    imagesDir: "assets/images"
                }
            }
        },

        watch:
        {
            compass: {
                files: ["src/scss/**/*.scss"],
                tasks: "compass:build"
            },
            jshint: {
                files: ["Gruntfile.js", "src/**/*.js"],
                tasks: "jshint"
            }
        },

        clean:
        {
            build:
            {
                src: ["build"]
            }
        },

        mocha:
        {
            options:
            {
                bail: false,
                log: true,
                run: false,
                reporter: "Spec",
                mocha:
                {
                    grep: grunt.option("grep")
                }
            },

            test:
            {
                src: [ "tests/mocha.html" ],
            }
        },

       web_server: {
        options: {
          cors: true,
          port: 8000,
          nevercache: true,
          logRequests: true
        },
        foo: 'bar' // For some reason an extra key with a non-object value is necessary, according to the npm page
      }
    });

    /*
    * With the new version of Grunt (>= 0.4) we need to install all the
    * "default" tasks manually using NPM and then need to include tem as
    * npm-tasks like this:
    */
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-compass");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks("grunt-web-server");
    //grunt.loadNpmTasks("grunt-bower");
    //grunt.loadNpmTasks("grunt-bower-requirejs");

    // TESTING:
    grunt.registerTask("test", ["jshint", "mocha:test"]);

};
