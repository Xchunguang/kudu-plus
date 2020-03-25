package com.xuchg.controller;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.xuchg.dto.OpenTableDTO;
import com.xuchg.dto.TableSearchDTO;
import com.xuchg.dto.UpdateRowDTO;
import com.xuchg.service.ConnectService;
import com.xuchg.service.KuduService;
import com.xuchg.util.GlobalConstant;
import com.xuchg.vo.ConnectVO;
import com.xuchg.window.MainWindow;

import javafx.beans.property.ReadOnlyObjectProperty;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.ButtonType;
import javafx.scene.image.Image;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.FontSmoothingType;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Modality;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

@Component
@SuppressWarnings("all")
public class ConnectController {

	private Stage arg1 = null;
	
	//当前操作的显示所有表的连接主键
	private String curConnectPk;
	
	/**
	 * 页签配置
	 */
	private List<OpenTableDTO> openTable = new ArrayList<>(); 
	
	@Autowired
	private ConnectService connectService;
	@Autowired
	private KuduService kuduService;
	
	public void insertConnect(){
		System.out.println("click this ");
	}
	
	/**
	 * 打开添加新连接界面
	 */
	public void toAddConnect(){
		double width = 500;
		double height = 400;
		arg1 = new Stage();
		StackPane layout = new StackPane();//布局
		layout.getChildren().add(getBodyView("toCreateConnect",null));
		
		Scene scene = new Scene(layout,width,height);
		arg1.setScene(scene);
		arg1.setMinHeight(width);
		arg1.setMinWidth(height);
		arg1.getIcons().add(new Image(GlobalConstant.ICON));
		arg1.centerOnScreen();
		arg1.setTitle("新建连接");
		arg1.initModality(Modality.APPLICATION_MODAL);
		arg1.setMinHeight(height);
		arg1.setMinWidth(width);
		arg1.showAndWait();
	}
	
	/**
	 * 打开编辑框
	 * @param pk
	 */
	public void openUpdateModel(String pk){
		double width = 500;
		double height = 400;
		ConnectVO connectVO = connectService.findByPk(pk);
		arg1 = new Stage();
		StackPane layout = new StackPane();//布局
		layout.getChildren().add(getBodyView("toCreateConnect",connectVO));
		
		Scene scene = new Scene(layout,width,height);
		arg1.setScene(scene);
		arg1.setMinHeight(width);
		arg1.setMinWidth(height);
		arg1.getIcons().add(new Image(GlobalConstant.ICON));
		arg1.centerOnScreen();
		arg1.setTitle(connectVO.getName());
		arg1.initModality(Modality.APPLICATION_MODAL);
		arg1.setMinHeight(height);
		arg1.setMinWidth(width);
		arg1.showAndWait();
	}
	
	/**
	 * 保存后刷新
	 */
	public void saveConnect(String json){
		ConnectVO connectVO = JSON.parseObject(json, ConnectVO.class);
		if(StringUtils.isNotBlank(connectVO.getConnectPk())){
			ConnectVO oldVO = connectService.findByPk(connectVO.getConnectPk());
			if(!oldVO.getName().equals(connectVO.getName())){
				if(connectService.findSameName(connectVO.getName())){
					showInfoAlert(Alert.AlertType.INFORMATION,"存在相同名称",true);
					return ;
				}
			}
		}else{
			if(connectService.findSameName(connectVO.getName())){
				showInfoAlert(Alert.AlertType.INFORMATION,"存在相同名称",true);
				return ;
			}
		}
		
		if(StringUtils.isBlank(connectVO.getPort())){
			connectVO.setPort("7051");
		}
		
		connectVO = connectService.save(connectVO);
		
		closeCreateModel();
		
		//执行js脚本刷新方法
		MainWindow.webEngine.executeScript("refreshAll()");
	}
	
	/**
	 * 获取所有的连接信息
	 * @return
	 */
	public String findAll(){
		if(StringUtils.isNotBlank(curConnectPk)){
			MainWindow.webEngine.executeScript("initTable("+JSON.toJSONString(kuduService.getTableList(curConnectPk))+")");
		}
		return JSON.toJSONString(connectService.findAll());
	}
	
