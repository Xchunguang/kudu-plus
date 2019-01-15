package com.kudu.demo.curd;

import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.KuduSession;
import org.apache.kudu.client.KuduTable;
import org.apache.kudu.client.Update;

/**
 * 更新一行
 * @author xuchg
 *
 */
public class UpdateRow {

	public static void main(String[] args) throws KuduException {
		//master地址
		final String masteraddr = "192.168.20.133:7051";

		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();
		//打开表
		KuduTable table = client.openTable("TestPrimary");
		KuduSession session = client.newSession();

		Update update = table.newUpdate();

		update.getRow().addLong("pk",1L);
		update.getRow().addString("field1", "key1");
		update.getRow().addString("upload_date", "update this field");
		update.getRow().addDouble("field2",6.46);
		
		session.apply(update);
		
		session.flush();
		session.close();
		client.close();
	}
}
