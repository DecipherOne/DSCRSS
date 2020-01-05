'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package-lock.json'),
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        clean: {
            options: {
                force: true
            },
            files: ['static_build/build/style/']
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'static_build/sass/',
                    cssDir: 'static_build/build/style/',
                    outputStyle: 'compact',
                    noLineComments: true ,
                    bundleExec:true
                }
            },
            localDev: {
                options: {
                    sassDir: 'static_build/sass/',
                    cssDir: 'static_build/build/style/',
                    outputStyle: 'expanded',
                    noLineComments: false
                }
            }
        },
        concat:{
            thirdParty:{
                src:[
                    'static_build/js/thirdParty/jquery.js',
                    'static_build/js/thirdParty/fullcalendar/packages/core/main.js',
                    'static_build/js/thirdParty/fullcalendar/packages/daygrid/main.js',
                    'static_build/js/thirdParty/fullcalendar/packages/interaction/main.js'
                ],
                dest:'static_build/js/compiled/3rdParty.js',
                nonull: true
            },
            projectMain:{
                src:[
                    'static_build/js/main.js',
                    'static_build/js/schedulingCalender.js'
                ],
                dest:'static_build/js/compiled/001.js',
                nonull: true
            }
        },
        cssmin: {
            options: {
                banner: '/* DO NOT COMMIT */',
                report: false /* change to 'gzip' to see gzipped sizes on local */
            },
            minify: {
                expand: true,
                cwd: 'static_build/build/style/',
                src: ['*.css'],
                dest: 'style',
                ext: '.min.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle:true, /* Change to true for obfuscation on deployment */
                report: false /* change to 'gzip' to see gzipped sizes on local */
            },
            minify:{
                expand: true,
                cwd: 'static_build/js/compiled',
                src: ['**/*.js','!*.min.js'],
                dest: 'js',
                ext: '.min.js'
            }
        },
        watch: {
            sassy: {
                files: ['static_build/sass/*.scss','static_build/sass/_partials/*.scss'],
                tasks: ['compass:localDev'],
                options: {
                    spawn: false
                }
            },
            scripts:{
                files:['static_build/js/*'],
                tasks:['concat','uglify'],
                options:{
                    spawn:false
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('devWatch', ['compass:localDev','watch']);
    grunt.registerTask('firstRun', ['compass:localDev','concat']);
    grunt.registerTask('default', ['clean','compass:dist','cssmin','concat','uglify']);


};