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
```js
[
  "./babel-plugin-select",
  {
    loose: true,
    library: "@alifd/next",
  },
],
```

- npm run start 启动服务
- npm run test 可以查看 插件的测试效果
