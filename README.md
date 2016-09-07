npm install

cd build

node webpack.dev.js --target 0/index



node node webpack.dev.js --global

node node webpack.dev.js --force --watch


更新8/30

npm install

npm run build  全局打包

npm run server 启动服务器

localhost:9000/0  进入入口0中的index.html
localhost:9000/1  进入入口1中的index.html



##重构

构建所有入口
>./build/dev_cli.js buildAll

构建dll库
>./build/dev_cli.js buildDll

构建指定的入口
>./build/dev_cli.js build --target

支持热替换react的开发服务.
>./build/dev_cli.js dev --target

添加入口
>./build/dev_cli.js [dir]


##CNPM

安装

>npm install -g cnpm --registry=https://registry.npm.taobao.org

registry url

[http://10.252.137.119:7001](http://10.252.137.119:7001)

安装依赖

>
cnpm install --save hello --registry=http://10.252.137.119:7001

设置registry地址.

>
cnpm set registry http://10.252.137.119:7001

web

[http://10.252.137.119:7001](http://10.252.137.119:7002)

发布

> cnpm login

> cnpm publish