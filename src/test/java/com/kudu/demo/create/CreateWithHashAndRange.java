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
 * 创建表并同时设置hash分区和范围分区
 * 
 *  分区后结果：
 * 
 *      HASH (pk) PARTITIONS 6,
 *		RANGE (pk) (
 *		    PARTITION 100 <= VALUES < 150,
 *		    PARTITION 150 <= VALUES < 201
 *		)
 *
 *  结果划分为12个分区：
 *     hash            range
 *      0		100 <= VALUES < 150
 *      0		150 <= VALUES < 201
 *      1		100 <= VALUES < 150
 *      1		150 <= VALUES < 201
 *      2		100 <= VALUES < 150
 *      2		150 <= VALUES < 201
 *      3		100 <= VALUES < 150
 *      3		150 <= VALUES < 201
 *      4		100 <= VALUES < 150
 *      4		150 <= VALUES < 201
 *      5		100 <= VALUES < 150
 *      5		150 <= VALUES < 201
 * 
 * @author xuchg
 *
 */
public class CreateWithHashAndRange {
	
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
		
		//hash分区
		CreateTableOptions options = new CreateTableOptions();
		List<String> parcols = new LinkedList<>();
		parcols.add("pk");
		options.addHashPartitions(parcols, 6);
		//range分区
		List<ColumnSchema> lowerColumns = new ArrayList<>();
		lowerColumns.add(newColumn("pk",Type.INT64,true));
		Schema lowerColumn = new Schema(lowerColumns);
		PartialRow lower = lowerColumn.newPartialRow();
		lower.addLong("pk",100L);
		PartialRow upper = lowerColumn.newPartialRow();
		upper.addLong("pk",200L);
		options.addRangePartition(lower, upper, RangePartitionBound.INCLUSIVE_BOUND, RangePartitionBound.INCLUSIVE_BOUND);
		options.setRangePartitionColumns(parcols);
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
