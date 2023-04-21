let babel = require("@babel/core");
let types = require("@babel/types");
let i = 0;
let visitor = {
  ImportDeclaration(path, ref = { opts: {} }) {
    // ref.cwd: 当前执行目录
    // ref.opts: 插件 options
    // ref.filename: 当前文件名(绝对路径)
    // ref.file: BabelFile 对象，包含当前整个 ast，当前文件内容 code，etc.
    // ref.key: 当前插件名字
    let node = path.node;
    let specifiers = node.specifiers;
    if (
      ref.opts.library == node.source.value &&
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      let isSelect = specifiers.find((v) => v.local.name === "Select");
      if (!isSelect) {
        return;
      }
      const newImports = [];
      const arr = [];
      // const newSpecifiers = specifiers.filter((v) => v.local.name !== "Select"); // 等同于arr
      specifiers.forEach((specifier) => {
        if (specifier.local.name === "Select") {
          newImports.push(
            types.importDeclaration(
              [types.ImportDefaultSpecifier(specifier.local)],
              types.stringLiteral("./MySelect")
            )
          );
          isSelect = true;
          return;
        }
        arr.push(
          types.importSpecifier(
            specifier.local,
            types.stringLiteral(specifier.local.name)
          )
        );
      });

      newImports.push(
        types.importDeclaration(arr, types.stringLiteral("@alifd/next"))
      );

      path.replaceWithMultiple(newImports); // 用多个替换一下
    }
  },
};

module.exports = function (babel) {
  return {
    visitor,
  };
};
