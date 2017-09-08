/**
 * Created by Administrator on 2017/7/13.
 */

var test = '45';
var SERVER_URL = "http://" + window.location.host + "/";
var OPEN_API = "yosale/ys/rest/";
var UPLOAD_URL = "http://192.168.0.104:8080/yosale/uploadFile.action";
var authtoken = localStorage.getItem('token');
var showElTip = function(asEL,asInfo,aspl){
    $(asEL).tooltip('destroy');
    if (!aspl) aspl="bottom";
    $(asEL).attr({"title":asInfo,"data-toggle":"tooltip","data-placement":aspl});
    $(asEL).addClass('tooltip-toggle');
    // $(asEL).tooltip({html:true});
    $(asEL).tooltip('show');
    setTimeout(function(){
        $(asEL).tooltip('destroy');
    },2000);
}

//获取当前地址栏URL参数并返回obj
var getRequest = function () {
    var lshref = document.location.href;
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function obj2str (obj) {
    return encodeURIComponent(JSON.stringify(obj));
}
function str2obj(str) {
    return JSON.parse(decodeURIComponent((str == "") ? null : str));
}

function toBase64(input_file,imgPath, get_data){

    if (imgPath == "") {
        alert("请选择上传图片！");
        return;
    }
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1);
    if (strExtension != 'jpg' && strExtension != 'gif'
        && strExtension != 'png' && strExtension != 'bmp') {
        alert("请选择图片文件");
        return;
    }

    /*input_file：文件按钮对象*/
    /*get_data: 转换成功后执行的方法*/
    if (typeof (FileReader) === 'undefined') {
        alert("抱歉，你的浏览器不支持本网站图片操作，建议使用chrome浏览器！");
    } else {
        try {
            /*图片转Base64 核心代码*/
            var file = input_file.files[0];
            //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
            if (!/image\/\w+/.test(file.type)) {
                alert("请确保文件为图像类型");
                return false;
            }
            var reader = new FileReader();
            reader.onload = function () {
                get_data(this.result);
            }
            reader.readAsDataURL(file);
        } catch (e) {
            alert('图片上传出错啦！' + e.toString())
        }
    }
}

var MOPG = getRequest();

