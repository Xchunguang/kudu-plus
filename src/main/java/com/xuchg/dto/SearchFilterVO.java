package com.xuchg.dto;

import org.apache.kudu.client.KuduPredicate.ComparisonOp;

import lombok.Getter;
import lombok.Setter;

/**
 * 表查询搜索条件
 * @author xuchg1
 *
 */
@Getter
@Setter
public class SearchFilterVO {

	private String columnName;
	
	private ComparisonOp type;
	
	private Object value;
	
	private boolean useful;
}
