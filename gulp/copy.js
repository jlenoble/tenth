import GulpTask from "gulptask";
import { buildDir } from "./helpers/dirs";
import { copyGlob } from "./helpers/source-globs";

import { copyPipe } from "./helpers/pipes";

new GulpTask({
  name: "copy",
  glob: copyGlob,
  dest: buildDir,
  pipe: copyPipe,
});