var uploadIMG = {										//-----图片上传组件-----//
    imgEl:null,
    isInit:false,
    isSingle:true,
    singleClass:"ui-upload",
    multipleClass:"ui-upload-group",
    otherClass:"ui-upload-group2",
    singleAppendF:"ui-upload-append",
    singleAppendS:"ui-upload-append2",
    init : function(){
        var lxsingle   = $("."+this.singleClass);
        var lxmultiple = $("."+this.multipleClass);
        var lxmulother = $("."+this.otherClass);
        var lxsingleappendf = $("."+this.singleAppendF);
        var lxsingleappends = $("."+this.singleAppendS);
        if (!uploadIMG.isInit&&(lxsingle.length>0||lxmultiple.length>0||lxmulother.length>0)){		//单图片
            $('body').append('<form method="post" enctype="multipart/form-data" class="single-upload" style="display:none" target="UploadFrame"><input type="file" name="files" class="single-file"/></form>');
        }
        if (!uploadIMG.isInit&&lxmultiple.length>0){	//图片组
            $('body').append('<form method="post" enctype="multipart/form-data" class="multiple-upload" style="display:none" target="UploadFrame"><input type="file" name="files" class="multiple-file" multiple/></form>');
            for (var i=0; i<lxmultiple.length; i++){
                var lxImgs = eval($(lxmultiple[i]).attr("imgList")||'')||[];
                var liuploadtype = $(lxmultiple[i]).attr("imageType")||0;
                var liuploadsize = $(lxmultiple[i]).attr("imageSize")||0;
                var lsH = "";
                for (var j=0; j<lxImgs.length; j++){
                    lsH += '<div>';
                    lsH += '<img class="'+this.singleClass+'" imageSrc="'+lxImgs[j].image+'" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'" imageId="'+lxImgs[j].imageId+'" src="'+ getPicUrlForCode(lxImgs[j].image,liuploadsize,liuploadtype) +'">';
                    lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)"></span>';
                    lsH += '</div>';
                }
                lsH += '<div class="btn multiple-upload-btn" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'"><i class="glyphicon glyphicon-cloud-upload"></i>图片上传</div>';
                $(lxmultiple[i]).append(lsH);
            }
        }
        if (!uploadIMG.isInit&&lxmulother.length>0){	//图片组
            $('body').append('<form method="post" enctype="multipart/form-data" class="multiple-upload" style="display:none" target="UploadFrame"><input type="file" name="files" class="multiple-file" multiple/></form>');
            for (var i=0; i<lxmultiple.length; i++){
                var lxImgs = eval($(lxmulother[i]).attr("imgList")||'')||[];
                var liuploadtype = $(lxmulother[i]).attr("imageType")||0;
                var liuploadsize = $(lxmulother[i]).attr("imageSize")||0;
                var lsH = "";
                for (var j=0; j<lxImgs.length; j++){
                    lsH += '<div>';
                    lsH += '<img class="'+this.singleClass+'" imageSrc="'+lxImgs[j].image+'" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'" imageId="'+lxImgs[j].imageId+'" src="'+ getPicUrlForCode(lxImgs[j].image,liuploadsize,liuploadtype) +'">';
                    lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)"></span>';
                    lsH += '</div>';
                }
                lsH += '<div class="btn multiple-upload-btn" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'"><i class="glyphicon glyphicon-cloud-upload"></i>图片上传</div>';
                $(lxmulother[i]).append(lsH);
            }
        }
        if (!uploadIMG.isInit&&lxsingleappendf.length>0){	//单张图图片组
            $('body').append('<form method="post" enctype="multipart/form-data" class="single-upload" style="display:none" target="UploadFrame"><input type="file" name="files" class="single-file"/></form>');
            for (var i=0; i<lxsingleappendf.length; i++){
                var lxImgs = eval($(lxsingleappendf[i]).attr("imgList")||'')||[];
                var liuploadtype = $(lxsingleappendf[i]).attr("imageType")||0;
                var liuploadsize = $(lxsingleappendf[i]).attr("imageSize")||0;
                var lsH = "";
                for (var j=0; j<lxImgs.length; j++){
                    lsH += '<div>';
                    lsH += '<img class="'+this.singleClass+'" imageSrc="'+lxImgs[j].image+'" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'" imageId="'+lxImgs[j].imageId+'" src="'+ getPicUrlForCode(lxImgs[j].image,liuploadsize,liuploadtype) +'">';
                    lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)"></span>';
                    lsH += '</div>';
                }
                lsH += '<div class="btn single-upload-btn" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'"><i class="glyphicon glyphicon-cloud-upload"></i>图片上传</div>';
                $(lxsingleappendf[i]).append(lsH);
            }
        }
        if (!uploadIMG.isInit&&lxsingleappends.length>0){	//单张图图片组
            $('body').append('<form method="post" enctype="multipart/form-data" class="single-upload2" style="display:none" target="UploadFrame"><input type="file" name="files" class="single-file2"/></form>');
            for (var i=0; i<lxsingleappends.length; i++){
                var lxImgs = eval($(lxsingleappends[i]).attr("imgList")||'')||[];
                var liuploadtype = $(lxsingleappends[i]).attr("imageType")||0;
                var liuploadsize = $(lxsingleappends[i]).attr("imageSize")||0;
                var lsH = "";
                for (var j=0; j<lxImgs.length; j++){
                    lsH += '<div>';
                    lsH += '<img class="'+this.singleClass+'" imageSrc="'+lxImgs[j].image+'" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'" imageId="'+lxImgs[j].imageId+'" src="'+ getPicUrlForCode(lxImgs[j].image,liuploadsize,liuploadtype) +'">';
                    lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)"></span>';
                    lsH += '</div>';
                }
                lsH += '<div class="btn single-upload-btn2" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'"><i class="glyphicon glyphicon-cloud-upload"></i>图片上传</div>';
                $(lxsingleappends[i]).append(lsH);
            }
        }
        if (!uploadIMG.isInit){
            $('body').append('<iframe class="UploadFrame" onload="if (typeof uploadIMG.checkupFile!= \'undefined\'){ uploadIMG.checkupFile()}" name="UploadFrame" style="display:none"></iframe>');
        }
        $("."+this.singleClass).on('click',function(){
            var liuploadtype = $(this).attr("imageType")||0;
            $(".single-upload").attr("action", UPLOAD_URL);
            uploadIMG.imgEl = $(this);
            uploadIMG.isSingle = true;
            $('.single-file').click();
        });
   /*     $("."+this.singleAppendF).on('click',function(){ //单图片累加
            $(".single-upload").attr("action", UPLOAD_URL);
            uploadIMG.imgEl = $(this);
            uploadIMG.isSingle = false;
            $('.single-file').click();
        });
*/
        $('.single-file').on('change',function(){
            if ($(this).val()=="") return;
            uploadIMG.uploading();
            $('.single-upload').submit();
        });
        $('.single-file2').on('change',function(){
            if ($(this).val()=="") return;
            uploadIMG.uploading();
            $('.single-upload2').submit();
        });

        $(".single-upload-btn").on('click',function(event){
            event.stopPropagation();
            var liuploadtype = $(this).attr("imageType")||0;
            $(".single-upload").attr("action",UPLOAD_URL);
            uploadIMG.imgEl = $(this);
            uploadIMG.isSingle = false;
            $('.single-file').click();
            return false;
        });

        $(".single-upload-btn2").on('click',function(event){
            event.stopPropagation();
            var liuploadtype = $(this).attr("imageType")||0;
            $(".single-upload2").attr("action",UPLOAD_URL);
            uploadIMG.imgEl = $(this);
            uploadIMG.isSingle = false;
            $('.single-file2').click();
            return false;
        });

        $(".multiple-upload-btn").on('click',function(){
            var liuploadtype = $(this).attr("imageType")||0;
            $(".multiple-upload").attr("action",UPLOAD_URL);
            uploadIMG.imgEl = $(this);
            uploadIMG.isSingle = false;
            $('.multiple-file').click();
        });
        $('.multiple-file').on('change',function(){
            if ($(this).val()=="") return;
            uploadIMG.uploading();
            $('.multiple-upload').submit();
        });
        uploadIMG.isInit=true;
    },
    uploading : function (){
        waitLoading.show();
    },
    removeImg:function(ae){
        if (confirm("确实要删除这张图片?")){
            $(ae).parent().remove();
        }
    },
    checkupFile:function(){
        waitLoading.hide();
        var lsText = $(".UploadFrame")[0].contentWindow.document.body.innerText||$(".UploadFrame")[0].contentWindow.document.body.textContent;
        if (lsText!=""&&lsText!=null){
            var obj=JSON.parse(lsText);
            if (obj.rcd!='00'){
                alert(obj.rmk);
                return;
            }
            if(obj.imageInfos.length>0){
                var le = $(uploadIMG.imgEl);
                var lx = obj.imageInfos;
                var liuploadtype = $(uploadIMG.imgEl).attr("imageType")||0;
                var liuploadsize = $(uploadIMG.imgEl).attr("imageSize")||0;
                if (uploadIMG.isSingle){
                    le.attr({
                        'src':getPicUrlForCode(lx[0].imgUrl,liuploadsize,liuploadtype),
                        'imageSrc':lx[0].imgUrl,
                        'imageStr':lx[0].imgStr
                    });
                }else{
                    var lsH = '';
                    for (var i=0; i<lx.length; i++){
                        lsH += '<div>';
                        lsH += '<img class="'+this.singleClass+' new-upload" imageSrc="'+lx[i].imgUrl+'" imageStr="'+lx[i].imgStr+'" src="'+ getPicUrlForCode(lx[i].imgUrl,liuploadsize,liuploadtype) +'">';
                        lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)" style=""></span>';
                        lsH += '</div>';
                    }
                    le.before(lsH);
                    $(".new-upload").on('click',function(){
                        var liuploadtype = JSON.parse($(this).attr("conf")||'{"type":0}').type||0;
                        $(".single-upload").attr("action",UPLOAD_URL);
                        uploadIMG.imgEl = $(this);
                        uploadIMG.isSingle = true;
                        $('.single-file').click();
                    });
                    $(".new-upload").removeClass("new-upload");
                }
            }else{
                alert('图片上传失败了!');
            }
        }
    },
    getGroupList : function(ae) {
        if (ae == null) ae = $("." + this.singleAppendF)[0];
        var lxImgs = $(ae).find('img');
        var lxData = [];
        for (var i = 0; i < lxImgs.length; i++) {
            var leImg = $(lxImgs[i]);
            lxData[lxData.length] = {"image": leImg.attr("imageStr"), sn: i};
        }
        return lxData;
    },
    getGroupListOther : function(ae){
        if (ae==null) ae = $("."+this.singleAppendS)[0];
        var lxImgs = $(ae).find('img');
        var lxData = [];
        for (var i=0; i<lxImgs.length; i++){
            var leImg = $(lxImgs[i]);
            lxData[lxData.length] = {"image":leImg.attr("imageStr"),sn:i};
        }
        return lxData;
    }
}
var waitLoading = {
    time : null,
    isInit : false,
    init: function () {
        if(!this.isInit){
            var html = '';
            html = '<div class="wait-loading-mask col-md-12"	style="height:100%;background:rgba(0,0,0,.7);position:fixed;top:0;z-index:999;display:none;">';
            html += '<div class="col-md-1 col-md-offset-6" style="margin-top:300px">';
            html += '<img class="img-responsive" src="img/loading.gif"></div></div>';
            $('body').append(html);
            this.isInit=true;
        }
    },
    show: function () {
        var me=this;
        $('.wait-loading-mask').css('display','block');
        this.time=setTimeout(function(){
            me.hide();
        },60000)
    },
    hide: function () {
        $('.wait-loading-mask').css('display','none');
        clearTimeout(this.time);
    }
}

