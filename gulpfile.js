var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
	addStream = require('add-stream'),
    del = require('del'),
    angularTemplateCache = require('gulp-angular-templatecache'),
    connect = require('gulp-connect'),
    runSequence = require('run-sequence'),
	karmaServer = require('karma').Server,
	mainBowerFiles = require('main-bower-files'),
	//livereload = require('gulp-livereload'),
	//cache = require('gulp-cache'),
	create = require('gulp-cordova-create'),
	plugin = require('gulp-cordova-plugin'),
	android = require('gulp-cordova-build-android');


gulp.task('android', function(){
	runSequence('clean',['bower', 'styles', 'scripts', 'html'],'build' );
});

gulp.task('build', function(){
	var options = {
        dir: '.cordova',
        id: 'com.PokemonTool.app',
        name: 'PokemonTool'
    };

	return gulp.src('dist/client')
        .pipe(create(options))
        //.pipe(plugin('org.apache.cordova.dialogs'))
        //.pipe(plugin('org.apache.cordova.camera'))
        .pipe(android())
        .pipe(gulp.dest('dist/android'));
});


gulp.task('test', function(done){
	new karmaServer({
	    configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('docs', function(){
	runSequence('docs-clean', 'docs-create', 'docs-serve', 'docs-watch');
});

gulp.task('docs-create', [], function () {

	gulpDocs = require('gulp-ngdocs');
	var options = {
	};

	return gulp.src(['src/client/app/**/*.js', '!src/client/app/**/*.spec.js', '!src/client/app/bower_modules/**/*.js' ])
    	.pipe(gulpDocs.process(options))
    	.pipe(gulp.dest('dist/docs'));
});

gulp.task('docs-serve', function(){
	connect.server({
  		root: 'dist/docs/'
    });

});

gulp.task('docs-watch', function(){
	 gulp.watch(['src/client/app/**/*.js'], ['docs-create']);
});

gulp.task('docs-clean', function(){
	 return del('dist/docs/**', '!dist/client');
});




gulp.task('clean', function() {
    return del(['dist/**', '!dist', '.cordova']);
});


gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('dist/client/assets'));
});


gulp.task('styles', function() {
  return sass('src/client/app/assets/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/client/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/client/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(['src/client/app/**/*.js', '!src/client/app/**/*.spec.js', '!src/client/app/bower_modules/**/*.js' ])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/client'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/client'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/client/app/**/*.jpg')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/client/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('html', function(){
	return gulp.src( ['src/client/app/*.html', 'src/client/app/**/*.html'])
	.pipe(gulp.dest('dist/client'));
});

gulp.task('connect', function() {
  connect.server({
		root: './dist/client/'
  });
});

gulp.task('default', function() { /*'clean', */
  runSequence('clean',['bower', 'styles', 'scripts', 'html'], ['connect', 'watch']);
});

gulp.task('watch', function() {
  gulp.watch(['src/client/app/**/*.js'], ['scripts']);
  gulp.watch(['src/client/app/**/*.html'], ['html']);
  gulp.watch(['src/client/app/**/*.scss'], ['styles']);
});
