import { task, series } from "gulp";

import "./watch";

task("tdd", series("watch"));