var getPicUrlForCode =  function(url,v,t){		//t: 0-产品图; 1-设计师图; 2-头像图; 3-名片图;
    var ptype = t||0;
    var psize = "";
    if (t==0||t==1){
        psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/200/h/150/q!/85":(v==2)?"?imageView2/1/w/800/h/600/q!/85":"?imageView2/1/w/1600/h/1200/q!/85";
    }else if (t==2){
        psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/50/h/50/q!/85":(v==2)?"?imageView2/1/w/200/h/200/q!/85":"?imageView2/1/w/600/h/600/q!/85";
    }else if (t==3){
        psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/60/h/90/q!/85":(v==2)?"?imageView2/1/w/200/h/300/q!/85":"?imageView2/1/w/600/h/900/q!/85";
    }
    var picUrl = url + psize;
    return picUrl;
};

try {
    template.helper("getPicUrl", function(url,v,t){
        var ptype = t||0;
        var psize = "";
        if (t==0||t==1){
            psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/200/h/150/q!/85":(v==2)?"?imageView2/1/w/800/h/600/q!/85":"?imageView2/1/w/1600/h/1200/q!/85";
        }else if (t==2){
            psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/50/h/50/q!/85":(v==2)?"?imageView2/1/w/200/h/200/q!/85":"?imageView2/1/w/600/h/600/q!/85";
        }else if (t==3){
            psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/60/h/90/q!/85":(v==2)?"?imageView2/1/w/200/h/300/q!/85":"?imageView2/1/w/600/h/900/q!/85";
        }
        var picUrl = url + psize;
        return picUrl;
    });
} catch(e) {}