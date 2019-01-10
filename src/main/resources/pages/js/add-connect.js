var connectVO = {
    connectPk:'',
    name:'',
    ipAddress:'',
    port:''
};
var saveConnect = function(){
    connectVO.name=$("#inputName").val();
    connectVO.ipAddress=$("#inputIp").val();
    connectVO.port=$("#inputPort").val();
    connectController.saveConnect(JSON.stringify(connectVO));
}
var closeModel = function(){
    connectController.closeCreateModel();
}
var initConnect = function(json){
    var initVO = JSON.parse(json);
    connectVO = initVO;
    $("#inputName").val(connectVO.name);
    $("#inputIp").val(connectVO.ipAddress);
    $("#inputPort").val(connectVO.port);
}

var testConnect = function(){
	connectVO.ipAddress=$("#inputIp").val();
	connectVO.port=$("#inputPort").val();
	if(!connectVO.ipAddress){
		connectVO.ipAddress = "localhost";
	}
    if(!connectVO.port){
    	connectVO.port = "7051";
    }
    
    var kuduAddress = "";
    if(connectVO.ipAddress.indexOf(",")>=0){
		var ipArr = connectVO.ipAddress.split(",");
		var portArr = connectVO.port.split(",");
		for(var i=0;i<ipArr.length;i++){
			kuduAddress += ipArr[i];
			kuduAddress += ":";
			if(portArr[i]){
				kuduAddress += portArr[i];
			}else{
				kuduAddress += "7051";
			}
			if(i<ipArr.length - 1){
				kuduAddress += ",";
			}
		}
	}else{
		kuduAddress += connectVO.ipAddress;
		kuduAddress += ":";
		kuduAddress += connectVO.port;
	}
    
    connectController.testConnect(kuduAddress);
}

$('#element').tooltip();