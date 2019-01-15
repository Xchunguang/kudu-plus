package com.kudu.demo.curd;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.kudu.ColumnSchema;
import org.apache.kudu.Schema;
import org.apache.kudu.client.AsyncKuduScanner.ReadMode;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.KuduPredicate;
import org.apache.kudu.client.KuduPredicate.ComparisonOp;
import org.apache.kudu.client.KuduScanner;
import org.apache.kudu.client.KuduScanner.KuduScannerBuilder;
import org.apache.kudu.client.KuduTable;
import org.apache.kudu.client.RowResult;
import org.apache.kudu.client.RowResultIterator;

/**
 * 查找记录
 * @author xuchg
 *
 */
public class FindRow {

	public static void main(String[] args) throws KuduException {
		//master地址
		final String masteraddr = "192.168.20.133:7051";

		//创建kudu的数据库链接
		KuduClient client = new KuduClient.KuduClientBuilder(masteraddr).build();
		//打开表
		KuduTable table = client.openTable("TestPrimary");
		
		Schema schema = table.getSchema();
		
		//查找所有的列
		List<String> columnStr = schema.getColumns().stream().map(ColumnSchema::getName).collect(Collectors.toList());
		
		KuduScannerBuilder scannerBuilder = client.newScannerBuilder(table)
				.setProjectedColumnNames(columnStr)
				.cacheBlocks(false)
				.readMode(ReadMode.READ_LATEST)
				.batchSizeBytes(1024);
		
		//筛选条件，第一个参数表示筛选的字段，第二个参数表示条件（等于/大于/小于...），第三个参数表示筛选值
		KuduPredicate predicate = KuduPredicate.newComparisonPredicate(schema.getColumn("pk"),ComparisonOp.EQUAL,112L);
		//应用筛选规则，可以应用多个
		scannerBuilder.addPredicate(predicate);
		
		KuduScanner scanner = scannerBuilder.build();
		while(scanner.hasMoreRows()){
			RowResultIterator curRows = scanner.nextRows();
			while(curRows.hasNext()){
				RowResult rowResult = curRows.next();
				List<Object> row = findRow(schema,rowResult);
				System.out.println(row);
			}
		}
		
	}
	
	private static List<Object> findRow(Schema schema,RowResult rowResult){
		List<Object> row = new ArrayList<>();
		for(ColumnSchema columnSchema : schema.getColumns()){
			if(rowResult.isNull(columnSchema.getName())){
				row.add(null);
			}else{
				switch(columnSchema.getType()){
					case INT8:
						row.add(rowResult.getByte(columnSchema.getName()));
						break;
					case INT16:
						row.add(rowResult.getShort(columnSchema.getName()));
						break;
					case INT32:
						row.add(rowResult.getInt(columnSchema.getName()));
						break;
					case INT64:
					case UNIXTIME_MICROS:
						//由于long值返回前端进行json转换会丢失精度，所以转换为字符串返回
						row.add(String.valueOf(rowResult.getLong(columnSchema.getName())));
						break;
					case BINARY:
						//二进制字段不显示
//						row.add(rowResult.getBinary(columnSchema.getName()));
						row.add("[BINARY]");
						break;
					case STRING:
						row.add(rowResult.getString(columnSchema.getName()));
						break;
					case BOOL:
						row.add(rowResult.getBoolean(columnSchema.getName()));
						break;
					case FLOAT:
						row.add(rowResult.getFloat(columnSchema.getName()));
						break;
					case DOUBLE:
						row.add(rowResult.getDouble(columnSchema.getName()));
						break;
					case DECIMAL:
						row.add(rowResult.getDecimal(columnSchema.getName()));
						break;
					default:
						row.add(rowResult.getString(columnSchema.getName()));
						break;
				}
			}
		}
		return row;
	}
}
