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

/**
 * 创建表并设置组合hash分区
 * 
 * 分区后结果：
 * 
 *      HASH (pk) PARTITIONS 6,
 *		HASH (field1) PARTITIONS 2,
 *		RANGE (pk, field1) (
 *		    PARTITION UNBOUNDED
 *		)
 *
 * 结果划分为12个分区：
 *     hash(pk)            hash(field1)
 *      0						  0
 *      0						  1
 *      1						  0
 *      1						  1
 *      2						  0
 *      2						  1
 *      3						  0
 *      3						  1
 *      4						  0
 *      4						  1
 *      5						  0
 *      5						  1 
 * 
 * @author xuchg
 *
 */
public class CreateWithHashAndHash {

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
		
		//hash1
		CreateTableOptions options = new CreateTableOptions();
		List<String> parcols = new LinkedList<>();
		parcols.add("pk");
		options.addHashPartitions(parcols, 6);
		//hash2
		List<String> parcols1 = new LinkedList<>();
		parcols1.add("field1");
		options.addHashPartitions(parcols1, 2);
		
		
		try {
			client.createTable("TestPrimary", schema, options);
			client.close();
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
}
