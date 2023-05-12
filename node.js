const babel = require("@babel/core");
const babelPluginImport = require("./babel-plugin-import");
const babelPluginSelect = require("./babel-plugin-select");
function babelCode(code) {
  const r = babel.transform(code, {
    // plugins: [{ visitor: babelPluginImport().visitor }],
    plugins: [
      [{ visitor: babelPluginSelect().visitor }, { library: "@alifd/next" }],
      [
        { visitor: babelPluginImport().visitor },
        { libraryName: "@alifd/next", style: true },
      ],
      // [
      //   'babel-plugin-import',
      //   { libraryName: "@alifd/next", style: true },
      // ],
    ],
  });

  return { code: r.code };
}

let a = babelCode(
  `
  import { Component } from "react";
import { Table, Select, Message } from "@alifd/next";
console.log(Table, Select, Message)
  `
);
console.log(a.code);
