package com.kudu.demo.alter;

import org.apache.kudu.ColumnSchema;
import org.apache.kudu.ColumnSchema.ColumnSchemaBuilder;
import org.apache.kudu.Type;
import org.apache.kudu.client.AlterTableOptions;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;

/**
 * 编辑表列
 * @author xuchg
 *
 */
public class AlertTableColumn {

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
		//重命名列
		options.renameColumn("oldName", "newName");
		//添加列
		options.addColumn(newColumn("field2",Type.STRING,true));
		//修改列的默认值
		options.changeDefault("field2", "defaultValue");
		//删除列
		options.dropColumn("field2");
		
		try {
			client.alterTable("TestPrimary", options);
			client.close();
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
}
