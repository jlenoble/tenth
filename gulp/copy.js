import gulp from "gulp";
import newer from "gulp-newer";
import path from "path";
import { buildDir, srcDir, gulpDir } from "./helpers/dirs";

const copyGlob = [
  path.join(path.join(gulpDir, "**/*.json")),
  path.join(path.join(gulpDir, "**/.*.json")),
  path.join(path.join(srcDir, "**/*.graphql")),
];

function copyFiles() {
  return gulp
    .src(copyGlob, { base: "." })
    .pipe(newer(buildDir))
    .pipe(gulp.dest(buildDir));
}

function watchFiles(done) {
  gulp.watch(copyGlob, copyFiles);
  done();
}

gulp.task("copy", gulp.series(copyFiles, watchFiles));
