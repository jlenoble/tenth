import { task, watch } from "gulp";
import path from "path";
import del from "del";
import { handleBuild as build } from "./build";

const buildDir = "dev-build";
const srcGlob = ["src/**/*.tsx", "src/**/*.js", "src/**/*.jsx", "src/**/*.ts"];

export const startWatching = (done) => {
  const watcher = watch(srcGlob, { events: ["add", "change"] }, build);

  watcher.on("unlink", (file) => {
    const buildFile = path.join(buildDir, file.replace(/(\.[\w]+)$/, ".js"));
    const mapFile = path.join(buildDir, file.replace(/(\.[\w]+)$/, ".js.map"));
    del(buildFile).catch(() => {});
    del(mapFile).catch(() => {});
  });

  done();
};

task("watch", startWatching);
