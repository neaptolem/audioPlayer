var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');



gulp.task('stylesheets:stylus', function() {
    return gulp.src('./src/styles/*.styl')
        .pipe(stylus({
            'include css': true,
            'compress': true
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
});

gulp.task('templates', function () {
  return gulp.src('./src/**/**.jade')
    .pipe(jade({
      // pretty: true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function() {
    return gulp.src('./dist')
        .pipe(clean());
});

gulp.task('watch', ['clean'], function() {
    gulp.watch(['./src/*.html', './src/*.jade'], ['templates']);
    gulp.watch('./src/styles/*.styl', ['stylesheets:stylus']);
    gulp.watch('./src/js/*.js', ['addJS']);

});

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000
    });
});

gulp.task('addStatic', function(){
  return gulp.src('./static/*.mp3')
  .pipe(gulp.dest('./dist/music'));
});
gulp.task('addJS', function(){
  return gulp.src('./src/js/*.js')
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./dist/js'));
});


gulp.task('default', ['clean'], function() {
    gulp.start('stylesheets:stylus', 'templates','watch', 'addStatic','addJS','connect');
});
