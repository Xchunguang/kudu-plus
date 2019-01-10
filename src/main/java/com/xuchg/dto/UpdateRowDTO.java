package com.xuchg.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UpdateRowDTO {
	
	private List<List<Object>> rows = new ArrayList<>();

	private String connectPk;
	
	private String tableName;
	
	/**
	 * 更新类型
	 * update
	 * delete
	 * insert
	 */
	private String updateType;
}
