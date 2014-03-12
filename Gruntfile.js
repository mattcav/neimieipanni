module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'nested'
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
     
      homeScript: {
        src: [
          'js/analytics.js',
          'bower_components/jquery/dist/jquery.js',
          'js/vendor/boxlayout.js',
          'bower_components/greensock/src/minified/TweenMax.min.js',
          'js/home-script.js'
        ],
        dest: 'js/build/home.js'
      },

      AppScript: {
        src: [
          'js/analytics.js',
          'bower_components/jquery/dist/jquery.js',
          'bower_components/foundation/js/foundation.min.js',
          'bower_components/foundation/js/foundation/foundation.offcanvas.js',
          'bower_components/foundation/js/foundation/foundation.interchange.js',
          'js/app.js',

          'bower_components/angular/angular.min.js',
          'js/appConfig.js',
          'js/appServices.js',
          'js/appControllers.js',
          'js/appDirectives.js',
          'js/appFilters.js'
        ],
        dest: 'js/build/app.js'
      },

      Static: {
        src: [
          'js/analytics.js',
          'bower_components/jquery/dist/jquery.js',
          'bower_components/foundation/js/foundation.min.js',
          'js/app.js'
        ],
        dest: 'js/build/static.js'
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
      benjamin: {
        src: ['scenes/benjamin/scene*.json'],
        dest: 'scenes/benjamin/all.json',
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
      Home: {
        src: 'js/build/home.js',
        dest: 'js/build/home.min.js'
      },
      Static: {
        src: 'js/build/static.js',
        dest: 'js/build/static.min.js'
      },
      Game: {
        src: 'js/build/app.js',
        dest: 'js/build/app.min.js'
      }
    },

    cmq: {
      options: {
        log: false
      },
      your_target: {
        files: {
          'css/cmq': ['css/*.css']
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/cmq',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
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
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('clean', ['cmq', 'cssmin']);
  grunt.registerTask('build', ['sass', 'autoprefixer', 'connect', 'concat', 'uglify']);
  grunt.registerTask('default', ['build', 'watch']);
}