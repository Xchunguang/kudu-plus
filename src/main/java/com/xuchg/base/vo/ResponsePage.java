package com.xuchg.base.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * 分页查询结果
 * @author xuchg1
 *
 * @param <T>
 */
@Getter
@Setter
public class ResponsePage<T extends BaseVO> implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6833996270126797510L;

	/**
	 *  结果集合
	 */
	private List<T> list = new ArrayList<>();
	
	/**
	 * 当前页
	 */
	private Integer pageIndex;
	
	/**
	 * 总页数
	 */
	private Integer totalPage;
	
	/**
	 * 总条目数
	 */
	private Integer totalRecord;
	
	/**
	 * 每页条目数
	 */
	private Integer recordPerPage;
}
