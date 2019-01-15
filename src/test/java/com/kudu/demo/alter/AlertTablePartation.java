package com.kudu.demo.alter;

import java.util.ArrayList;
import java.util.List;

import org.apache.kudu.ColumnSchema;
import org.apache.kudu.ColumnSchema.ColumnSchemaBuilder;
import org.apache.kudu.Schema;
import org.apache.kudu.Type;
import org.apache.kudu.client.AlterTableOptions;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.PartialRow;
import org.apache.kudu.client.RangePartitionBound;

/**
 * 编辑表分区，只能动态编辑表的范围分区
 * @author xuchg
 *
 */
public class AlertTablePartation {

	private static ColumnSchema newColumn(String name,Type type,boolean iskey){
		ColumnSchemaBuilder column = new ColumnSchema.ColumnSchemaBuilder(name, type);
		column.key(iskey);
		return column.build();
	}
	
	public static void main(String[] args) throws KuduException {
		//master地址
		final String masteraddr = "192.168.20.133";
		
		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();

		AlterTableOptions options = new AlterTableOptions();
		//添加范围分区
		List<ColumnSchema> lowerColumns = new ArrayList<>();
		lowerColumns.add(newColumn("pk",Type.INT64,true));
		Schema lowerColumn = new Schema(lowerColumns);
		PartialRow lower = lowerColumn.newPartialRow();
		lower.addLong("pk",100L);
		PartialRow upper = lowerColumn.newPartialRow();
		upper.addLong("pk",200L);
		options.addRangePartition(lower, upper, RangePartitionBound.INCLUSIVE_BOUND, RangePartitionBound.INCLUSIVE_BOUND);
		//删除范围分区
		options.dropRangePartition(lower, upper);
		
		try {
			client.alterTable("TestPrimary", options);
			client.close();
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
}
