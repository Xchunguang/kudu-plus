package com.xuchg.window;

import java.io.File;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.sun.javafx.webkit.WebConsoleListener;
import com.xuchg.MainApplication;
import com.xuchg.controller.ConnectController;
import com.xuchg.service.ConnectService;
import com.xuchg.util.FileUtil;
import com.xuchg.util.GlobalConstant;
import com.xuchg.vo.ConnectVO;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.StackPane;
import javafx.scene.text.FontSmoothingType;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import netscape.javascript.JSObject;
/**
 * 主窗口
 * @author xuchg1
 *
 */
@Component
public class MainWindow extends Application {

	//上下文对象
	public static ConfigurableApplicationContext context = null;

	private double waitWidth = 600.00;
	private double waitHeight = 400.00;
			
	
	private double minWidth = 1050.00;
	private double minHeight = 600.00;

	public static Stage stage;

	private static ConnectController connectController = null;
	
	public static WebView webView;
	public static WebEngine webEngine;
	
	private static ConnectService connectService = null;

	@Override
	public void start(Stage arg0) throws Exception {
		
		StackPane passLayout = new StackPane();
		passLayout.setId("pass-layout");
		passLayout.getStylesheets().add(GlobalConstant.MAIN_VIEW_STYLE);
		Scene passScene = new Scene(passLayout,waitWidth,waitHeight);
		arg0.centerOnScreen();
		arg0.setWidth(waitWidth);
		arg0.setHeight(waitHeight);
		arg0.setScene(passScene);
		arg0.initStyle(StageStyle.UNDECORATED);
		arg0.show();
		
		
		Platform.runLater(new Runnable() {
		    @Override
		    public void run() {
				StackPane layout = new StackPane();//布局
				layout.setId("main-view");
				layout.getStylesheets().add(GlobalConstant.MAIN_VIEW_STYLE);

				//启动扫描服务
				context = SpringApplication.run(MainApplication.class);
				if(null != context){
					connectController = context.getBean(ConnectController.class);
					connectService = context.getBean(ConnectService.class);
				}
				stage =  new Stage();
				layout.getChildren().add(getBodyView());
				Scene scene = new Scene(layout,minWidth,minHeight);
				stage.setScene(scene);
				stage.setMinHeight(minHeight);
				stage.setMinWidth(minWidth);
				stage.getIcons().add(new Image(GlobalConstant.ICON));
				stage.centerOnScreen();
				stage.setTitle(GlobalConstant.TITLE);
				stage.show();
				arg0.close();
		    }
		});
		
	}
	
    /**
     * 内容窗体
     */
    public WebView getBodyView() {
    	
        webView = new WebView();
        webView.setCache(false);
        webEngine = webView.getEngine();
        webView.setContextMenuEnabled(true);
        webEngine.setJavaScriptEnabled(true);
        webView.setFontSmoothingType(FontSmoothingType.GRAY);
        webEngine.load(MainWindow.class.getResource(GlobalConstant.INDEX_PAGE).toExternalForm());

        //设置数据目录
        String basePath = System.getProperty("user.home");
        String dataPath = basePath + "/.kudu-plus/temp";
        FileUtil.existsFile(dataPath);
        webEngine.setUserDataDirectory(new File(dataPath));

        //监听事件
        Worker<Void> woker = webEngine.getLoadWorker();
        woker.stateProperty().addListener((obs, oldValue, newValue) -> {
            if (newValue == Worker.State.SUCCEEDED) {
                JSObject jsObject = (JSObject) webEngine.executeScript("window");
                jsObject.setMember("connectController", connectController);
                //初始化
                List<ConnectVO> list = connectService.findAll();
                jsObject.call("initList", JSON.toJSONString(list));
            }
        });

        //页面异常事件
        woker.exceptionProperty().addListener((ObservableValue<? extends Throwable> ov, Throwable t0, Throwable t1) -> {
            System.out.println("Received Exception: " + t1.getMessage());
        });

        //控制台监听事件
        WebConsoleListener.setDefaultListener((WebView curWebView, String message, int lineNumber, String sourceId) -> {
            if (message.contains("ReferenceError: Can't find variable")) {
//                webEngine.reload();
            }
            System.out.println("Console: [" + sourceId + ":" + lineNumber + "] " + message);
        });
        
        return webView;
    }

}
