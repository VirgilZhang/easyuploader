# 简介
**zq-easy-uploader**提供了一种简洁易用的上传文件方式，我们不用再去写 *form* 和 *input* 标签、去配置 *iframe* 接收上传返回值，只需通过上传配置项定义好各项参数和钩子函数，然后直接调用上传方法即可。

# 注意
**zq-easy-uploader**仅仅提供了上传以及处理接口数据的实现，并不提供任何UI元素，这也是它的特性之一，与界面元素完全解耦，你只需要在自己的项目里，给任意可视元素添加用户操作行为监听（比如click）来执行**zq-easy-uploader**的上传方法，你不能在页面初始化、异步回调、定时器等事件中使用upload方法，**这是由于浏览器出于安全考虑的限制，浏览器不允许非用户行为触发选择本地文件**，请务必注意。

# 安装
```sh
$ npm install zq-easy-uploader;
```

# 使用
## 1.1.2
配置项的**上传错误**钩子函数可以捕获更具体的错误消息了，如 *上传的文件类型不符合要求* 、*文件大小超过限制* 以及其他网络错误等，这意味着你不能再用Promise的catch方法去捕获这些错误了。
### 上传错误钩子函数
| 钩子 | 说明 | 参数 |
| ------ | ------ | ------ |
| errorCallback | 上传错误 | 错误消息（string） |

## 1.1.0
这个版本加入了上传过程的多项钩子函数，可以通过配置项来实现这些钩子函数以捕获上传过程中必要的数据。

同时也对使用方法进行了优化，但1.0.0的使用方式依然保留，你可以继续通过Promise的then方法去捕获上传完成以及用catch方法去监控上传错误，但建议您使用配置项的钩子函数去捕获这些事件。

### 上传配置项的钩子函数包括
| 钩子 | 说明 | 参数 |
| ------ | ------ | ------ |
| startCallback | 开始上传 | 选择的文件 |
| progressCallback | 上传进度 | 上传进度 |
| successCallback | 上传成功 | 接口返回值 |
| errorCallback | 上传错误 | 无 |

### 上传进度钩子函数的参数说明
上传进度钩子函数需要一个参数，用来接收上传进度数据，这个参数包括如下属性

| 属性名 | 数据类型 | 说明 |
| ------ | ------ | ------ |
| computable | boolean | 是否可以计算进度 |
| speed | number | 上传速度，单位是KB/秒 |
| progress | number | 上传进度，范围 0~1 |
| total | number | 文件总大小，单位KB |
| event | object | 上传进度的原生事件 |

### 上传配置项的其他属性包括
| 属性名 | 数据类型 | 说明 |
| ------ | ------ | ------ |
| action | string | 上传接口地址 |
| filter | string | 文件过滤 |
| maxsize | number | 文件大小限制，单位M |
| params | object | 其他业务参数 |

参考示例：
```js
//导入uploader
var uploader = require('zq-easy-uploader');

//定义一个配置项
let opt = {};
opt.action = "your.domain/upload"; //必填，上传接口地址
opt.filter = "jpg,jpeg,png"; //可选，文件过滤
opt.maxsize = 10; //可选，文件大小限制，单位M
opt.params = {userId: 16}; //可选，其他业务参数

//开始上传的钩子函数
opt.startCallback = (file)=>{
    console.log("文件开始上传", file); //file是已经开始上传的本地文件对象
}

//上传进度的钩子函数
opt.progressCallback = (object)=>{
    if(object.computable){
        console.log(
            "上传中...", 
            "当前速度：" + object.speed, 
            "已上传 " + Math.round(object.progress*100)+"%"
        )
    }
}

//上传成功的钩子函数
opt.successCallback = (data)=>{
    console.log("上传成功", data); //data是接口返回的数据
}

//设置上传配置项
uploader.setOption(opt);

//上传
//* 此方法，一定要在用户行为里去触发（比如用户的click事件）
//* 如果上传配置项实现了钩子函数，这里就不需要处理then和catch了
uploader.upload();
```

### 建议大家直接使用版本1.1.0，之前的版本请忽略，感谢支持。



## 1.0.2 （紧急修复1.0.1的bug）
使用方法同**1.0.0**，不要使用**1.0.1**版本，不要参考**1.0.1**的代码！

如果要检测开始上传事件，在配置方法中传入第五个参数：*开始上传回调函数*
```js
//配置uploader
uploader.config(
    "http://localhost:8080/uploader.do", //参数1：上传接口地址
    {userId:'136', token:'abc123'},      //参数2：请求参数，根据实际业务设置，不需要就传{}
    "jpg,png",                           //参数3：上传文件类型要求，用英文逗号分隔，不需要过滤就传空
    10,                                   //参数4：上传文件大小限制，单位：M
    ()=>{ console.log("文件开始上传...") }  //参数5：文件开始上传的回调
);
```

对于版本1.0.1的问题深表歉意！

我后续会对这个工具进行重构，让它的用法更简单，并实现多个必要的钩子函数，比如上传进度，敬请期待。

## 1.0.1 （不要安装这个版本，有bug！）
**新增特性：** 对上传结果返回值进行了扩展，增加了上传状态 *status*
- status 0 : 开始上传
- status 1 : 上传完成
- result : 上传的结果数据

```js
uploader.upload().then(data=>{
    if(data.status == 0){
        console.log("文件开始上传..."); //可以在这里显示loading
    }else if(data.status == 1){
        console.log("上传成功，结果：", data.result); //在这里取消loading
    }
}).catch(err=>{
    console.log("上传失败", err);
});
```

## 1.0.0
以下示例展示了1.0.0的使用方式
```js
//导入uploader
var uploader = require('zq-easy-uploader');

//配置uploader
uploader.config(
    "http://localhost:8080/uploader.do", //参数1：上传接口地址
    {userId:'136', token:'abc123'},      //参数2：请求参数，根据实际业务设置，不需要就传{}
    "jpg,png",                           //参数3：上传文件类型要求，用英文逗号分隔，不需要过滤就传空
    10                                   //参数4：上传文件大小限制，单位：M
);

//注意：调用uploader的upload方法，一定要在用户行为里去触发（比如用户的click事件）
//这是由于浏览器出于安全考虑的限制，浏览器不允许非用户行为触发选择本地文件
uploader.upload().then(result=>{
    console.log("上传成功", result);
    //如果后台接口数据是json格式，这里的result会是一个对象，否则是字符串
}).catch(err=>{
    console.log("上传失败", err);
});
```