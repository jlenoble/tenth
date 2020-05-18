import gulp from "gulp";
import del from "del";
import path from "path";
import execa from "execa";
import chalk from "chalk";
import { srcDir, buildDir } from "./helpers/dirs";

const schemaDir = path.join(srcDir, "sandbox/App2/graphql-schemas");
const allSchemaDefGlob = path.join(schemaDir, "**/*.graphql");

const execSchemas = async () => {
  try {
    await execa("yarn", ["graphql-codegen"]);
  } catch (e) {
    let msg = chalk.yellow(e.stdout);
    msg += `\n${chalk.red(e.stderr)}`;
    console.log(msg);
  }
};

const watchSchemas = (done) => {
  const watcher = gulp.watch(
    allSchemaDefGlob,
    { events: ["add", "change"] },
    execSchemas
  );

  watcher.on("unlink", (file) => {
    const buildFile = path.join(buildDir, file);
    del(buildFile).catch(() => {});
  });

  done();
};

gulp.task("codegen", gulp.series(execSchemas, watchSchemas));
