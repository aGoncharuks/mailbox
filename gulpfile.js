"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var server = require("browser-sync");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');



gulp.task('browserify', function() {
  return browserify({
    entries: './app/app.js',
    debug: true
  })
  .bundle()
  .pipe(plumber())
  .pipe(source('script.js'))
  // .pipe(buffer())
  // .pipe(sourcemaps.init({loadMapsz: true}))
  // .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./tests'))
  .pipe(gulp.dest('./build/app'))
  .pipe(server.reload({stream: true}));
});

gulp.task("html", function() {
  return gulp.src([
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"))
    .pipe(server.reload({stream: true}));
});

gulp.task("style", function() {
  gulp.src("sass/main.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(minify())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("styleForDev", function() {
  gulp.src("sass/main.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
   imagemin.optipng({optimizationLevel: 3}),
   imagemin.jpegtran({progressive: true})
   ]))
   .pipe(gulp.dest("build/img"));
});


gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "./build",
    notify: false,
    open: true,
    ui: false
  });

  // gulp.watch("sass/**/*.{scss,sass}", ["styleForDev"]);
  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ['html']);
  gulp.watch("*.js", ["browserify"]);
  // gulp.watch("js/**/*.js").on("change", server.reload);

});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "bower_components/**",
      "html/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    // "styleForDev",
    "images",
    "symbols",
    'browserify',
    fn
  );
});
