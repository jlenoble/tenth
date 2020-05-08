const { useBabelRc, override, disableEsLint } = require("customize-cra");
const path = require("path");

module.exports = {
  webpack(config, env) {
    const EXCLUDED_PLUGINS = ["ForkTsCheckerWebpackPlugin"];
    config.plugins = config.plugins.filter(
      (plugin) => !EXCLUDED_PLUGINS.includes(plugin.constructor.name)
    );
    return override(useBabelRc(), disableEsLint())(config, env);
  },
  paths: function (paths) {
    paths.appIndexJs = path.resolve(__dirname, "dev-build/src/index.js");
    paths.appSrc = path.resolve(__dirname, "dev-build/src");
    paths.appTsConfig = "";
    return paths;
  },
};
