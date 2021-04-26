const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
    // 针对antd按需打包  只打包import的部分 (使用babel-plugin-import)
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#d10100'},
    }),
);
