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
      const arr = [];
      specifiers.forEach((specifier) => {
        if (specifier.local.name === "Select") {
          isSelect = true;
          return;
        }
        arr.push(
          types.importSpecifier(
            specifier.local, // Table、Message
            types.identifier(specifier.local.name)
          )
        );
      });

      // 这里使用replaceWith和insertAfter而没有使用replaceWithMultiple 统一替换
      // 因为replaceWith替换后的代码 会插入到 node执行栈 最前面，从而不会影响到 babel-plugin-import CallExpression监听函数的处理
      // replaceWithMultiple替换后的 代码会 插入到 node执行栈 最后面。最后在处理
      path.replaceWith(
        // import { Table, Select, Message } from "@alifd/next"; 替换为  import { Table, Message } from "@alifd/next"
        types.importDeclaration(arr, types.stringLiteral("@alifd/next"))
      );
      path.insertAfter(
        types.importDeclaration(
          // 生成 import Select from "./MySelect";
          [types.ImportDefaultSpecifier(types.identifier("Select"))],
          types.stringLiteral("./MySelect")
        )
      );
    }
  },
};

module.exports = function (babel) {
  return {
    visitor,
  };
};
