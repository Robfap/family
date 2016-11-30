var gulp = require('gulp');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var fs = require("fs");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var envify = require('envify/custom');
var gutil = require('gulp-util');

var paths = {
    app: __dirname + '/app',
    build: __dirname + '/build',
    scripts: '/scripts',
    styles: '/styles',
    index: '/index.html',
    bundleJs: 'bundle.js'
};


gulp.task('connect', function() {
  connect.server({
    port: 9000,
    root: 'app',
    fallback: paths.app + paths.index,
    livereload: true
  });
});

gulp.task('connect:build', function() {
    connect.server({
        port: 9001,
        root: 'build',
        fallback: paths.build + paths.index,
        livereload: false
    });
});

gulp.task('watch', function() {
  gulp.watch( [ 'gulpfile.js', paths.app + paths.scripts + '/**/*.*'], [ /*'eslint',*/ 'babelify']);
  gulp.watch( [paths.app + paths.styles + '/**/*.scss'], ['css:modify'] );
});

gulp.task('lint', function() {
  return gulp.src(paths.app + paths.scripts + '/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('eslint', function() {
  return gulp.src(paths.app + paths.scripts + '/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('css:modify', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 versions', '> 1%', 'ie >= 9']})
  ];

  return gulp.src(paths.app + paths.styles + '/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(processors))
      .pipe(gulp.dest(paths.app + '/dist'));
});

gulp.task('babelify', function() {
  return browserify(paths.app + paths.scripts + '/main.js', {debug: true})
    .transform("babelify", {
      presets: ["es2015", "react"],
      plugins: ["transform-object-rest-spread"]
    })
      .transform(envify({
          NODE_ENV: process.env.NODE_ENV,
          PLATFORM: gutil.env.platform
      }))
    .bundle()
    .pipe(source(paths.bundleJs))
    .pipe(gulp.dest(paths.app + '/dist'))
    .pipe(connect.reload());
});

gulp.task('rebuild:scripts', ['babelify'], function () {
    return gulp
        .src(paths.app + '/dist/' + paths.bundleJs)
        .pipe(uglify())
        .pipe(gulp.dest(paths.build + '/dist/'));
});

gulp.task('rebuild:styles', ['css:modify'], function () {
  return gulp
      .src(paths.app + '/dist/main.css')
      .pipe(cleanCSS({debug: true}, function(details) {
        gutil.log(details.name + ': ' + details.stats.originalSize);
        gutil.log(details.name + ': ' + details.stats.minifiedSize);
      }))
      .pipe(gulp.dest(paths.build + '/dist/'));
});

gulp.task('copy:index', function () {
  return gulp
      .src(paths.app + paths.index)
      .pipe(gulp.dest(paths.build));
});

gulp.task('clean:build', function() {
  return gulp.src([paths.build])
      .pipe(clean());
});

gulp.task('build', ['eslint'], function () {
    runSequence('apply-prod-environment', 'clean:build', ['rebuild:scripts', 'rebuild:styles', 'copy:index']);
});

gulp.task('prod:watch', function () {
    runSequence('build', 'connect:build');
});

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('default', ['connect', /*'lint',*/ 'babelify', 'watch']);


/*
    gulp - developer mode
    gulp build - prepare files for production serving
    gulp connect:build - serving production environment for checking
    gulp prod:watch - building and serving production environment for checking
 */