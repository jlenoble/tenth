import PolyPipe from "polypipe";
import babel from "gulp-babel";

// Transpile pipeline
export const transpilePipe = new PolyPipe(babel);
