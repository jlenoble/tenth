import PolyPipe from "polypipe";
import babel from "gulp-babel";
import debug from "gulp-debug";

const babelRc = require("./.babelrc.json");

// Transpile pipeline
export const transpilePipe = new PolyPipe([babel, babelRc]);
