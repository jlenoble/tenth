import { task } from "gulp";
import del from "del";
import { buildDir } from "./helpers/dirs";

export const handleClean = () => {
  return Promise.all([del(buildDir)]);
};

task("clean", handleClean);
