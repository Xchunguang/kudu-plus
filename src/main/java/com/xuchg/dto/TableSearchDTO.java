package com.xuchg.dto;

import java.util.ArrayList;
import java.util.List;

import org.apache.kudu.ColumnSchema;

import lombok.Getter;
import lombok.Setter;

/**
 * 表搜索条件传输模型
 * @author xuchg1
 *
 */
@Getter
@Setter
public class TableSearchDTO {
	
	/**
	 * 连接信息
	 */
	private String connectPk;
	
	/**
	 * 表名
	 */
	private String tableName;
	
	/**
	 * 表结构，一般为服务返回
	 */
	private List<ColumnSchema> schemaList = new ArrayList<>();
	
	/**
	 * 过滤条件，一般为前台提供
	 */
	private List<SearchFilterVO> filterList = new ArrayList<>();
	
	/**
	 * 数据结果,一般为服务返回
	 */
	private List<List<Object>> rows = new ArrayList<>();
	
	/**
	 * 是否携带数据，false表示只获取结构
	 */
	private boolean withData = false;
	
}
