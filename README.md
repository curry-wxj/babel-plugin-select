# babel插件
```jsx
// 将 所有的
import { Message, Button, Select } from '@alifd/next' 
// 转换为 
import { Message, Button } from '@alifd/next' 
import Select from './MySelect'
```

### 脚手架 create-react-app
- webpack.config.js增加配置 
- 将 cacheDirectory为true 删除（用于缓存babel编译结果）
```js
[
  "./babel-plugin-select",
  {
    loose: true,
    library: "@alifd/next",
  },
],
```

- 该插件会影响到 babel-plugin-import 的使用
- @alifd/next没有使用按需加载
- 全量引入了 import '@alifd/next/dist/next.css';