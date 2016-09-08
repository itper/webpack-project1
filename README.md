

初始化

>推荐node version>4.2.0

>npm install
>
>



构建dll库
>./build/dev_cli.js buildDll


构建所有入口
>./build/dev_cli.js buildAll


构建指定的入口
>./build/dev_cli.js build --target [entry]
>
>./build/dev_cli.js build --target app/index

支持热替换react的开发服务.
>./build/dev_cli.js dev --target [entry]

添加入口
>./build/dev_cli.js create [dir]

>以上命令都不会主动重新构建dll,可执行以下命令
>
>./build/dev_cli.js buildDll && ./build/dev_cli.js buid --target app/index

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