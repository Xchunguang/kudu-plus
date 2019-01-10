package com.xuchg.util;

/**
 * 全局常量
 * @author xuchg1
 *
 */
public class GlobalConstant {

	public static String ICON = "/pages/images/app01.png";
	
	public static String TITLE = "KuduPlus";
	
	public static String MAIN_VIEW_STYLE = "/pages/css/main-view.css";
	
	public static String INDEX_PAGE = "/pages/index.html";
	
	public static String CONNECT_FAIL = "/pages/images/connect-fail.png";
	
	public static String CONNECT_SUCCESS = "/pages/images/connect-success.png";
	
	public static String ADD_CONNECT_HTML = "/pages/add-connect.html";
	
	public static String CREATE_TABLE_HTML = "/pages/create-table.html";
	
	
	
	public interface OpenTableType{
		
		public static String OPEN_TABLE="OPEN_TABLE";
		
		public static String OPEN_SCHEMA = "OPEN_SCHEMA";
		
		public static String CREATE_TABLE = "CREATE_TABLE";
	}
	
	public interface UpdateType{
		
		public static String UPDATE = "update";
		
		public static String INSERT = "insert";
		
		public static String DELETE = "delete";
	}
}