	/**
	 * 连接
	 * @param connectPk
	 */
	public String connect(String connectPk){
		if(kuduService.kuduPool.containsKey(connectPk)){
			return "success";
		}
		Alert alert = showInfoAlert(Alert.AlertType.INFORMATION, "连接中...",false);
		ConnectVO vo = connectService.findByPk(connectPk);
		boolean success = kuduService.connect(vo);
		if(success){
			alert.close();
			MainWindow.webEngine.executeScript("changeConnectNum("+kuduService.kuduPool.keySet().size()+")");
			MainWindow.webEngine.executeScript("initTable("+JSON.toJSONString(kuduService.tablePool.get(connectPk).getTablesList())+")");
			curConnectPk = connectPk;
			return "success";
		}else{
			alert.close();
			showInfoAlert(Alert.AlertType.ERROR,"连接失败",true);
			return "fail";
		}
	}
	
	/**
	 * 关闭连接
	 * @param connectPk
	 */
	public String closeConnect(String connectPk){
		boolean result = kuduService.disConnect(connectPk);
		if(result){
			MainWindow.webEngine.executeScript("changeConnectNum("+kuduService.kuduPool.keySet().size()+")");
			MainWindow.webEngine.executeScript("initTable("+JSON.toJSONString(new ArrayList<String>())+")");
			if(connectPk.equals(curConnectPk)){
				curConnectPk = "";
			}

			return "success";
		}else{
			return "fail";
		}
		
	}
	
	/**
	 * 关闭新增连接信息窗口
	 */
	public void closeCreateModel(){
		if(arg1 != null){
			arg1.close();
		}
	}
	
	/**
	 * 删除确认框
	 * @param pk
	 */
	public void deleteAlert(String pk){
		if(StringUtils.isNotBlank(pk)){
			ConnectVO vo = connectService.findByPk(pk);
			Alert confirmation = new Alert(Alert.AlertType.CONFIRMATION,"确认删除："+vo.getName()+"  ？");
			confirmation.setHeaderText("");
			confirmation.showAndWait().ifPresent(response ->{
				if(response == ButtonType.OK){
					connectService.deleteByPk(pk);
					confirmation.close();
					MainWindow.webEngine.executeScript("refreshAll()");
				}
			});
		}
	}
	
	/**
	 * 关闭主窗口
	 */
	public void closeMainWindow(){
		MainWindow.stage.close();
	}
	
	/**
	 * 测试连接
	 * @param kuduAddress
	 */
	public void testConnect(String kuduAddress){
		Alert waitAlert = showInfoAlert(Alert.AlertType.INFORMATION,"连接中...",false);
		boolean result = kuduService.testConnect(kuduAddress);
		waitAlert.close();
		if(result){
			showInfoAlert(Alert.AlertType.INFORMATION, "连接成功", true);
		}else{
			showInfoAlert(Alert.AlertType.ERROR,"连接超时",true);
		}
	}
	
	/**
	 * 打开table
	 * @param tableName
	 * @param openType 打开表，编辑表，新建表
	 */
	public void openTable(String tableName,String openType){
		if(openTable.stream().filter(table->table.getTableName().equals(tableName)&&table.getOpenType().equals(openType)).collect(Collectors.toList()).size()==0){
			OpenTableDTO dto = new OpenTableDTO();
			dto.setConnectPk(curConnectPk);
			dto.setOpenType(openType);
			dto.setTableName(tableName);
			openTable.add(dto);
			JSObject jsObject = (JSObject) MainWindow.webEngine.executeScript("window");
        	jsObject.call("initOpenTableList", JSON.toJSONString(openTable));
		}
		
		//定位
		for(int i=0;i<openTable.size();i++){
			if(openTable.get(i).getTableName().equals(tableName)&&openTable.get(i).getOpenType().equals(openType)){
				MainWindow.webEngine.executeScript("changeActiveIndex("+i+")");
				break;
			}
		}
		
	}
	
	/**
	 * 更改表名
	 * @param connectPk
	 * @param tableName
	 * @param oldTableName
	 */
	public String updateTableName(String connectPk,String tableName,String oldTableName){
		kuduService.updateTableName(connectPk, tableName, oldTableName);
		this.closeCreateModel();
		MainWindow.webEngine.executeScript("refreshAll()");
		return "success";
	}
	
