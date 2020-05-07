import gulp, { series } from "gulp";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import eslint from "gulp-eslint";
import filter from "gulp-filter";

const reportDir = "eslint-report";
const srcGlob = [
  "src/**/*.tsx",
  "src/**/*.js",
  "src/**/*.jsx",
  "src/**/*.ts",
  "gulp/**/*.js",
  "gulpfile.js",
];

const createReportDir = (path) => {
  const mkReportDirp = () => mkdirp(path);
  return mkReportDirp;
};

export const handleLint = () => {
  const f = filter(["**", "!*src/sandbox/**/*", "*src/sandbox/App2/**/*"]);

  return gulp
    .src(srcGlob)
    .pipe(f)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(
      eslint.format(
        "html",
        fs.createWriteStream(path.join(reportDir, "report.html"))
      )
    )
    .pipe(
      eslint.format(
        "json-with-metadata",
        fs.createWriteStream(path.join(reportDir, "report.json"))
      )
    );
};

gulp.task("lint", series(createReportDir(reportDir), handleLint));
