"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const newer = require("gulp-newer");
const debug = require("gulp-debug");
const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const autoreload = require("autoreload-gulp");
const usePlumbedGulpSrc = require("plumb-gulp").usePlumbedGulpSrc;
const useOriginalGulpSrc = require("plumb-gulp").useOriginalGulpSrc;

const gulpSrc = "gulp/**/*.js";
const buildDir = "dev-build";
const gulpDir = path.join(`${buildDir}`, "gulp");
const autoTask = "tdd";

usePlumbedGulpSrc();

try {
  // Attempt to load all include files from gulpDir
  fs.readdirSync(gulpDir)
    .filter(function (filename) {
      return filename.match(/\.js$/);
    })
    .forEach(function (filename) {
      require(path.join(process.cwd(), gulpDir, filename));
    });

  require(path.join(
    process.cwd(),
    gulpDir,
    "helpers/cleanup"
  )).keepTopProcessAliveTillAutoTaskExits();

  gulp.task(
    autoTask,
    gulp.parallel(
      gulp.series("tdd:transpile:gulp", "types", "tdd:transpile:src"),
      "copy"
    )
  );

  // If success, start infinite dev process with autoreload
  gulp.task("default", autoreload(autoTask, gulpDir));
} catch (err) {
  // If error, try to regenerate include files

  // First make sure to abort on first subsequent error
  useOriginalGulpSrc();

  // Load special babel config
  const babelRc = require("./gulp/helpers/.babelrc.json");

  // define regeneration functions
  function transpileGulp() {
    return gulp
      .src(gulpSrc, {
        base: "."
      })
      .pipe(newer(buildDir))
      .pipe(debug({ title: "Build gulp include:" }))
      .pipe(babel(babelRc))
      .on("error", function (err) {
        gutil.log(chalk.red(err.stack));
      })
      .pipe(gulp.dest(buildDir));
  }

  function watchGulp(done) {
    gulp.watch(gulpSrc, transpileGulp);
    done();
  }

  const gulpDir = "gulp";
  const copyGlob = [
    path.join(gulpDir, "**/*.json"),
    path.join(gulpDir, "**/.*.json")
  ];

  function copy() {
    return gulp
      .src(copyGlob, { base: "." })
      .pipe(newer(buildDir))
      .pipe(debug({ title: "Build gulp include:" }))
      .pipe(gulp.dest(buildDir));
  }

  // Distinguish between missing gulpDir ...
  if (
    err.message.match(new RegExp(`no such file or directory, scandir`)) ||
    err.message.match(/Task never defined/) ||
    err.message.match(/Cannot find module '\.\.?\//)
  ) {
    gutil.log(chalk.red(err.message));
    gutil.log(chalk.yellow(`'${gulpDir}/**/*.js' incomplete; Regenerating`));

    // ... And errors due to corrupted files
  } else {
    gutil.log(chalk.red(err.stack));
  }

  gulp.task(autoTask, watchGulp);

  gulp.task(
    "default",
    gulp.series(
      gulp.parallel(copy, transpileGulp),
      autoreload(autoTask, gulpDir)
    )
  );
}
