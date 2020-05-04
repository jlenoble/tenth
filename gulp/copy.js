import gulp from "gulp";
import newer from "gulp-newer";
import path from "path";
import { buildDir, gulpDir } from "./helpers/dirs";

const copyGlob = [
  path.join(path.join(buildDir, gulpDir, "**/*.json")),
  path.join(path.join(buildDir, gulpDir, "**/.*.json"))
];

function copyJson() {
  return gulp
    .src(copyGlob, { base: buildDir })
    .pipe(newer(buildDir))
    .pipe(gulp.dest(buildDir));
}

function watchJson(done) {
  gulp.watch(copyGlob, copyJson);
  done();
}

gulp.task("copy", gulp.series(copyJson, watchJson));
