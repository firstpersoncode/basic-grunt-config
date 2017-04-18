module.exports = function(grunt) {

  // load all installed tasks
  require('load-grunt-tasks')(grunt);

  // configs
  grunt.initConfig({

    // copy files
    copy: {
      main: { // copy index.html
        cwd: 'src',
        src: '*.html',
        dest: 'build/',
        expand: true
      },
      sassSourcemap: { // copy source map from sass
        cwd: 'src/sass/dist',
        src: '*.map',
        dest: 'build/css/',
        expand: true
      },
      public: { // copy files in public folder
        cwd: 'src/public',
        src: '**/*',
        dest: 'build/',
        expand: true
      },
    },

    // sass compiler
    sass: {
      dist: {
        files: { // output.css : entrypoint.scss
          'src/sass/dist/compiled.css': 'src/sass/concat.scss'
        }
      }
    },

    // concat js, css files
    concat: {
      js: {
        src: ['src/js/1.js', 'src/js/2.js', 'src/js/3.js'], // target files
        dest: 'build/js/script.js', // output
      },
      css: {
        src: ['src/css/1.css', 'src/css/2.css', 'src/css/3.css', 'src/sass/dist/compiled.css'], // target files
        dest: 'build/css/style.css', // output
      },
    },

    // uglify js file
    uglify: {
      target: {
        options: {
          sourceMap: true, // include sourceMap
          mangle: {
            toplevel: true // shorten variables and functions name
          },
        },
        files: { // output.min.js : [target.js, target2.js]
          'build/js/script.min.js': ['build/js/script.js']
        }
      }
    },

    // minified css file
    cssmin: {
      target: {
        options: {
          sourceMap: true, // include sourceMap
        },
        files: { // output.min.css : [target.css, target2.css]
          'build/css/style.min.css': ['build/css/style.css']
        }
      }
    },

    // static server
    connect: {
      options: {
        livereload: 35729, // let's find out why ?
        base: 'build/', // target directory to be served in localhost
        port: 9009 // port
      },
      livereload : {
        options: {
          open: true, // for live reload
        }
      }
    },

    // watch configs (trigger when file changes)
    watch: {
      options :{ // integrate with connect config for live reloading
        livereload: '<%= connect.options.livereload %>',
        files: ['src/**/*.scss', 'src/**/*.css', 'src/**/*.js', 'src/*.html'] // watch those files for changes and make it live reload
      },
      sass: {
        files: ['src/sass/*.scss'],
        tasks: ['sass', 'concat:css', 'cssmin'], // when changes, compile sass, concat css and minified
      },
      css: {
        files: ['src/css/*.css'],
        tasks: ['concat:css', 'cssmin'], // when changes, concat css and minified
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['concat:js', 'uglify'], // when changes, concat js and uglify
      },
      html: {
        files: ['src/*.html'],
        tasks: ['copy'],  // when changes, copy file to build
      },
    },

  });

  // register tasks in here ...
  grunt.registerTask('default', ['copy', 'concat', 'sass', 'uglify', 'cssmin', 'connect:livereload', 'watch']);
}
