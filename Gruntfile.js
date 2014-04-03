module.exports = function (grunt) {
    // 以下代码初始化Grunt任务
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		// 编译styl -> css
		stylus: {
				compile: {
						options: {
							paths: ['./assets/styl'],
							urlfunc: 'embedurl'
						},
						files: {
							'./assets/css/index.css': './assets/styl/index.styl'
						}
				}
		},

        // 压缩css任务
        cssmin: {
            css: {
                files: [{
                    src : ['./assets/css/reset.css', './assets/css/index.css'],
                    dest: './assets/dist/index.min.css'
                }]
            }
        },

        closureBuilder:  {
            options: {
                closureLibraryPath: './assets/closure/closure-library/',
                builder: './assets/closure/closure-library/closure/bin/build/closurebuilder.py',
                namespaces: 'joke.index',
                compilerFile: './assets/closure/closure-compiler/build/compiler.jar',
                output_mode: 'compiled',
                compile: true,
                compilerOpts: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS' //  ADVANCED_OPTIMIZATIONS
                    ,define: ["'goog.DEBUG=false'"]
                    ,output_wrapper: '(function(){%output%})();'
                },
                execOpts: {
                    maxBuffer: 999999 * 1024
                }
            },
            closureBuilderjs: {
                src: ['./assets/src', './assets/closure/closure-library/'],
                dest: './assets/dist/index.min.js'
            }
        },

        closureDepsWriter: {
            options: {
                closureLibraryPath: './assets/closure/closure-library/',
                depswriter: './assets/closure/closure-library/closure/bin/build/depswriter.py',
                root: ['./assets/closure/closure-library/'],
                root_with_prefix: '"./assets/src ../../../../src"'
            },
            closureDepsWriterjs: {
                dest: './assets/closure/closure-library/closure/goog/deps.js'
            }
        },

        // watch任务
        watch: {
            options: {
                livereload: true,
                interrupt: true,
                nospawn: true,
                atBegin : true
            },
			styl: {
				files: ['./assets/styl/*.styl'],
				tasks: ['stylus']
			},
			css: {
					files: ['./assets/css/*.css'],
					tasks: ['cssmin']
			},
			deps: {
				files: ['./assets/src/**/*.js'],
				tasks: ['closureDepsWriter']
			},
			build : {
				files: ['./assets/src/**/*.js'],
				tasks: ['closureBuilder']
			}
        }

    });

    // 加载package.json中的想用插件
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-closure-tools');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 注册一个任务，第二参数可以是数组或者字符串
    // 默认会执行default任务.
    grunt.registerTask('default', ['stylus', 'cssmin', 'closureDepsWriter', 'closureBuilder']);

    /**
     * 单个任务执行
     */

    grunt.registerTask('styl', ['stylus']); // 触发编译styl -> css
    grunt.registerTask('css', ['cssmin']); // 压缩css文件
    grunt.registerTask('build', [ 'closureBuilder']); // 编译deps依赖文件
    grunt.registerTask('deps', ['closureDepsWriter']); // 编译合并javascript文件

    /**
     * 自动编译
     */
	
    grunt.registerTask('wstyl', ['stylus', 'watch:styl']); // 自动触发编译styl -> css
    grunt.registerTask('wcss', ['cssmin', 'watch:css']); //　自动压缩css文件
    grunt.registerTask('wdeps', ['closureDepsWriter', 'watch:deps']); // 自动编译deps依赖文件
    grunt.registerTask('wbuild', ['closureBuilder', 'watch:build']); // 自动编译合并javascript文件


};

