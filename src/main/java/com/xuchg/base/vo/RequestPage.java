package com.xuchg.base.vo;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * 分页请求模型
 * @author xuchg1
 *
 */
@Getter
@Setter
public class RequestPage implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7331482361305615576L;
	
	/**
	 * 当前页
	 */
	private Integer pageIndex;
	
	/**
	 * 每页条目数
	 */
	private Integer recordPerPage;
	
	/**
	 * 条件搜索
	 */
	private String whereJql;
	
	/**
	 * 条件搜索参数
	 */
	private Object[] params;

}
