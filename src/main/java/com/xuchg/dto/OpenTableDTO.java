package com.xuchg.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 打开表记录
 * @author xuchg1
 *
 */
@Getter
@Setter
public class OpenTableDTO {

	private String connectPk;
	
	private String tableName;
	/**
	 * @see GlobalConstant.OpenTableType
	 */
	private String openType;
	
}