	/**
	 * 创建新表
	 * @param tableName
	 */
	public void createNewTable(String tableName){
		if(!kuduService.tablePool.get(curConnectPk).getTablesList().contains(tableName)){
			this.openTable(tableName, GlobalConstant.OpenTableType.CREATE_TABLE);
			this.closeCreateModel();
		}else{
			showInfoAlert(Alert.AlertType.INFORMATION,"表名已存在",true);
		}
	}
	
	/**
	 * 打开创建表窗口
	 */
	public void createTable(boolean withData,String tableName){
		if(StringUtils.isBlank(curConnectPk)){
			return ;
		}
		double width = 500;
		double height = 250;
		arg1 = new Stage();
		StackPane layout = new StackPane();//布局
		if(!withData){
			layout.getChildren().add(getBodyView("toCreateTable",null));
		}else{
			ConnectVO vo = new ConnectVO();
			vo.setConnectPk(curConnectPk);
			vo.setName(tableName);//约定借用字段表示表名
			layout.getChildren().add(getBodyView("toCreateTable",vo));
		}
		
		Scene scene = new Scene(layout,width,height);
		arg1.setScene(scene);
		arg1.setMinHeight(width);
		arg1.setMinWidth(height);
		arg1.getIcons().add(new Image(GlobalConstant.ICON));
		arg1.centerOnScreen();
		arg1.setTitle("编辑表名");
		arg1.initModality(Modality.APPLICATION_MODAL);
		arg1.setMinHeight(height);
		arg1.setMinWidth(width);
		arg1.showAndWait();
	}
	
	/**
	 * 关闭表
	 * @param tableName
	 * @param openType
	 */
	public void closeTable(String tableName,String openType){
		for(int i=0;i<openTable.size();i++){
			if(openTable.get(i).getTableName().equals(tableName)&&openTable.get(i).getOpenType().equals(openType)){
				openTable.remove(i);
				JSObject jsObject = (JSObject) MainWindow.webEngine.executeScript("window");
	        	jsObject.call("initOpenTableList", JSON.toJSONString(openTable));
				break;
			}
		}
	}
	
	/**
	 * 检索表
	 * @param connectPk
	 * @param tableName
	 * @return
	 */
	public String scanTable(String dtoJson){
		Alert waitAlert = showInfoAlert(Alert.AlertType.INFORMATION,"读取中...",false);
		TableSearchDTO dto = JSON.parseObject(dtoJson,TableSearchDTO.class);
		try{
			TableSearchDTO resultDto = kuduService.scanTable(dto);
			waitAlert.close();
			if(resultDto != null){
				return JSON.toJSONString(resultDto);
			}else{
				showInfoAlert(Alert.AlertType.ERROR,"读取超时",false);
				return JSON.toJSONString(dto);
			}
		}catch(Exception e){
			waitAlert.close();
			showInfoAlert(Alert.AlertType.ERROR,"参数错误",false);
			return JSON.toJSONString(dto);
		}
		
	}

	
	/**
	 * 前端提示
	 * @param info
	 */
	public void showInfo(String info){
		showInfoAlert(Alert.AlertType.INFORMATION,info,false);
	}
	
	
	/**
	 * 更新记录，包括更改，插入和删除
	 * @param json
	 */
	public String updateRows(String json){
		List<UpdateRowDTO> updateRows = JSON.parseArray(json, UpdateRowDTO.class);
		for(UpdateRowDTO dto : updateRows){
			if(dto.getUpdateType().equals(GlobalConstant.UpdateType.UPDATE)){
				kuduService.updateRows(dto.getConnectPk(), dto.getTableName(), dto.getRows());
			}else if(dto.getUpdateType().equals(GlobalConstant.UpdateType.INSERT)){
				kuduService.insertRows(dto.getConnectPk(), dto.getTableName(), dto.getRows());
			}else if(dto.getUpdateType().equals(GlobalConstant.UpdateType.DELETE)){
				kuduService.deleteRows(dto.getConnectPk(), dto.getTableName(), dto.getRows());
			}
		}
		return "success";
	}
	
