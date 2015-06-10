module.exports = function(grunt) {

	// load grunt tasks
	grunt.loadNpmTasks('grunt-mocha-test');

	// configure tasks
	grunt.initConfig({

		mochaTest: {

			test: {
				options: {
					bail: true,
					reporter: 'spec',
					requie: 'should',
					timeout: 120000,
					slow: 300
				},
				src: ['test/**/*.js']
			}
		}
	});

	// register tasks
	grunt.registerTask('test', ['mochaTest']);
};