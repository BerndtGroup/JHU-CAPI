'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var serveStatic = require('serve-static');
var mountFolder = function (connect, dir) {
    return serveStatic(require('path').resolve(dir));
};

module.exports = function (grunt) {

    // load all grunt tasks
    require('jit-grunt')(grunt, {
        replace: 'grunt-text-replace',
        imageEmbed: 'grunt-image-embed-src',
        sasslint: 'grunt-sass-lint'
    });

    require('time-grunt')(grunt);

    // configurable paths
    var config = {
        app: 'FrontEndSrc',
        dist: 'Website'
    };

    grunt.initConfig({
        config: config,

        watch: {
            options: {
                spawn: true,
                livereload: true
            },
            sass: {
                files: ['<%= config.app %>/**/*.scss'],
                tasks: ['sasslint', 'sass:appToTmpServer', 'postcss', 'replace:sourceMaps']
            },
            assemble: {
                files: [
                    '<%= config.app %>/layout/**/*.{hbs,json,yml,yaml}',
                    '<%= config.app %>/modules/**/*.{hbs,json,yml,yaml}',
                    '<%= config.app %>/templates/**/*.{hbs,json,yml,yaml}'
                ],
                tasks: ['assemble', 'copy:templatesToTmp']
            },
            js: {
                files: [
                    '<%= config.app %>/layout/**/*.js',
                    '<%= config.app %>/modules/**/*.js',
                    '<%= config.app %>/js/**/*.js'
                ],
                tasks: ['jshint', 'browserify:appToTmpServer']
            },
            images: {
                files: ['<%= config.app %>/images/{,*/}*']
            }
        },

        connect: {
            options: {
                port: 9000,
                // change this to 'localhost' to prevent accessing the server from outside
                hostname: '0.0.0.0',
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, config.dist)
                        ];
                    }
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>/pattern-library/'
            }
        },

        // Add folders individually so we only delete Front End-specific files
        clean: {
            app: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.app %>/productionTemplates/**'
                    ]
                }]
            },
            tmp: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/**/*',
                    ]
                }]
            },
            tmpServer: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/css/**',
                        '.tmp/js/*.js'
                    ]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/css/**',
                        '<%= config.dist %>/fonts/**',
                        '<%= config.dist %>/images/**',
                        '<%= config.dist %>/js/**',
                        '<%= config.dist %>/pattern-library/**',
                        '<%= config.dist %>/productionTemplates/**',
                        '<%= config.dist %>/apple-touch-icon.png',
                        '<%= config.dist %>/browserconfig.xml',
                        '<%= config.dist %>/favicon-16x16.png',
                        '<%= config.dist %>/favicon-32x32.png',
                        '<%= config.dist %>/favicon.ico',
                        '<%= config.dist %>/mstile-150x150.png',
                        '<%= config.dist %>/safari-pinned-tab.svg',
                        '<%= config.dist %>/index.html'
                    ]
                }]
            },
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/js/{,*/}*.js',
                '<%= config.app %>/layout/**/*.js',
                '<%= config.app %>/modules/**/*.js',
                '<%= config.app %>/templates/**/*.js',
                '!<%= config.app %>/js/vendor/*'
            ]
        },

        browserify: {
            appToTmp: {
                options: {
                    transform: [
                        ['babelify', {
                            presets: ['es2015']
                        }]
                    ],
                    browserifyOptions: {
                        debug: false,
                        paths: [
                            '<%= config.app %>'
                        ]
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/js/',
                    src: ['*.js'],
                    dest: '.tmp/js',
                    ext: '.js'
                }]
            },
            appToTmpServer: {
                options: {
                    transform: [
                        ['babelify', {
                            presets: ['es2015']
                        }]
                    ],
                    browserifyOptions: {
                        debug: true,
                        paths: [
                            '<%= config.app %>'
                        ]
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/js/',
                    src: ['*.js'],
                    dest: '.tmp/js',
                    ext: '.js'
                }]
            }
        },

        sass: {
            appToTmp: {
                options: {
                    includePaths: [
                        '<%= config.app %>',
                        '<%= config.app %>/css/imports',
                        '<%= config.app %>/bower_components/bourbon/app/assets/stylesheets',
                        '<%= config.app %>/bower_components/neat/app/assets/stylesheets'
                    ],
                    outputStyle: 'nested'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css/',
                    src: ['*.scss', '!_*.scss'],
                    dest: '.tmp/css',
                    ext: '.css'
                }]
            },
            appToTmpServer: {
                options: {
                    includePaths: [
                        '<%= config.app %>',
                        '<%= config.app %>/css/imports',
                        '<%= config.app %>/bower_components/bourbon/app/assets/stylesheets',
                        '<%= config.app %>/bower_components/neat/app/assets/stylesheets'
                    ],
                    outputStyle: 'nested',
                    sourceMap: true,
                    omitSourceMapUrl: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css/',
                    src: ['*.scss', '!_*.scss'],
                    dest: '.tmp/css',
                    ext: '.css'
                }]
            }
        },

        sasslint: {
            options: {
                configFile: '.sass-lint.yml',
            },
            target: [
                '<%= config.app %>/css/**/*.scss',
                '<%= config.app %>/layout/**/*.scss',
                '<%= config.app %>/modules/**/*.scss',
                '!<%= config.app %>/modules/macro/coveo/_coveo.scss'
            ]
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 2 versions', 'iOS >= 6', 'ie >= 8']})
                ]
            },
            all: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: ['*.css'],
                    dest: '.tmp/css',
                    ext: '.css'
                }]
            }
        },

        uglify: {
            tmp: {
                files: [{
                    expand: true,
                    cwd: '.tmp/js',
                    src: '**/*.js',
                    dest: '.tmp/js'
                }]
            }
        },

        assemble: {
            options: {
                flatten: true,
                layoutdir: '<%= config.app %>/layout',
                partials: [
                    '<%= config.app %>/layout/**/*.hbs',
                    '<%= config.app %>/modules/**/*.hbs'
                ],
                data: [
                    '<%= config.app %>/layout/**/*.{json,yml,yaml}',
                    '<%= config.app %>/modules/**/*.{json,yml,yaml}'
                ],
                helpers: ['handlebars-helper-repeat']
            },
            pages: {
                files: {
                    '<%= config.app %>/ProductionTemplates/': ['<%= config.app %>/templates/{,*/}*.hbs']
                }
            }
        },

        imageEmbed: {
            tmp: {
                options: {
                    maxImageSize: 10000,
                    baseDir: './<%= config.dist %>',
                    deleteAfterEncoding: false
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: ['main.css'],
                    dest: '.tmp/css',
                    ext: '.css'
                }]
            }
        },

        imagemin: {
            tmp: {
                options: {
                    svgoPlugins: [{
                        convertPathData: false
                    }, {
                        removeViewBox: false
                    }, {
                        removeUselessStrokeAndFill: false
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '**/*.{png,jpg,jpeg,svg}',
                    dest: '.tmp/images'
                }]
            }
        },

        cssmin: {
            tmp: {
                expand: true,
                cwd: '.tmp/css/',
                src: ['*.css'],
                dest: '.tmp/css/'
            }
        },

        // Put files not handled in other tasks here
        copy: {
            appToTmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '.tmp',
                    src: [
                        'apple-touch-icon.png',
                        'browserconfig.xml',
                        'favicon-16x16.png',
                        'favicon-32x32.png',
                        'favicon.ico',
                        'mstile-150x150.png',
                        'safari-pinned-tab.svg',
                        'ProductionTemplates/{,*/}*.html',
                        'pattern-library/**/*',
                        'images/{,*/}*.{webp,gif,mp4}',
                        'css/**/*.css',
                        'fonts/*',
                        'data/*'
                    ]
                }]
            },
            templatesToTmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '.tmp',
                    src: [
                        'ProductionTemplates/{,*/}*.html'
                    ]
                }]
            },
            TemplatesToTmpGhPages: {
                files: [{
                    expand: true,
                    flatten: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '.tmp',
                    src: [
                        'ProductionTemplates/{,*/}*.html'
                    ]
                }]
            },
            tmpAndPatternLibraryToDist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp',
                    dest: '<%= config.dist %>',
                    src: ['**/*']
                },
                {
                    expand: true,
                    cwd: '<%= config.app %>/pattern-library',
                    dest: '<%= config.dist %>',
                    src: ['index.html']
                }]
            },
            appVendorCssToTmp: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css/vendor',
                    dest: '.tmp/css/vendor',
                    src: ['**/*.css']
                }]
            },
            appVendorJsToTmp: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/js/vendor',
                    dest: '.tmp/js/vendor',
                    src: ['**/*.js']
                }]
            }
        },

        replace: {
            // Fixes paths in the Sass source map so it actually works
            sourceMaps: {
                src: ['.tmp/css/main.css.map'],
                overwrite: true,
                replacements: [{
                    from: '../../FrontEndSrc',
                    to: ''
                }]
            },
            patternLibrary: {
                src: ['.tmp/**/*.html'],
                overwrite: true,
                replacements: [{
                    from: '\\',
                    to: '/'
                }]
            }
        },

        yapl: {
            styleguide: {
                settings: {
                    css: '<%= config.app %>/css/**/*.scss',
                    partials: '<%= config.app %>/{layout,modules}/**/*.hbs',
                    data: '<%= config.app %>/{layout,modules}/**/*.{json,yml,yaml}',
                    displayTemplates: '<%= config.app %>/ProductionTemplates/**/*.html',
                    buildDir: '<%= config.app %>/pattern-library',
                    siteRoot: '<%= config.app %>/'
                },
                sections: [{
                    name: 'Micro Modules',
                    landingTemplate: 'section-landing.hbs',
                    childTemplate: 'module.hbs',
                    css: '<%= config.app %>/modules/micro/**/*.scss'
                }, {
                    name: 'Macro Modules',
                    landingTemplate: 'section-landing.hbs',
                    childTemplate: 'module.hbs',
                    css: '<%= config.app %>/modules/macro/**/*.scss'
                }, {
                    name: 'Display Templates',
                    landingTemplate: 'display-templates-landing.hbs'
                }, {
                    name: 'Image Sizes',
                    landingTemplate: 'image-sizes-landing.hbs'
                }, {
                    name: 'Appendix',
                    landingTemplate: 'appendix.hbs'
                }]
            }
        },

        concurrent: {
            tmp: [
                'browserify:appToTmp',
                'sass:appToTmp',
                'newer:imagemin'
            ]
          },

        'gh-pages': {
            options: {
                base: '.tmp/'
            },
            src: ['**/*']
        },

        relativeRoot: {
            productionTemplates: {
                options: {
                    root: '.tmp'
                },
                files: [{
                    expand: true,
                    cwd: '<%= relativeRoot.productionTemplates.options.root %>',
                    src: ['css/*.css', '**/*.html', '**/*.css'],
                    dest: '.tmp/'
                }]
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            // Clean
            'clean:tmpServer',
            // Server
            'connect:livereload',
            // Copy
            'browserify:appToTmpServer',
            'sass:appToTmpServer',
            'postcss',
            'replace:sourceMaps',
            // Build
            'assemble',
            // YAPL
            'yapl',
            // Open and Watch
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'sasslint',
        'jshint'
    ]);

    grunt.registerTask('build', [
        // Clean
        'clean:app',
        'clean:tmp',
        // Build
        'assemble:pages',
        // Copy
        // 'copy:appVendorCssToTmp',
        'copy:appVendorJsToTmp',
        'copy:appToTmp',
        // Concurrent: browserify:appToTmp, sass:appToTmp, newer:imagemin
        'concurrent:tmp',
        // YAPL
        'yapl',
        // Post
        'uglify', // uglify JS in tmp
        'postcss', // add autoprefixer
        'cssmin:tmp', // minify css in tmp
        'replace:patternLibrary'
    ]);

    // grunt.registerTask('bed', [
    //     'clean:dist',
    //     // 'imageEmbed:tmp', //FIXME Throwing error
    //     'copy:tmpAndPatternLibraryToDist'
    // ]);

    grunt.registerTask('default', function () {
        var skipNpmInstall = grunt.option('skip-install');

        if (!skipNpmInstall) {
            grunt.task.run(['npm-install']);
        }

        grunt.task.run([
            'test',
            'build'
        ]);
    });

    grunt.registerTask('publish', [
        // Clean
        'clean:app',
        'clean:tmp',
        // Build
        'assemble:pages',
        // Copy
        // 'copy:appVendorCssToTmp',
        'copy:appVendorJsToTmp',
        'copy:appToTmp',
        'copy:TemplatesToTmpGhPages',
        // Concurrent: browserify:appToTmp, sass:appToTmp, newer:imagemin
        'concurrent:tmp',
        // YAPL
        'yapl',
        // Post
        'uglify', // uglify JS in tmp
        'postcss', // add autoprefixer
        'cssmin:tmp', // minify css in tmp
        'replace:patternLibrary',
        'relativeRoot',
        // Push to GitHub Pages
        'gh-pages',
        // Clean out production templates at .tmp/
        // 'clean:tmp'
      ]);

    grunt.registerTask('dist', function () {
        grunt.task.run([
            'build',
            'bed'
        ]);
    });
};