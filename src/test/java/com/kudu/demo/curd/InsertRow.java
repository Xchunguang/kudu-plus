package com.kudu.demo.curd;

import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.KuduSession;
import org.apache.kudu.client.KuduTable;
import org.apache.kudu.client.Upsert;

/**
 * 插入一行数据
 * @author xuchg
 *
 */
public class InsertRow {

	public static void main(String[] args) throws KuduException {
		//master地址
		final String masteraddr = "192.168.20.133:7051";

		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();
		//打开表
		KuduTable table = client.openTable("TestPrimary");
		KuduSession session = client.newSession();

		//Upsert表示如果存在相同主键列就进行更新，如果不存在则进行插入，也可以直接使用Insert
		Upsert upsert = table.newUpsert();

		upsert.getRow().addLong("pk",1L);
		upsert.getRow().addString("field1", "key1");
		upsert.getRow().addString("upload_date", "456");
		upsert.getRow().addDouble("field2",3.23);
		
		session.apply(upsert);
		
		session.flush();
		session.close();
		client.close();
	}
}
