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
 * 创建表设置hash分区
 * 
 *  hash分区后分区结果：
 * 
 *      HASH (pk) PARTITIONS 6,
 *		RANGE (pk, field1) (
 *		    PARTITION UNBOUNDED
 *		)
 *  结果划分成6个区  0-5
 *  
 * @author xuchg
 *
 */
public class CreateWithHash {

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
		
		CreateTableOptions options = new CreateTableOptions();
		List<String> parcols = new LinkedList<>();
		parcols.add("pk");
		options.addHashPartitions(parcols, 6);
		
		try {
			client.createTable("TestPrimary", schema, options);
			client.close();
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
}
