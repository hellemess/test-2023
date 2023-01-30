const gulp = require("gulp");
const plumber = require("gulp-plumber");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const mqpacker = require("css-mqpacker");
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const server = require("browser-sync").create();

const build = (done) => {
  done();
};

const clean = (done) => {
  del("build");
  done();
};

const copy = (done) => {
  gulp.src([
    "img/**",
    "*.html"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));

  done();
};

const htmlCopy = (done) => {
  gulp.src("*.html")
    .pipe(gulp.dest("build"));

  done();
};

const htmlUpdate = (done) => {
  server.reload();
  done();
};

const serve = (done) => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("less/**/*.less", gulp.series(styles));
  gulp.watch("*.html", gulp.series(htmlCopy, htmlUpdate));
  done();
};

const styles = (done) => {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());

  done();
};

exports.build = gulp.series(clean, copy, styles);
exports.serve = gulp.series(clean, copy, styles, serve);