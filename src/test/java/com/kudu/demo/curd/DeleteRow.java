package com.kudu.demo.curd;

import org.apache.kudu.client.Delete;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.KuduSession;
import org.apache.kudu.client.KuduTable;
import org.apache.kudu.client.PartialRow;

/**
 * 删除一行
 * 表结构参照com.kudu.demo.create包中的建表示例
 * 
 * @author xuchg
 *
 */
public class DeleteRow {
	
	public static void main(String[] args) throws KuduException {
		//master地址
		final String masteraddr = "192.168.20.133:7051";

		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();
		
		KuduSession session = client.newSession();
		
		KuduTable table = client.openTable("TestPrimary");
		
		Delete delete = table.newDelete();
		
		PartialRow row = delete.getRow();
		
		//此处需要设置所有主键列的值，其他列可不设置
		row.addLong("pk",111L);
		row.addString("field1","111");
		
		session.apply(delete);
		session.flush();
		session.close();
		client.close();
	}

}
