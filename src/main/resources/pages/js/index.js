
/**
 * 右键连接时记录连接的pk，用于编辑删除等
 */
var curConnectPk = "";
/**当前操作的表 */
var curTableName = "";
/**
 * 菜单配置
 */
var titleMenu = [
    {
        name:'文件',
        code:'file',
        action:[
            {
                name:'新建连接',
                method:'toAddConnect()'
            },{
                name:'导出连接',
                method:'pleaseWait()',
            },{
                name:'退出',
                method:'closeMainWindow()',
            }
            
        ]
    },{
        name:'工具',
        code:'tool',
        action:[
            {
                name:'导入数据',
                method:'pleaseWait()'
            },{
                name:'导出数据',
                method:'pleaseWait()'
            }
        ]
    },{
        name:'帮助',
        code:'help',
        action:[
            {
                name:'github',
                method:'openGithub()'
            },{
                name:'关于',
                method:'pleaseWait()'
            }
        ]
    }
]

/**
 * 根据菜单创建菜单DOM
 */
var createMenuHtml = function(){
    var finalHtml = '';
    for(var menuItemIndex in titleMenu){
        var menuItem = titleMenu[menuItemIndex];
        finalHtml += '<div class="dropdown">';
        finalHtml += '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu'+menuItem.code+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
        finalHtml += menuItem.name;
        finalHtml += '</button>';
        finalHtml += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu'+menuItem.code+'">';
        for(var clickItemIndex in menuItem.action){
            var clickItem = menuItem.action[clickItemIndex];
            finalHtml += '<li><a href="#" onclick="'+clickItem.method+'">'+clickItem.name+'</a></li>';
        }
        finalHtml += '</ul></div>';
    }
    $("#headPart").html(finalHtml);
}

/**
 * 关闭主窗口
 */
var closeMainWindow = function(){
    connectController.closeMainWindow();
}

/**
 * 打开新建连接窗口
 */
var toAddConnect = function(){
    document.body.click();
    connectController.toAddConnect();
}

/**
 * 刷新使用，获取连接信息
 */
var getConnectList = function(){
    var result = connectController.findAll();
    return result;
}

var changeConnectNum = function(num){
    $("#connectNum").html(num);
}
            
var clickBody = function(e){
    var e=e||event
    if(e.button==2){
        console.log('鼠标右键点击');
    }
}

var openGithub = function(){
    connectController.openGithub();
}

var pleaseWait = function(){
    connectController.pleaseWait();
}

/**
 * 获得文字长度
 */
var getLength = function(str) {
    return str.replace(/[\u0391-\uFFE5]/g,"aa").length*12+10;  
}  

/**
 * 此方法是一个空方法，用于react绑定到内部方法中，实现react组件使用java调用刷新
 */
var refreshAll = function(){}

/**
 * react组件首次加载方法绑定到外部调用
 * @param {*} list 
 */
var initConnect = function(list){}

/**
 * 绑定react组件关闭连接方法
 * @param {*} connectPk 
 */
var disConnect = function(connectPk){}

/**
 * react绑定方法
 * @param {*} connectPk 
 */
var addConnectList = function(connectPk){}

/**
 * 
 * @param {react绑定方法} listJson 
 */
var initTable = function(listJson){}

/**react绑定方法 */
var openTable = function(openTableName){}

/**react绑定方法 */
var changeActiveIndex = function(index){}

/**react绑定方法 */
var initOpenTableList = function(list){}

/**react绑定方法 */
var doUp = function(){}

/**react绑定方法 */
var cancelAllActiveLine = function(){}

/**react绑定方法 */
var addManyActiveLine = function(){}

/**react绑定方法 */
var doTableSchemaUp = function(){}

/**react绑定方法 */
var closeSelect = function(){}

/**
 * 首次加载方法，java端调用
 * @param {*} curInitList 
 */
var initList = function(curInitList){
    initConnect(curInitList);
}

$(".refreshBtn").click(function(){
    refreshAll();
});

$(".deleteBtn").click(function(){
    document.querySelector('#menu').style.height=0;
    connectController.deleteAlert(curConnectPk);
});

$(".editBtn").click(function(){
    document.querySelector('#menu').style.height=0;
    connectController.openUpdateModel(curConnectPk);
});

$(".closeBtn").click(function(){
    document.querySelector('#menu').style.height=0;
    var result = connectController.closeConnect(curConnectPk);
    if(result === 'success'){
        disConnect(curConnectPk);
        curTableName = '';
    }
});

$(".connectBtn").click(function(){
    document.querySelector('#menu').style.height=0;
    let result = connectController.connect(curConnectPk);
    if(result === "success"){
        addConnectList(curConnectPk);
    }
});


createMenuHtml();


window.oncontextmenu=function(e){
    //取消默认的浏览器自带右键
    e.preventDefault();
    if(e.srcElement.classList.contains("connectBlock")){

        curConnectPk = e.srcElement.id;
        //获取自定义的右键菜单
        var menu=document.querySelector("#menu");

        //根据事件对象中鼠标点击的位置，进行定位
        menu.style.left=e.clientX+'px';
        menu.style.top=e.clientY+'px';

        if(e.clientY + 125 > document.body.clientHeight){
            menu.style.top = (e.clientY - 130) + 'px';
        }

        menu.style.width='125px';
        menu.style.height='125px';
    }
    
}

window.onclick=function(e){
　  document.querySelector('#menu').style.height=0;//关闭右键菜单
    closeSelect();//关闭筛选浮框
}
window.onmouseup=function(e){
    doUp();//停止表头拖拽
    doTableSchemaUp();//停止表结构表头拖拽
}
window.onkeydown = function()  
{  
    var oEvent = window.event;  
    if (oEvent.keyCode == 65 && oEvent.ctrlKey) {  
        addManyActiveLine();
    }  
}  