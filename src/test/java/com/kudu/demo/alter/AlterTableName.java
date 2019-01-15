package com.kudu.demo.alter;

import org.apache.kudu.client.AlterTableOptions;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;

/**
 * 更新表结构
 * 
 * 
 * @author xuchg
 *
 */
public class AlterTableName {

	public static void main(String[] args) throws KuduException {
		//master地址
		final String masteraddr = "192.168.20.133";
		
		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();

		AlterTableOptions options = new AlterTableOptions();
		
		//重命名表
		options.renameTable("TestPrimary1");
		
		try {
			client.alterTable("TestPrimary", options);
			client.close();
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
}
