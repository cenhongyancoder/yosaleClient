var ROLETYPE;
var framesView=function(){
    var currentPage = setCurrentPage(); // current page当前页
  /*  if(currentPage!="merchant_mgr.html"&&(!USER||!USER.userId)){
        window.location.href = "merchant_mgr.html";
        return;
    }*/
 /*   ROLETYPE=byNumGetObj(3);*/
/*    var homePage=sessionStorage.getItem(ROLETYPE.s+'Home');*/
//    $('.home-page-bread').attr('href',homePage);
    function setCurrentPage(){
        var lsPath=location.pathname;
        var index=lsPath.lastIndexOf('/');
        return lsPath.substring(index+1,lsPath.length);
    }
    var $body=$('body'),$settingsPane=$body.find('.settings-pane'),$pageContainer=$body.find('.page-container'),$settingsPaneIn=$body.find('.settings-pane-inner'),$sidebarMenu=$body.find('.sidebar-menu');
    function createFrames(){
        showHead();
        getSideConfig();
        settingsPaneToggle();
      //  showCopyright(COMPANY);
    }
    function showHead() {
        var loHead={};
     /*   loHead=configHead(ROLETYPE);*/
        showLogo(loHead);
        showUserInfo(loHead);
    }
    function configHead(ao){
   /*     var roleType=ao.s||'';
        var obj=$.extend({},USER);
        obj.logo='img/logo.png';
        obj.brandName=COMPANY.name;
        obj.parent=COMPANY.name;
        obj.userRole=ao.n||'';
        if(roleType=="ADMIN"){
            obj.myInfo='user_edit_info.html';
        }else{
            obj.myInfo='user_edit_'+roleType.toLowerCase()+'.html';
        }
        return obj;*/
    }
    function showLogo(ao){
        var html='';
        html='<div class="brand-logo">';
        html+='<div class="logo-img"><img src="'+(ao?ao.logo:'img/logo.png')+'" alt="Logo" class="img-responsive img-rounded" height="50" width="50"></div>';
        html+='<div class="brand-info"><div class="brand-name">'+(ao?ao.brandName:'云制造')+'</div><div>& YoSale</div></div>';
        html+='</div>';
        //html+='<div class="settings-icon"><a href="#" data-toggle="settings-pane" data-animate="true"><i class="icon-cog"></i></a></div>';
        $('.logo-env').html(html);
    }
    function showUserInfo(ao){
        var html='';
        html+='<ul class="nav navbar-nav pull-right">' +
            //'<li class="dropdown" id="header-notification"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i><span class="badge">7</span></a></li>' +
            '<li class="dropdown header-user" id="header-user">' +
            '<div class="dropdown-toggle clearfix" data-toggle="dropdown">' +
            '<div class="user-headportrait"><img width="30" alt="" src="'+(ao&&ao.headPortrait?getPicUrlForCode(ao.headPortrait,1,2):'img/headPortrait.png')+'" /></div>' +
            '<div class="user-info"><p class="username" style="line-height:40px;">'+(ao?ao.userName:'未知用户')+'</p>' +
            //'<p>&nbsp;</p>' +
            '</div>' +
            // '<p>'+(ao?ao.parent:'云制造')+(ao?ao.userRole:'未知角色')+'</p></div>' +
            '<i class="icon-angle-down"></i>' +
            '</div>' +
            '<ul class="dropdown-menu">' +
            // '<li><a href="'+(ao?ao.myInfo:'#')+'"><i class="fa fa-user"></i> 我的信息</a></li>' +
            '<li><a href="user_edit_pwd.html"><i class="fa fa-cog"></i> 密码修改</a></li>' +
            '<li><a href="merchant_mgr.html"><i class="fa fa-power-off"></i> 退出</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>';
        $('.user-info-nav').append(html);
    }
    function showCopyright(ao){
        var html='';
        // html+='<p>'+(ao.copyright||'')+'</p>';
     //   html+='<p>'+(ao.company||'')+'</p>';
        // html+='<p>'+(ao.record||'')+'</p>';
        $('.company-copyright',$('.sidebar-menu')).html(html);
    }
    /*----------------sidebar----------------------*/
    function getSideConfig(){
        $.get('json/side_config.json',function(res){
           var config=res.config&&res.config['ADMIN']?res.config['ADMIN'].list||[]:[];
            var list=res.list||[];
            var level=getLevel(config);
            var lxMenu=roleSideConfig(level,list);
          //  sessionStorage.setItem(ROLETYPE.s+'sideBar',JSON.stringify(lxMenu));
            sideBarView(lxMenu);
        },'json');
    }
    function getLevel(arr,unit,mer,item,n){
        if (unit==null) unit = 2;
        if (mer==null) mer = {};
        if (n==null)   n=0;
        var brecu = false;
        if (n==0) item=mer;
        for (var i=0; i<arr.length; i++){
            var str = arr[i].substring(0,n*unit+unit);
            if (arr[i].substring(n*unit+unit)!=""){
                brecu = true;
            }
            if (item.c==null)  item.c=[];
            var xrr = item.c;
            var bpush = true;
            for (var j=0; j<xrr.length; j++){
                if (xrr[j].id==str || str.length - (item.id||"").length !=unit ){
                    bpush = false;
                    break;
                }
            }
            if (str.substring(0,str.length-unit) == (item.id||"")){
                if (bpush) xrr.push({id:str});
                //bpush&&item.c.push({id:str});
            }
        }
        if (brecu){
            n++;
            for (var i=0; i<item.c.length; i++){
                getLevel(arr,unit,mer,item.c[i],n);
            }
            n--;
        }
        return mer.c;
    }
    function roleSideConfig(ar1, ar2) {
        var arr = [];
        for (var i = 0; i < ar1.length; i++) {
            for (var j = 0; j < ar2.length; j++) {
                if (ar1[i].id == ar2[j].id) {
                    arr[i] = ar2[j];
                    if (ar1[i].c && ar1[i].c.length > 0) {
                        arr[i].children = roleSideConfig(ar1[i].c, ar2[j].children);
                    }
                    break;
                }
            }
        }
        return arr;
    }
    function sideBarView(ar){
        if(!ar){
            return;
        }
        $('.sidebar-menu-inner').html(createSideBar(ar));
        setupSidebarMenu();
        findDimensions();
        sidebarMenuOpen();
    }
    function createSideBar(ar,ab){
        var items=ar||[];
        var html='';
        html='<ul class="'+(ab?'sub':'main-menu')+'">';
        for(var i=0;i<items.length;i++){
            var item=items[i];
            if(item.children && item.children.length>0){
                html+='<li class="has-sub expanded">';
                // html+='<a href="'+(item.path||'javascript:;')+'"><i></i><span>'+item.name+'</span><span class="arrow"></span></a>';
                html+='<a href="'+(item.path||'javascript:;')+'"><i class="'+(item.icon||'')+'"></i><span>'+item.name+'</span><span class="icon-angle-left"></span></a>';
                html+=createSideBar(item.children,1);
                html+='</li>';
            }else{
                html+='<li><a href="'+(item.path||'javascript:;')+'"><i class="'+(item.icon||'')+'"></i><span>'+item.name+'</span><span></span></a></li>';
            }
        }
        html+='</ul>';
        return html;
    }
    // Element Attribute Helper
    function attrDefault($el, data_var, default_val){
        if(typeof $el.data(data_var) != 'undefined')
        {
            return $el.data(data_var);
        }
        return default_val;
    }
    // Settings Pane Toggle
    function settingsPaneToggle(){
        $('a[data-toggle="settings-pane"]').each(function(i, el){
            $(el).on('click', function(ev) {
                ev.preventDefault();
                var use_animation = attrDefault($(el), 'animate', false);
                var scroll = {
                    top: $(document).scrollTop(),
                    toTop: 0
                };
                if($body.hasClass('settings-pane-open')){
                    scroll.toTop = scroll.top;
                }
                TweenMax.to(scroll, (use_animation ? .1 : 0), {//TweenMax  一款动画插件
                    top: scroll.toTop,
                    roundProps: ['top'],
                    ease: scroll.toTop < 10 ? null : Sine.easeOut,
                    onUpdate: function () {
                        $(window).scrollTop(scroll.top);
                    },
                    onComplete: function () {
                        if (use_animation) {
                            // With Animation
                            $settingsPaneIn.addClass('with-animation');
                            // Opening
                            if (!$settingsPane.is(':visible')) {
                                $body.addClass('settings-pane-open');
                                var height = $settingsPane.outerHeight(true);
                                $settingsPane.css({
                                    height: 0
                                });
                                TweenMax.to($settingsPane, .25, {
                                    css: {height: height}, ease: Circ.easeInOut, onComplete: function () {
                                        //$settingsPane.css({height: ''});
                                    }
                                });
                                $settingsPaneIn.addClass('visible');
                            } else {// Closing
                                $settingsPaneIn.addClass('closing');
                                TweenMax.to($settingsPane, .25, {
                                    css: {height: 0}, delay: .15, ease: Power1.easeInOut, onComplete: function () {
                                        $body.removeClass('settings-pane-open');
                                        $settingsPane.css({height: ''});
                                        $settingsPaneIn.removeClass('closing visible');
                                    }
                                });
                            }
                        }else {// Without Animation
                            $body.toggleClass('settings-pane-open');
                            $settingsPaneIn.removeClass('visible');
                            $settingsPaneIn.removeClass('with-animation');
                        }
                    }
                });
            });
        });
    }
    function sidebarMenuOpen(){
        if ($sidebarMenu.length) {
            var height=200;
            var $ele=$('a[href="'+currentPage+'"]',$sidebarMenu);
            if($ele.length){
                $ele.parent().addClass('active').parents('.has-sub').addClass('active expanded');
                var offTop=$ele.offset().top;
                if(offTop>height){
                    setTimeout(function(){
                        $('.sidebar-menu-inner').scrollTop(offTop-height);
                    });
                }
            }
        }
    }
    // Sideber Menu Setup function
    function setupSidebarMenu(){
        if ($sidebarMenu.length) {
            var $items_with_subs = $sidebarMenu.find('li:has(> ul)'),
                toggle_others = $sidebarMenu.hasClass('toggle-others');
            //$items_with_subs.filter('.active').addClass('expanded');
            $items_with_subs.each(function (i, el) {
                var $li = jQuery(el),
                    $a = $li.children('a'),
                    $sub = $li.children('ul');
                //$li.addClass('has-sub');
                $a.on('click', function (ev) {
                    ev.preventDefault();
                    if (toggle_others) {
                        sidebarMenuCloseItemsSiblings($li);
                    }
                    if ($li.hasClass('expanded') || $li.hasClass('opened')) {
                        sidebarMenuItemCollapse($li, $sub);
                    }else{
                        sidebarMenuItemExpand($li, $sub);
                    }
                });
            });
        }
    }
    var sm_duration = .2,
        sm_transition_delay = 150;
    function sidebarMenuItemExpand($li, $sub) {
        if ($li.data('is-busy') || ($li.parent('.main-menu').length && $sidebarMenu.hasClass('collapsed')))
            return;

        $li.addClass('expanded').data('is-busy', true);
        $sub.show();

        var $sub_items = $sub.children(),
            sub_height = $sub.outerHeight(),

            win_y = jQuery(window).height(),
            total_height = $li.outerHeight(),
            current_y = $sidebarMenu.scrollTop(),
            item_max_y = $li.position().top + current_y,
            fit_to_viewpport = $sidebarMenu.hasClass('fit-in-viewport');

        $sub_items.addClass('is-hidden');
        $sub.height(0);
        // $sub.slideDown(function(){
        //     $sub.height('');
        // });
        TweenMax.to($sub, sm_duration, {
            css: {height: sub_height}, onComplete: function () {
                $sub.height('');
            }
        });
        var interval_1 = $li.data('sub_i_1'),
            interval_2 = $li.data('sub_i_2');

        window.clearTimeout(interval_1);

        interval_1 = setTimeout(function () {
            $sub_items.each(function (i, el) {
                var $sub_item = jQuery(el);

                $sub_item.addClass('is-shown');
            });

            var finish_on = sm_transition_delay * $sub_items.length,
                t_duration = parseFloat($sub_items.eq(0).css('transition-duration')),
                t_delay = parseFloat($sub_items.last().css('transition-delay'));

            if (t_duration && t_delay) {
                finish_on = (t_duration + t_delay) * 1000;
            }

            // In the end
            window.clearTimeout(interval_2);

            interval_2 = setTimeout(function () {
                $sub_items.removeClass('is-hidden is-shown');

            }, finish_on);


            $li.data('is-busy', false);

        }, 0);

        $li.data('sub_i_1', interval_1),
            $li.data('sub_i_2', interval_2);
    }
    function sidebarMenuItemCollapse($li, $sub) {
        if ($li.data('is-busy'))
            return;

        var $sub_items = $sub.children();

        $li.removeClass('expanded').data('is-busy', true);
        $sub_items.addClass('hidden-item');
        // $sub.slideDown(function(){
        //     $li.data('is-busy', false).removeClass('opened');
        //
        //     $sub.attr('style', '').hide();
        //     $sub_items.removeClass('hidden-item');
        //
        //     $li.find('li.expanded ul').attr('style', '').hide().parent().removeClass('expanded');
        // });
        TweenMax.to($sub, sm_duration, {
            css: {height: 0}, onComplete: function () {
                $li.data('is-busy', false).removeClass('opened');

                $sub.attr('style', '').hide();
                $sub_items.removeClass('hidden-item');

                $li.find('li.expanded ul').attr('style', '').hide().parent().removeClass('expanded');

            }
        });
    }
    function sidebarMenuCloseItemsSiblings($li) {
        $li.siblings().not($li).filter('.expanded, .opened').each(function(i, el)
        {
            var $_li = jQuery(el),
                $_sub = $_li.children('ul');

            sidebarMenuItemCollapse($_li, $_sub);
        });
    }
    function findDimensions() { //函数：获取尺寸
        var navTop=81,navBottom=40;
        var winHeight=0;
        //获取窗口高度
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        }else if ((document.body) && (document.body.clientHeight)) {
            winHeight = document.body.clientHeight;
        }

        //通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight) {
            winHeight=document.documentElement.clientHeight;
        }

        //设置div的具体宽度=窗口的宽度的%
        $('.sidebar-menu-inner').css({"height":winHeight-(navTop+navBottom)+'px'});
    }
    return {
        init:function(){
            createFrames();
        },
        findDimensions:findDimensions
    }
}();
$('document').ready(function () {
        framesView.init();
    }
);
window.onresize=framesView.findDimensions;