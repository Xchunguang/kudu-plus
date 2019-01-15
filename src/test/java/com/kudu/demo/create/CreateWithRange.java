package com.kudu.demo.create;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.apache.kudu.ColumnSchema;
import org.apache.kudu.ColumnSchema.ColumnSchemaBuilder;
import org.apache.kudu.Schema;
import org.apache.kudu.Type;
import org.apache.kudu.client.CreateTableOptions;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.PartialRow;
import org.apache.kudu.client.RangePartitionBound;

/**
 * 创建表并设置范围分区
 *
 *  	添加split前分割结果：
 * 	    RANGE (pk) (
 *		    PARTITION 100 <= VALUES < 201
 *		)
 * 		结果为一个区
 * 
 * 		添加split后分割结果：
 * 	    RANGE (pk) (
 *		    PARTITION 100 <= VALUES < 150,
 *		    PARTITION 150 <= VALUES < 201
 *		)
 * 		结果为两个区。
 * 
 * 	定义分区后，如果插入的数据的pk不在分区内，则插入失败。如果插入的数据的pk在某个分区上，则会被插入到特定的分区的tablet上
 * 
 * @author xuchg
 *
 */
public class CreateWithRange {

	
	private static ColumnSchema newColumn(String name,Type type,boolean iskey){
		ColumnSchemaBuilder column = new ColumnSchema.ColumnSchemaBuilder(name, type);
		column.key(iskey);
		return column.build();
	}
	public static void main(String[] args) {
		//master地址
		final String masteraddr = "192.168.20.133";
		
		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();
		
		//设置表的schema
		List<ColumnSchema> columns = new ArrayList<>();
		columns.add(newColumn("pk",Type.INT64,true));
		columns.add(newColumn("field1",Type.STRING,true));
		columns.add(newColumn("upload_date",Type.STRING,false));
		columns.add(newColumn("field2",Type.DOUBLE,false));
		
		Schema schema = new Schema(columns);
		
		List<ColumnSchema> lowerColumns = new ArrayList<>();
		lowerColumns.add(newColumn("pk",Type.INT64,true));
		Schema lowerColumn = new Schema(lowerColumns);
		
		//定义下边界，可以定义多个字段
		PartialRow lower = lowerColumn.newPartialRow();
		lower.addLong("pk",100L);
		
		//定义上边界，可以定义多个字段
		PartialRow upper = lowerColumn.newPartialRow();
		upper.addLong("pk",200L);
		
		//建表选项
		CreateTableOptions options = new CreateTableOptions();
		//应用上下边界，其中包括上下边界数值
		options.addRangePartition(lower, upper, RangePartitionBound.INCLUSIVE_BOUND, RangePartitionBound.INCLUSIVE_BOUND);
		
		//定义范围分区使用的字段
		List<String> parcols = new LinkedList<>();
		parcols.add("pk");
		options.setRangePartitionColumns(parcols);
		
		//添加split
		PartialRow splitRow = lowerColumn.newPartialRow();
		splitRow.addLong("pk",150L);
		options.addSplitRow(splitRow);
		
		try {
			client.createTable("TestPrimary", schema, options);
			client.close();
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
}
