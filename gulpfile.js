'use strict';

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    imagemin    = require('gulp-imagemin'),
    svgmin      = require('gulp-svgmin'),
    notify      = require('gulp-notify'),
    del         = require('del'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    include     = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

gulp.task('styles', function () {
    var sassOptions = {
        defaultEncoding: 'UTF-8',
        lineNumbers: true,
        style: 'expanded',
        precision: 8
    };
    gulp.src('src/scss/main.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({message: 'Sass task complete'}));
});

gulp.task('scripts', function () {
    return gulp.src([
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('vendorscripts', function () {
    return gulp.src([
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            'bower_components/holderjs/holder.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/assets/js/vendor'))
        .pipe(gulp.dest('dist/assets/js/vendor'))
        .pipe(notify({message: 'VendorScripts task complete'}));
});

gulp.task('include', function () {
    return gulp.src('src/**/*.html')
        .pipe(include({
            prefix: '@@',
            basepath: 'src'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(notify({message: 'Include task complete'}));
});

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(notify({message: 'HTML task complete'}));
});

gulp.task('images', function () {
    return gulp.src('src/assets/images/**/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(notify({message: 'Images task complete'}));
});

gulp.task('svg', function () {
    return gulp.src('src/assets/svg/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('dist/assets/svg'))
        .pipe(notify({message: 'SVG task complete'}));
});

gulp.task('icons', function () {
    return gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(notify({message: 'Icons task complete'}));
});

gulp.task('bootstrap-icons', function () {
    return gulp.src('bower_components/bootstrap-sass/assets/fonts/bootstrap/*')
        .pipe(gulp.dest('dist/assets/fonts/bootstrap'))
        .pipe(notify({message: 'Bootstrap Icons task complete'}));
});

gulp.task('favicon', function () {
    return gulp.src([
            'src/favicon.ico',
            'src/apple-touch-icon-precomposed.png'
        ])
        .pipe(gulp.dest('dist'))
        .pipe(notify({message: 'Favicon task complete'}));
});

gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

gulp.task('build', ['include', 'styles', 'vendorscripts', 'favicon', 'images', 'svg', 'icons', 'bootstrap-icons']);

gulp.task('default', ['build']);

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function () {

    browserSync({
        server: "./dist"
    });

    gulp.watch("dist/images/*", ['images']);
    gulp.watch("src/scss/**/*.scss", ['styles']);
    gulp.watch("src/**/*.html", ['include']);
    gulp.watch("dist/styles/*").on('change', reload);
    gulp.watch("dist/**/*.html").on('change', reload);
});