// load the plugins
var gulp       = require('gulp'),
    less       = require('gulp-less'),
    minifyCSS  = require('gulp-minify-css'),
    rename     = require('gulp-rename'),
    jshint     = require('gulp-jshint'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    nodemon    = require('gulp-nodemon');

// task for checking js files for errors, type 'gulp js' to run by itself
gulp.task('js', function() {
return gulp.src(['server.js', 'client/**/*.js', 'client/app.js', 'server/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// task to lint, minify, and concat frontend angular files
// type 'gulp angular' to run by itself
gulp.task('angular', function() {
  return gulp.src(['client/app.js', 'client/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

// watch the following files for changes and make sure to update
gulp.task('watch', function() {

  // watch js files and run lint and run js and angular tasks
  gulp.watch(['server/**/*.js'], ['js']);
  gulp.watch(['server.js', 'client/**/*.js', 'client/app.js'], ['js', 'angular']);
});

// use nodemon wtih gulp
gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js less html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

// defining the main gulp task
gulp.task('default', ['nodemon'])
