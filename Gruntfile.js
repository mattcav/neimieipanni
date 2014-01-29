module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
        }
      }
    },

    autoprefixer: {
      single_file: {
        options: {
          browsers: ['last 2 version', 'ie 8', 'ie 7']
        },
        src: 'css/app.css',
        dest: 'css/app.css'
      },
    },

    concat: {
      dist: {
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/foundation/js/foundation.min.js',
          'js/app.js'
        ],
        dest: 'js/build/app.js'
      },
      irina: {
        src: ['scenes/irina/scene*.json'],
        dest: 'scenes/irina/all.json',
        options: {
          banner: '[',
          footer: "]",
          separator: ','
        }
      },
      zhang: {
        src: ['scenes/zhang/scene*.json'],
        dest: 'scenes/zhang/all.json',
        options: {
          banner: '[',
          footer: "]",
          separator: ','
        }
      },
      didier: {
        src: ['scenes/didier/scene*.json'],
        dest: 'scenes/didier/all.json',
        options: {
          banner: '[',
          footer: "]",
          separator: ','
        }
      },
      fatima: {
        src: ['scenes/fatima/scene*.json'],
        dest: 'scenes/fatima/all.json',
        options: {
          banner: '[',
          footer: "]",
          separator: ','
        }
      }
    },

    uglify: {
      build: {
        src: 'js/build/app.js',
        dest: 'js/build/app.min.js'
      }
    },



    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass', 'autoprefixer']
      },

      options: {
        livereload: true,
      }
    }

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('build', ['sass', 'autoprefixer', 'connect', 'concat', 'uglify']);
  grunt.registerTask('default', ['build', 'watch']);
}