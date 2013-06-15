module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
          'src/finn/**/*.js',
          'test/finn/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%=pkg.name%> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>.' + ' Copyright (c) <%= grunt.template.today("yyyy") %> FINN.no AS - http://finn.no/; Licensed MIT */\n'
      },
      build: {
        src: ['src/finn/core.js', 'src/finn/elementBuilder.js', 'src/finn/<%=pkg.name%>/**/*.js'],
        dest: 'dist/<%= pkg.name %>-<%=pkg.version%>.min.js'
      }
    },
    jstestdriver: {
      options: {
        canFail: true,
        verbose: true
      },
      files: ["test/resources/jsTestDriver.conf"]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jstestdriver');

  grunt.registerTask('default', ['jshint', 'jstestdriver', 'uglify']);
};