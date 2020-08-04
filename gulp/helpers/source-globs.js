import GulpGlob from "gulpglob";
import { gulpDir, srcDir } from "./dirs";

// Gulpfile includes and helpers
export const gulpGlob = new GulpGlob(`${gulpDir}/**/*.js`);

// All src (transpilable) files
export const srcGlob = new GulpGlob(
  `${srcDir}/**/*.ts`,
  `${srcDir}/**/*.tsx`,
  `${srcDir}/**/*.js`,
  `${srcDir}/**/*.jsx`,
  `${gulpDir}/**/*.js`,
  "gulpfile.js",
  `!${srcDir}/index.js`
);

// All needed (config, includes) files (no JS)
export const copyGlob = new GulpGlob(
  `${srcDir}/**/*.graphql`,
  `${srcDir}/**/*.css`,
  `${srcDir}/**/*.svg`,
  `${gulpDir}/**/*.json`,
  `${gulpDir}/**/.*.*`,
  `${srcDir}/index.js`
);
