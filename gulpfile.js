var gulp = require('gulp'),
    //sass = require('gulp-ruby-sass'),
    //autoprefixer = require('gulp-autoprefixer'),
    //cssnano = require('gulp-cssnano'),
    //uglify = require('gulp-uglify'),
    //imagemin = require('gulp-imagemin'),
    //rename = require('gulp-rename'),
    //concat = require('gulp-concat'),
    //notify = require('gulp-notify'),
    del = require('del'),
    connect = require('gulp-connect'),
    runSequence = require('run-sequence'),
	//livereload = require('gulp-livereload'),
	//cache = require('gulp-cache'),
	mainBowerFiles = require('main-bower-files');




gulp.task('clean', function() {
    return del('dist/**');
});


gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('dist/assets'));
});


/*gulp.task('styles', function() {
  return sass('src/client/app/assets/main.scss', { style: 'expanded' })
    //.pipe(gulp.dest('dist'))
	
    //.pipe(autoprefixer('last 2 version'))
    //.pipe(gulp.dest('dist/client/css'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(cssnano())
    //.pipe(gulp.dest('dist/client/css'))
    //.pipe(notify({ message: 'Styles task complete' }));
});*/

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'))
	
	
	//.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    //.pipe(concat('main.js'))
    //.pipe(gulp.dest('dist/client'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    //.pipe(gulp.dest('dist/client'))
    //.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src(['src/**/*.jpg', 'src/**/*.png'])
    //.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist'))
    //.pipe(notify({ message: 'Images task complete' }));
});
gulp.task('sounds', function() {
  return gulp.src('src/**/*.mp3')
    .pipe(gulp.dest('dist'))
    //.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('html', function(){
	return gulp.src('src/**/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('connect', function() {
  connect.server({
		root: './dist/'
  });
});

gulp.task('default', function() { /*'clean', 'styles' */
  runSequence('clean',['bower', 'images', 'sounds', 'scripts', 'html'], ['connect', 'watch']);
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['scripts']);
  gulp.watch(['src/**/*.html'], ['html']);
  gulp.watch(['src/**/*.scss'], ['styles']);
});
