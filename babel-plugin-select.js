let types = require("@babel/types");
let currentFilesDepend = [];
let visitor = {
  Program: {
    enter(path, { opts = {} }) {
      currentFilesDepend = [];
    },
    exit() {},
  },
  // 兼容babel-plugin-select CallExpression
  CallExpression(path, state) {
    const { node } = path;
    const isDep = node.arguments.find((arg) => {
      if (
        currentFilesDepend.includes(arg.name) &&
        path.scope.hasBinding(arg.name) &&
        path.scope.getBinding(arg.name).path.type === "ImportSpecifier"
      ) {
        return true;
      }
      return false
    });
    if (isDep) {
      const newCall = types.callExpression(node.callee, node.arguments);
      path.replaceWithMultiple([newCall]);
      // path.replaceWith(newCall);
      currentFilesDepend=[]
    }
  },
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
        currentFilesDepend.push(specifier.local.name);
        arr.push(
          types.importSpecifier(
            specifier.local,
            types.identifier(specifier.local.name)
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
