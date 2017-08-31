var argv        = require('yargs').argv;
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var notify      = require('gulp-notify');
var prefixer    = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var sass        = require('gulp-sass');
var gutil       = require('gulp-util');
var babel       = require('gulp-babel');
var del         = require('del');

var config = {
  src: {
    base: './assets/',
    js: './assets/src/js/**/*.js',
    sass: './assets/src/scss/**/*.scss',
    html: './**/*.html',
    img: './assets/img/**/*',
    font: './assets/fonts/**/*'
  },
  dist: {
    base: './assets/',
    js: './assets/dist/js/',
    css: './assets/dist/css/',
    img: './assets/img/',
    font: './assets/fonts/'
  },
  clean: {
    js: './assets/dist/js/**/*',
    css: './assets/dist/css/**/*'
  },
  bower_path: './bower_components/',
  node_path: './node_modules/',
  browserSync_proxy: 'fed.road2hire.com'
};

gulp.task('build', function (cb) {
  return runSequence(['css:dist', 'js:dist'], cb);
});


/*
 ** CSS: Clean destination folder before processing css
 */
gulp.task('css:clean', function () {
  return del([config.clean.css], function (err, paths) {
    console.log("Cleaned CSS:\n", paths.join('\n'));
  });
});

/*
 ** CSS: Compile sass, add autoprefixer and minify
 */
gulp.task('css:compile', ['css:clean'], function() {
  return gulp.src(config.src.sass)
  .pipe(sass({
    sourceComments: 'none',
    errLogToConsole: true,
  }))
  .pipe(prefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(gulp.dest(config.dist.css))
  .pipe(notify({ message: 'CSS compiled, and moved to: ' + config.dist.css, onLast: true }))
  .pipe(browserSync.stream());
});

gulp.task('css:dist', function() {
  return runSequence('css:compile');
});

/*
 ** JS: Clean js folder before processing scripts
 */
gulp.task('js:clean', function () {
  return del([config.clean.js], function (err, paths) {
    console.log("Cleaned JS:\n", paths.join('\n'));
  });
});

/**
 ** JS: Build main js file
 */
gulp.task('js:build', ['js:clean'], function() {
  return gulp.src(config.src.js)
  .pipe(babel())
  .pipe(gulp.dest(config.dist.js))
  .pipe(browserSync.stream());
})

/*
 ** JS: Run the sequence related to JS
 */
gulp.task('js:dist', function() {
  return runSequence('js:build');
});

/*
 ** HTML: Watch files for browsersync
 */
 gulp.task('html:watch', function() {
   return gulp.src(config.src.html)
     .pipe(browserSync.stream());
 });

gulp.task('bs-reload', browserSync.reload);

gulp.task('default',['build'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(config.src.html, ['html:watch']);
  gulp.watch(config.src.sass, ['css:compile']);
  gulp.watch(config.src.js, ['js:build']);
});
