import gulp from "gulp";
import path from "path";
import execa from "execa";
import chalk from "chalk";
import { srcDir } from "./helpers/dirs";

const schemaDir = path.join(srcDir, "sandbox/App2/graphql-schemas");
const allTypeDefGlob = path.join(schemaDir, "**/*.graphql");

const execTypes = async () => {
  try {
    await execa("yarn", ["graphql-codegen"]);
  } catch (e) {
    let msg = chalk.yellow(e.stdout);
    msg += `\n${chalk.red(e.stderr)}`;
    console.log(msg);
  }
};

const watchTypes = (done) => {
  gulp.watch(allTypeDefGlob, execTypes);
  done();
};

gulp.task("codegen", gulp.series(execTypes, watchTypes));
