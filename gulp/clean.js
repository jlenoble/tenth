import { task } from "gulp";
import del from "del";

export const handleClean = () => {
  return Promise.all([del("dev-build")]);
};

task("clean", handleClean);
