var connectVO = {
    connectPk:'',
    name:'',
    ipAddress:'',
    port:''
};
var update = false;
var oldTableName = "";
var initConnect = function(json){
    var initVO = JSON.parse(json);
    connectVO = initVO;
    $("#inputName").val(connectVO.name);
    oldTableName = connectVO.name;
    update = true;
}

var closeModel = function(){
    connectController.closeCreateModel();
}

var confirm = function(){
    if(update){
        //更新表名
        let result = connectController.updateTableName(connectVO.connectPk,$("#inputName").val(),oldTableName);
    }else{
        connectController.createNewTable($("#inputName").val());
    }
    update = false;
}