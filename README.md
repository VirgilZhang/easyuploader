# 简介
**zq-easy-uploader**提供了一种简洁易用的上传文件方式，我们不用再去写 *form* 和 *input* 标签、去配置 *iframe* 接收上传返回值，只需要调用一个方法，然后通过 *Promise* 处理返回数据以及捕获错误即可。

# 注意
**zq-easy-uploader**仅仅提供了上传以及处理接口数据的实现，并不提供任何UI元素，这也是它的特性之一，与界面元素完全解耦，你只需要在自己的项目里，给任意可视元素添加用户操作行为监听（比如click）来执行**zq-easy-uploader**的上传方法，你不能在页面初始化、异步回调、定时器等事件中使用upload方法，**这是由于浏览器出于安全考虑的限制，浏览器不允许非用户行为触发选择本地文件**，请务必注意。

# 安装
```sh
$ npm install zq-easy-uploader;
```

# 使用
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