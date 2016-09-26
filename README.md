
## Webpack插件

    将Html-webpack-plugin中插入的JS,CSS资源从绝对路径改为相对路径！

## 说明

1. 图片等资源仍以 ../../../ 的绝对路径访问（因为定位到了根目录下）；

2. HTML中插入的JS,CSS以相对路径的方式访问；