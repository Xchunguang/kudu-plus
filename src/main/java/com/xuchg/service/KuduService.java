package com.xuchg.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.ListTablesResponse;

import com.xuchg.dto.TableSearchDTO;
import com.xuchg.dto.UpdateRowDTO;
import com.xuchg.vo.ConnectVO;

/**
 * kudu服务
 * @author xuchg1
 *
 */
public interface KuduService {

	/**
	 * kudu连接池，用于记录当前所有kudu连接
	 */
	public static Map<String,KuduClient> kuduPool = new HashMap<>();
	
	public static Map<String,ListTablesResponse> tablePool = new HashMap<>();
	
	/**
	 * 连接单个client
	 * @param connectVO
	 * @return
	 */
	public boolean connect(ConnectVO connectVO);
	
	/**
	 * 关闭单个连接
	 * @param connectPk
	 * @return
	 */
	public boolean disConnect(String connectPk);
	
	/**
	 * 关闭所有连接
	 * @return
	 */
	public boolean disConnectAll();
	
	/**
	 * 测试连接
	 * @param kuduAddress
	 * @return
	 */
	public boolean testConnect(String kuduAddress);
	
	/**
	 * 获取表列表
	 * @param connectPk
	 * @return
	 */
	public List<String> getTableList(String connectPk);
	
	/**
	 * 搜索表数据
	 * @param connectPk
	 * @param tableName
	 * @param filterList
	 * @return
	 */
	public TableSearchDTO scanTable(TableSearchDTO dto);
	
	/**
	 * 更新记录
	 * @param connectPk
	 * @param tableName
	 * @param rows
	 */
	public void updateRows(String connectPk,String tableName,List<List<Object>> rows);
	
	/**
	 * 插入记录
	 * @param connectPk
	 * @param tableName
	 * @param rows
	 */
	public void insertRows(String connectPk,String tableName,List<List<Object>> rows);
	
	/**
	 * 删除记录
	 * @param connectPk
	 * @param tableName
	 * @param rows
	 */
	public void deleteRows(String connectPk,String tableName,List<List<Object>> rows);
	
	/**
	 * 删除表
	 * @param connectPk
	 * @param tableName
	 */
	public void deleteTable(String connectPk,String tableName);
	
	/**
	 * 更改表名
	 * @param connectPk
	 * @param tableName
	 * @param oldTableName
	 */
	public void updateTableName(String connectPk,String tableName,String oldTableName);
	
	/**
	 * 更新列或创建表
	 * @param list
	 * @param connectPk
	 * @return 返回值true表示创建表，false表示编辑表
	 */
	public Boolean createOrUpdateSchema(List<UpdateRowDTO> list,String connectPk);
	
	/**
	 * 获得分区信息，该方法并不稳定
	 * @param connectPk
	 * @param tableName
	 * @return
	 * @throws Exception 
	 */
	public List<String> getPartition(String connectPk,String tableName) throws Exception;
}
