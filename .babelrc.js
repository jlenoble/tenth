module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    [
      "@babel/preset-typescript",
      {
        allExtensions: true
      }
    ]
  ],
  plugins: [
    [
      "babel-plugin-import",
      {
        libraryName: "@material-ui/core",
        libraryDirectory: "",
        camel2DashComponentName: false
      },
      "core"
    ],
    [
      "babel-plugin-import",
      {
        libraryName: "@material-ui/icons",
        libraryDirectory: "",
        camel2DashComponentName: false
      },
      "icons"
    ],
    "@babel/plugin-proposal-class-properties",
    [
      "@babel/plugin-proposal-decorators",
      {
        decoratorsBeforeExport: true
      }
    ],
    "@babel/plugin-proposal-object-rest-spread",
    "babel-plugin-add-module-exports"
  ]
};
