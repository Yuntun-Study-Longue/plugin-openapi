# plugin-openapi

> fork from @umijs/plugin-openapi.

## Install

Using npm:

```bash
$ npm install --save-dev plugin-openapi
```

or using yarn:

```bash
$ yarn add plugin-openapi --dev
```

root config folder

```
import { join } from 'path';
export default {
  openAPI: {
      projectName: 'luna',
      requestLibPath: "import request from 'axios'",
      // schemaPath: join(__dirname, 'openapi.json'),
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json",
      serversPath: 'api', // default is './src/services'
      genType: 'js', // js or ts
      mock: false
  },
  plugins: ["plugin-openapi"],
}
```

run shell
```
$ npx umi openapi // need npm install umi
```
