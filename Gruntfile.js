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
                tasks: ['sasslint', 'sass:server', 'postcss', 'replace:sourceMaps']
            },
            assemble: {
                files: [
                    '<%= config.app %>/layout/**/*.{hbs,json,yml,yaml}',
                    '<%= config.app %>/modules/**/*.{hbs,json,yml,yaml}',
                    '<%= config.app %>/templates/**/*.{hbs,json,yml,yaml}'
                ],
                tasks: ['assemble']
            },
            js: {
                files: [
                    '<%= config.app %>/layout/**/*.js',
                    '<%= config.app %>/modules/**/*.js',
                    '<%= config.app %>/js/**/*.js'
                ],
                tasks: ['jshint', 'browserify:server']
            },
            images: {
                files: ['<%= config.app %>/images/{,*/}*']
            }
        },

        connect: {
            options: {
                port: 9000,
                // change this to 'localhost' to prevent accessing the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, config.app),
                            lrSnippet
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
            all: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/css/**',
                        '.tmp/js/**',
                        '<%= config.dist %>/**/*'
                    ]
                }]
            }
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
            dist: {
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
            server: {
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
            dist: {
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
            server: {
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
                    require('autoprefixer')({browsers: ['last 2 versions']})
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
            dist: {
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
            dist: {
                options: {
                    maxImageSize: 10000,
                    baseDir: './<%= config.dist %>',
                    deleteAfterEncoding: false
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: ['*.css'],
                    dest: '.tmp/css',
                    ext: '.css'
                }]
            }
        },

        imagemin: {
            dist: {
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
                    src: '{,*/}*.{png,jpg,jpeg,svg}',
                    dest: '.tmp/images'
                }]
            }
        },

        cssmin: {
            dist: {
                expand: true,
                cwd: '.tmp/css/',
                src: ['*.css'],
                dest: '.tmp/css/'
            }
        },

        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        'favicon.ico',
                        'apple-touch-icon.png',
                        'tile.png',
                        'tile-wide.png',
                        'browserconfig.xml',
                        'ProductionTemplates/{,*/}*.html',
                        'pattern-library/**/*',
                        'images/{,*/}*.{webp,gif}',
                        'css/**/*.css',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp',
                    dest: '<%= config.dist %>',
                    src: ['css/**/*', 'js/**/*', 'images/**/*']
                }, {
                    expand: true,
                    cwd: '<%= config.app %>/pattern-library',
                    dest: '<%= config.dist %>',
                    src: ['index.html']
                }]
            },
            vendorCss: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css/vendor',
                    dest: '.tmp/css/vendor',
                    src: ['**/*.css']
                }]
            },
            vendorJs: {
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
            dist: [
                'browserify:dist',
                'sass:dist',
                'newer:imagemin'
            ]
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean',
            'copy:vendorCss',
            'connect:livereload',
            'sass:server',
            'browserify:server',
            'postcss',
            'replace:sourceMaps',
            'assemble',
            'yapl',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'sasslint',
        'jshint'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy:vendorCss',
        'copy:vendorJs',
        'assemble:pages',
        'yapl',
        'concurrent:dist',
        'uglify',
        'copy:dist',
        'postcss',
        'imageEmbed:dist',
        'cssmin'
    ]);

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
};
