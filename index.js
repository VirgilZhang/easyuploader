// 上传配置项
let uploadOption = {
    action:"http://localhost/uplad.do", //上传接口
    filter:"", //文件类型过滤器
    maxsize:50, //文件上传大小限制，单位：M
    params:null, //请求参数
    startCallback:null //开始上传的回调函数
}

//配置方法
let config = (action, params, filter, maxsize, startcb)=>{
    if(action!=null && action!=""){
        uploadOption.action = action;
    }
    if(filter!=null){
        uploadOption.filter = filter;
    }
    if(maxsize!=null && !isNaN(maxsize)){
        uploadOption.maxsize = maxsize;
    }
    if(params!=null){
        uploadOption.params = params;
    }
    uploadOption.startCallback = startcb;
}

//上传方法
let upload = (resolve, reject)=>{
    let input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = function(){
        let file = input.files[0];
        let tmparr = file.name.split(".");
        let fileType =  tmparr[tmparr.length-1].toLowerCase();
        if(uploadOption.filter!=null && uploadOption.filter!=""){
            let filterArr = uploadOption.filter.split(",");
            let notFilter = true;
            for(let i=0; i<filterArr.length; i++){
                if(fileType == filterArr[i].toLowerCase()){
                    notFilter = false;
                    break;
                }
            }
            if(notFilter){
                //文件类型不符合要求
                reject("文件类型不符合要求");
                return;
            }
        }
        let sizeM = file.size/1024/1024;
        if(sizeM > uploadOption.maxsize){
            //文件大小不符合要求
            reject("文件大小不符合要求");
            return;
        }
        var form = new FormData();
        form.append("file", file);
        form.append("fileName", file.name);
        form.append("size", file.size);
        if(uploadOption.params!=null){
            for(let key in uploadOption.params){
                form.append(key, uploadOption.params[key]);
            }
        }
        var xhr = new XMLHttpRequest();
        var action = uploadOption.action;
        xhr.open("POST", action);
        xhr.send(form);
        if(uploadOption.startCallback!=undefined && uploadOption.startCallback!=null){
            uploadOption.startCallback();
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                if(xhr.status==200){
                    try {
                        var resultObj = JSON.parse(xhr.responseText);
                        resolve(resultObj);
                    } catch (error) {
                        resolve(xhr.responseText);
                    }
                }else{
                    reject("上传失败，网络错误");
                }
            }
        }
    }
}

//创建一个返回Promise的上传方法
let uploadPr = ()=>{
    return new Promise(upload);
}

exports.uploader = {
    config: config,
    upload: uploadPr
}