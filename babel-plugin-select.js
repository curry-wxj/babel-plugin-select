let types = require("@babel/types");
let visitor = {
  ImportDeclaration(path, ref = { opts: {} }) {
    let node = path.node;
    let specifiers = node.specifiers;
    if (
      ref.opts.library == node.source.value &&
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      // 没有 Select就不执行了 避免死循环
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

      path.replaceWithMultiple(newImports); // 用多个节点替换当前节点
    }
  },
};

module.exports = function (babel) {
  return {
    visitor,
  };
};
