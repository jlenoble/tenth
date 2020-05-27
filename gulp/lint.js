import gulp, { series } from "gulp";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import eslint from "gulp-eslint";
import filter from "gulp-filter";

import { srcGlob } from "./helpers/source-globs";

const reportDir = "eslint-report";

const createReportDir = (path) => {
  const mkReportDirp = () => mkdirp(path);
  return mkReportDirp;
};

export const handleLint = () => {
  const f = filter([
    "**",
    "!*src/sandbox/**/*",
    "*src/sandbox/App2/**/*",
    "!*src/sandbox/App2/__generated__.ts",
  ]);

  return srcGlob
    .src()
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
