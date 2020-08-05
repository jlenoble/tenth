import GulpTask from "gulptask";
import { buildDir } from "./helpers/dirs";
import { copyGlob } from "./helpers/source-globs";

import { copyPipe, copyRustPipe } from "./helpers/pipes";

new GulpTask({
  name: "copy",
  glob: copyGlob,
  dest: buildDir,
  pipe: copyPipe,
});

new GulpTask({
  name: "copy-rust",
  glob: ["dev-build/rust/**/*", "dev-build/rust/.*"],
  dest: "src/sandbox/learn_rust",
  pipe: copyRustPipe,
});
