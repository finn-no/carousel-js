module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: ['src/finn/<%=pkg.name%>/**/*.js'],
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

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jstestdriver');

  grunt.registerTask('default', ['uglify', 'jstestdriver']);
};