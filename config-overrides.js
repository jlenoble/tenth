const { useBabelRc, override, disableEsLint } = require("customize-cra");
const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
  webpack(config, env) {
    config.resolve.extensions.push(".wasm");

    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
        if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
          oneOf.exclude.push(/\.wasm$/);
        }
      });
    });

    const EXCLUDED_PLUGINS = ["ForkTsCheckerWebpackPlugin"];

    config.plugins = config.plugins
      .filter((plugin) => !EXCLUDED_PLUGINS.includes(plugin.constructor.name))
      .concat([
        new WasmPackPlugin({
          crateDirectory: path.resolve(__dirname, "src/sandbox/learn_rust"),
          outDir: path.resolve(__dirname, "dev-build/src/pkg"),
        }),
      ]);

    return override(useBabelRc(), disableEsLint())(config, env);
  },

  paths: function (paths) {
    paths.appIndexJs = path.resolve(__dirname, "dev-build/src/index.js");
    paths.appSrc = path.resolve(__dirname, "dev-build/src");
    paths.appTsConfig = "";
    return paths;
  },
};