	/**
	 * 更新表结构，包括新建表和更新表
	 * @param json
	 * @return
	 */
	public String updateSchema(String json){
		List<UpdateRowDTO> updateRows = JSON.parseArray(json, UpdateRowDTO.class);
		//创建表根据表名是否存在确定是创建还是更改，后续处理分区规则
		Boolean ifCreate = false;
		try{
			ifCreate = kuduService.createOrUpdateSchema(updateRows, curConnectPk);
		}catch(Exception e){
			showInfoAlert(Alert.AlertType.ERROR,"参数错误",true);
			return "fail";
		}
		if(ifCreate){
			//如果表创建成功，则刷新列表，同时关闭创建表的窗口，打开编辑表结构的窗口
			MainWindow.webEngine.executeScript("refreshAll()");
			String tableName = updateRows.get(0).getTableName();
			this.closeTable(tableName, GlobalConstant.OpenTableType.CREATE_TABLE);
			this.openTable(tableName, GlobalConstant.OpenTableType.OPEN_SCHEMA);
		}
		showInfoAlert(Alert.AlertType.INFORMATION,"保存成功",true);
		return "success";
	}
	
	/**
	 * 删除表
	 * @param tableName
	 * @return
	 */
	public String deleteTable(String tableName){
		if(StringUtils.isNotBlank(curConnectPk)){
			Alert confirmation = new Alert(Alert.AlertType.CONFIRMATION,"确认删除表："+tableName+"  ？");
			confirmation.setHeaderText("");
			confirmation.showAndWait().ifPresent(response ->{
				if(response == ButtonType.OK){
					kuduService.deleteTable(curConnectPk, tableName);
					confirmation.close();
					kuduService.tablePool.get(curConnectPk).getTablesList().remove(tableName);
					MainWindow.webEngine.executeScript("initTable("+JSON.toJSONString(kuduService.tablePool.get(curConnectPk).getTablesList())+")");
				}
			});
		}
		return "success";
	}
	
	/**
	 * 获得当前表的分区信息
	 * @param tableName
	 * @return
	 */
	public String getPartition(String tableName){
		List<String> result = new ArrayList<>();
		try {
			result = kuduService.getPartition(curConnectPk, tableName);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return JSON.toJSONString(result);
	}
	
	
	/**
	 * 获得webView
	 * @param title
	 * @return
	 */
	private VBox getBodyView(String title,ConnectVO vo) {
        WebView webView = new WebView();
        webView.setCache(true);
        webView.setContextMenuEnabled(false);
        webView.setFontSmoothingType(FontSmoothingType.GRAY);
        WebEngine webEngine = webView.getEngine();
        webEngine.setJavaScriptEnabled(true);
        String htmlSrc = "";
        switch (title) {
            case "toCreateConnect":
                htmlSrc = GlobalConstant.ADD_CONNECT_HTML;
                break;
            case "toCreateTable":
            	htmlSrc = GlobalConstant.CREATE_TABLE_HTML;
            	break;
        }
        String url = MainWindow.class.getResource(htmlSrc).toExternalForm();
        webEngine.load(url);
        ReadOnlyObjectProperty<Worker.State> woker = webEngine.getLoadWorker().stateProperty();
        woker.addListener((obs, oldValue, newValue) -> {
            if (newValue == Worker.State.SUCCEEDED) {
                JSObject jsObject = (JSObject) webEngine.executeScript("window");
                ConnectController connectController = MainWindow.context.getBean(ConnectController.class);
                jsObject.setMember("connectController", connectController);
                if(vo != null){
                	jsObject.call("initConnect", JSON.toJSONString(vo));
                }
            }
        });
        return new VBox(webView);
    }
	
	/**
	 * 提示窗口
	 * @param title
	 */
	private Alert showInfoAlert(AlertType alertType,String title,boolean wait){
		Alert alert = null;
		if(StringUtils.isNotBlank(title)){
			alert = new Alert(alertType,title);
			alert.setHeaderText("");
			alert.setTitle("提示");
			if(wait){
				alert.showAndWait();
			}else{
				alert.show();
			}
		}
		return alert;
	}
	
	/**
     * 打开github
     * @throws URISyntaxException
     * @throws IOException
     */
    public void openGithub() throws URISyntaxException, IOException{
    	String url = "https://github.com/Xchunguang/kudu-plus";
    	System.setProperty("java.awt.headless", "false");
    	URI address = new URI(url);
    	Desktop d = Desktop.getDesktop();
    	d.browse(address);
    }
    
    /**
     * please wait
     */
    public void pleaseWait(){
    	showInfoAlert(Alert.AlertType.INFORMATION,"待开发...",true);
    }

}
