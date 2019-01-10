package com.xuchg.service.imp;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.kudu.ColumnSchema;
import org.apache.kudu.ColumnSchema.ColumnSchemaBuilder;
import org.apache.kudu.Schema;
import org.apache.kudu.Type;
import org.apache.kudu.client.AlterTableOptions;
import org.apache.kudu.client.AsyncKuduScanner.ReadMode;
import org.apache.kudu.client.CreateTableOptions;
import org.apache.kudu.client.Delete;
import org.apache.kudu.client.Insert;
import org.apache.kudu.client.KuduClient;
import org.apache.kudu.client.KuduException;
import org.apache.kudu.client.KuduPredicate;
import org.apache.kudu.client.KuduScanner;
import org.apache.kudu.client.KuduScanner.KuduScannerBuilder;
import org.apache.kudu.client.KuduSession;
import org.apache.kudu.client.KuduTable;
import org.apache.kudu.client.ListTablesResponse;
import org.apache.kudu.client.ListTabletServersResponse;
import org.apache.kudu.client.PartialRow;
import org.apache.kudu.client.PartitionSchema;
import org.apache.kudu.client.PartitionSchema.HashBucketSchema;
import org.apache.kudu.client.PartitionSchema.RangeSchema;
import org.apache.kudu.client.RowResult;
import org.apache.kudu.client.RowResultIterator;
import org.apache.kudu.client.Update;
import org.springframework.stereotype.Service;

import com.xuchg.dto.SearchFilterVO;
import com.xuchg.dto.TableSearchDTO;
import com.xuchg.dto.UpdateRowDTO;
import com.xuchg.service.KuduService;
import com.xuchg.util.GlobalConstant;
import com.xuchg.vo.ConnectVO;

@Service
public class KuduServiceImp implements KuduService {

	@Override
	public boolean connect(ConnectVO connectVO) {
		KuduClient client = null;
		try{
			StringBuilder kuduAddress = new StringBuilder();
			if(connectVO.getIpAddress().indexOf(",")>=0){
				String[] ipArr = connectVO.getIpAddress().split(",");
				String[] portArr = connectVO.getPort().split(",");
				for(int i=0;i<ipArr.length;i++){
					kuduAddress.append(ipArr[i]);
					kuduAddress.append(":");
					if(portArr[i] != null){
						kuduAddress.append(portArr[i]);
					}else{
						kuduAddress.append("7051");
					}
					if(i<ipArr.length - 1){
						kuduAddress.append(",");
					}
				}
			}else{
				kuduAddress.append(connectVO.getIpAddress());
				kuduAddress.append(":");
				kuduAddress.append(connectVO.getPort());
			}
			client = new KuduClient.KuduClientBuilder(kuduAddress.toString()).build();
			//@ TODO 抓取kudu异常
			ListTabletServersResponse servers = client.listTabletServers();
			ListTablesResponse tableList = client.getTablesList();
			kuduPool.put(connectVO.getConnectPk(), client);
			tablePool.put(connectVO.getConnectPk(), tableList);
			return true;
		} catch(KuduException e){
			return false;
		} 
	}

	@Override
	public boolean disConnect(String connectPk) {
		KuduClient client = kuduPool.get(connectPk);
		try{
			client.close();
			if(kuduPool.containsKey(connectPk)){
				kuduPool.remove(connectPk);
			}
			if(tablePool.containsKey(connectPk)){
				tablePool.remove(connectPk);
			}
			return true;
		}catch(Exception e){
			return false;
		}
	}

	@Override
	public boolean disConnectAll() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean testConnect(String kuduAddress) {
		KuduClient client = new KuduClient.KuduClientBuilder(kuduAddress).defaultSocketReadTimeoutMs(3000).build();
		try{
			ListTabletServersResponse servers = client.listTabletServers();
			if(servers != null){
				return true;
			}else{
				return false;
			}
		}catch(KuduException e){
			return false;
		}
	}

	@Override
	public List<String> getTableList(String connectPk) {
		if(kuduPool.containsKey(connectPk)){
			ListTablesResponse tableList;
			try {
				tableList = kuduPool.get(connectPk).getTablesList();
				tablePool.remove(connectPk);
				tablePool.put(connectPk, tableList);
				return tableList.getTablesList();
			} catch (KuduException e) {
				return new ArrayList<>();
			}
		}
		return new ArrayList<>();
	}

	@Override
	public TableSearchDTO scanTable(TableSearchDTO dto) {
		List<List<Object>> rows = new ArrayList<>();
		if(kuduPool.containsKey(dto.getConnectPk())){
			KuduClient client = kuduPool.get(dto.getConnectPk());
			try {
				KuduTable table = client.openTable(dto.getTableName());
				Schema schema = table.getSchema();
				dto.setSchemaList(schema.getColumns());
				
				if(dto.isWithData()){
					List<String> columnStr = schema.getColumns().stream().map(ColumnSchema::getName).collect(Collectors.toList());
					
					KuduScannerBuilder scannerBuilder = client.newScannerBuilder(table)
							.setProjectedColumnNames(columnStr)
							.cacheBlocks(false)
							.readMode(ReadMode.READ_LATEST)
							.batchSizeBytes(1024);
					if(dto.getFilterList().size() > 0){
						for(SearchFilterVO filter : dto.getFilterList()){
							if(filter.isUseful()){
								KuduPredicate curKuduPredicate = getKuduPredicate(filter,schema);
								if(curKuduPredicate != null){
									scannerBuilder.addPredicate(curKuduPredicate);
								}
							}
							
						}
					}
					KuduScanner scanner = scannerBuilder.build();
					while(scanner.hasMoreRows()){
						RowResultIterator curRows = scanner.nextRows();
						while(curRows.hasNext()){
							RowResult rowResult = curRows.next();
							List<Object> row = findRow(schema,rowResult);
							rows.add(row);
						}
					}
					dto.setRows(rows);
				}
				
			} catch (KuduException e) {
				e.printStackTrace();
				return null;
			}
		}
		return dto;
	}

	@Override
	public void updateRows(String connectPk, String tableName, List<List<Object>> rows) {
		KuduClient client = kuduPool.get(connectPk);
		KuduTable table;
		try {
			table = client.openTable(tableName);
			KuduSession session = client.newSession();
			Schema schema = table.getSchema();
			for(List<Object> curRow : rows){
				Update update = table.newUpdate();
				PartialRow row = update.getRow();
				convertRow(schema,row,curRow,GlobalConstant.UpdateType.UPDATE);
				session.apply(update);
			}
			session.flush();
			session.close();
			
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void insertRows(String connectPk, String tableName, List<List<Object>> rows) {
		KuduClient client = kuduPool.get(connectPk);
		KuduTable table;
		try {
			table = client.openTable(tableName);
			KuduSession session = client.newSession();
			Schema schema = table.getSchema();
			for(List<Object> curRow : rows){
				Insert insert = table.newInsert();
				PartialRow row = insert.getRow();
				convertRow(schema,row,curRow,GlobalConstant.UpdateType.INSERT);
				session.apply(insert);
			}
			session.flush();
			session.close();
			
		} catch (KuduException e) {
			e.printStackTrace();
		}		
	}

	@Override
	public void deleteRows(String connectPk, String tableName, List<List<Object>> rows) {
		KuduClient client = kuduPool.get(connectPk);
		KuduTable table;
		try {
			table = client.openTable(tableName);
			KuduSession session = client.newSession();
			Schema schema = table.getSchema();
			for(List<Object> curRow : rows){
				Delete delete = table.newDelete();
				PartialRow row = delete.getRow();
				convertRow(schema,row,curRow,GlobalConstant.UpdateType.DELETE);
				session.apply(delete);
			}
			session.flush();
			session.close();
			
		} catch (KuduException e) {
			e.printStackTrace();
		}			
	}
	
	@Override
	public void deleteTable(String connectPk, String tableName) {
		KuduClient client = kuduPool.get(connectPk);
		try {
			client.deleteTable(tableName);
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void updateTableName(String connectPk, String tableName, String oldTableName) {
		KuduClient client = kuduPool.get(connectPk);
		try {
			AlterTableOptions ato = new AlterTableOptions();
			ato.renameTable(tableName);
			client.alterTable(oldTableName, ato);
		} catch (KuduException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public Boolean createOrUpdateSchema(List<UpdateRowDTO> list,String connectPk) {
		KuduClient client = kuduPool.get(connectPk);
		if(list.size() == 0 || StringUtils.isBlank(connectPk)){
			return false;
		}
		String tableName = list.get(0).getTableName();
		boolean tableExit;
		List<String> parcols = new ArrayList<>();
		UpdateRowDTO insertDto = new UpdateRowDTO();
		for(UpdateRowDTO dto : list){
			if(dto.getUpdateType().equals(GlobalConstant.UpdateType.INSERT)){
				insertDto = dto;
				break;
			}
		}
		try {
			tableExit = client.tableExists(tableName);
			if(tableExit){
				//编辑则传入编辑后的所有字段，type为insert
				if(insertDto.getRows().size() > 0){
					KuduTable table = client.openTable(tableName);
					Schema schema = table.getSchema();
					List<ColumnSchema> columns = schema.getColumns();
					//先处理删除的列
					List<String> newRowNames = insertDto.getRows().stream().map(obj -> obj.get(6).toString()).collect(Collectors.toList());
					List<String> deleteNames = columns.stream().filter(column -> newRowNames.indexOf(column.getName())<0).map(ColumnSchema::getName).collect(Collectors.toList());
					AlterTableOptions ops = new AlterTableOptions();
					for(String deleteName : deleteNames){
						ops.dropColumn(deleteName);
					}
					for(List<Object> curRow : insertDto.getRows()){
						//处理修改列名
						if(!curRow.get(6).toString().equals("new") && !curRow.get(0).toString().equals(curRow.get(6).toString())){
							ops.renameColumn(curRow.get(6).toString(), curRow.get(0).toString());
						}
						//处理修改列的默认值
						Object defaultValue = Optional.ofNullable(curRow.get(2)).orElse("");
						for(ColumnSchema curColumn : columns){
							if(curColumn.getName().equals(curRow.get(6).toString()) && !Optional.ofNullable(curColumn.getDefaultValue()).orElse("").toString().equals(defaultValue.toString())){
								
								switch(curColumn.getType()){
									case INT8:
										ops.changeDefault(curRow.get(6).toString(), Byte.valueOf(defaultValue.toString()));
										break;
									case INT16:
										ops.changeDefault(curRow.get(6).toString(), Short.valueOf(defaultValue.toString()));
										break;
									case INT32:
										ops.changeDefault(curRow.get(6).toString(), Integer.valueOf(defaultValue.toString()));
										break;
									case INT64:
										ops.changeDefault(curRow.get(6).toString(), Long.valueOf(defaultValue.toString()));
										break;
									case BINARY:
										break;
									case STRING:
										ops.changeDefault(curRow.get(6).toString(), defaultValue.toString());
										break;
									case BOOL:
										ops.changeDefault(curRow.get(6).toString(), Boolean.valueOf(defaultValue.toString()));
										break;
									case FLOAT:
										ops.changeDefault(curRow.get(6).toString(), Float.valueOf(defaultValue.toString()));
										break;
									case DOUBLE:
										ops.changeDefault(curRow.get(6).toString(), Double.valueOf(defaultValue.toString()));
										break;
									case UNIXTIME_MICROS:
										ops.changeDefault(curRow.get(6).toString(), Long.valueOf(defaultValue.toString()));
										break;
									default:
										ops.changeDefault(curRow.get(6).toString(), defaultValue.toString());
										break;
								}
							}
						}
					}
					//处理新增列
					List<String> oldNames = columns.stream().map(ColumnSchema::getName).collect(Collectors.toList());
					List<List<Object>> newRows = insertDto.getRows().stream().filter(row -> oldNames.indexOf(row.get(6).toString()) < 0).collect(Collectors.toList());
					for(List<Object> newRow : newRows){
						Boolean nullable = StringUtils.isNotBlank(newRow.get(4).toString())?Boolean.valueOf(newRow.get(4).toString()):null;
						ops.addColumn(newColumn(newRow.get(0).toString(), newRow.get(1).toString(), false, newRow.get(2), nullable));
					}
					
					client.alterTable(tableName, ops);
					
				}
				
			}else{
				//新增则传入新增后的所有字段，type为insert
				if(insertDto.getRows().size() > 0){
					List<ColumnSchema> columns = new ArrayList<>();
					for(List<Object> row : insertDto.getRows()){
						Boolean isKey = Boolean.valueOf(row.get(5).toString());
						Boolean nullable = StringUtils.isNotBlank(row.get(4).toString())?Boolean.valueOf(row.get(4).toString()):null;
						String name = row.get(0).toString();
						
						columns.add(newColumn(name,row.get(1).toString(),isKey,row.get(2),nullable));
						
						if(Boolean.valueOf(row.get(5).toString())){
							parcols.add(name);
						}
					}
					
					Schema schema = new Schema(columns);
					CreateTableOptions builder = new CreateTableOptions();
					builder.setRangePartitionColumns(parcols);//使用默认分区
					client.createTable(tableName, schema, builder);
					return true;
				}
			}
			
		} catch (KuduException e) {
			e.printStackTrace();
			try {
				throw e;
			} catch (KuduException e1) {
				e1.printStackTrace();
			}
		}
		return false;
	}
	
	@Override
	public List<String> getPartition(String connectPk, String tableName) throws Exception {
		List<String> result = new ArrayList<>();
		KuduClient client = kuduPool.get(connectPk);
		if(!client.tableExists(tableName)){
			return result;
		}
		KuduTable table = client.openTable(tableName);
		PartitionSchema sch = table.getPartitionSchema();
		RangeSchema range = sch.getRangeSchema();
		List<HashBucketSchema> hashSch= sch.getHashBucketSchemas();
		Schema schema = table.getSchema();
		List<ColumnSchema> columns = schema.getColumns();
		List<String> rangePart = table.getFormattedRangePartitions(5000L);
		for(HashBucketSchema curHashSch : hashSch){
			String hashCode = "";
			for(Integer index : curHashSch.getColumnIds()){
				if(StringUtils.isNotBlank(hashCode)){
					hashCode += ",";
				}
				hashCode += columns.get(index).getName();
			}
			result.add("HASH ("+hashCode+") PARTITIONS " + curHashSch.getNumBuckets());
		}
		String rangeCode = "";
		for(Integer rangeIndex : range.getColumnIds()){
			if(StringUtils.isNotBlank(rangeCode)){
				rangeCode += "，";
			}
			rangeCode += columns.get(rangeIndex).getName();
		}
		result.add("RANGE ("+rangeCode+") (");
		for(int index=0;index<rangePart.size();index++){
			String rangePartStr = rangePart.get(index);
			String curStr = "  " + rangePartStr;
			if(index < rangePart.size() - 1){
				curStr += "，";
			}
			result.add(curStr);
		}
		result.add(")");
		
		return result;
	}

	
	private void convertRow(Schema schema,PartialRow row,List<Object> curRow,String updateType){
		for(int i=0;i<schema.getColumnCount();i++){
			ColumnSchema columnSchema = schema.getColumns().get(i);
			if(updateType.equals(GlobalConstant.UpdateType.DELETE)){
				//删除操作只处理主键列
				if(!columnSchema.isKey()){
					break;
				}
			}
			switch(columnSchema.getType()){
				case INT8:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addByte(columnSchema.getName(), Byte.valueOf(curRow.get(i).toString()));
					}
					break;
				case INT16:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addShort(columnSchema.getName(), Short.valueOf(curRow.get(i).toString()));
					}
					break;
				case INT32:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addInt(columnSchema.getName(), Integer.valueOf(curRow.get(i).toString()));
					}
					break;
				case INT64:
				case UNIXTIME_MICROS:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addLong(columnSchema.getName(),Long.valueOf(curRow.get(i).toString()));
					}
					break;
				case BINARY:
					//二进制字段不支持修改,插入需要
					if(updateType.equals(GlobalConstant.UpdateType.INSERT)){
						if(StringUtils.isNotBlank(curRow.get(i).toString())){
							row.addBinary(columnSchema.getName(), curRow.get(i).toString().getBytes());
						}
					}
					break;
				case STRING:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addString(columnSchema.getName(), curRow.get(i).toString());
					}
					break;
				case BOOL:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addBoolean(columnSchema.getName(), Boolean.valueOf(curRow.get(i).toString()));
					}
					break;
				case FLOAT:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addFloat(columnSchema.getName(), Float.valueOf(curRow.get(i).toString()));
					}
					break;
				case DOUBLE:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addDouble(columnSchema.getName(), Double.valueOf(curRow.get(i).toString()));
					}
					break;
				case DECIMAL:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addDecimal(columnSchema.getName(), BigDecimal.valueOf(Double.valueOf(curRow.get(i).toString())));
					}
					break;
				default:
					if(StringUtils.isNotBlank(curRow.get(i).toString())){
						row.addString(columnSchema.getName(), curRow.get(i).toString());
					}
					break;
			}
		}
	}
	
	private List<Object> findRow(Schema schema,RowResult rowResult){
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
	
	private KuduPredicate getKuduPredicate(SearchFilterVO filter,Schema schema){
		KuduPredicate predicate = null;
		switch(schema.getColumn(filter.getColumnName()).getType()){
			case INT8:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        Byte.valueOf(filter.getValue().toString()));
				break;
			case INT16:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        Short.valueOf(filter.getValue().toString()));
				break;
			case INT32:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        Integer.valueOf(filter.getValue().toString()));
				break;
			case INT64:
			case UNIXTIME_MICROS:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        Long.valueOf(filter.getValue().toString()));
				break;
			case BINARY:
				predicate = null;
				break;
			case STRING:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        (String)filter.getValue());
				break;
			case BOOL:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        (boolean)filter.getValue());
				break;
			case FLOAT:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        (float)filter.getValue());
				break;
			case DOUBLE:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        (double)filter.getValue());
				break;
			case DECIMAL:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        (BigDecimal)filter.getValue());
				break;
			default:
				predicate = KuduPredicate.newComparisonPredicate(
				        schema.getColumn(filter.getColumnName()),
				        filter.getType(),
				        (String)filter.getValue());
				break;
			
		}
		return predicate;
	}
	
	/**
	 * 生成新列
	 * @param name
	 * @param type
	 * @param iskey
	 * @return
	 */
	private static ColumnSchema newColumn(String name,String type,boolean iskey,Object defaultValue,Boolean nullable){
		Type realType = null ;
		switch(type){
			case "INT8":
				realType = Type.INT8;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Byte.valueOf(defaultValue.toString()):null;
				break;
			case "INT16":
				realType = Type.INT16;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Short.valueOf(defaultValue.toString()):null;
				break;
			case "INT32":
				realType = Type.INT32;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Integer.valueOf(defaultValue.toString()):null;
				break;
			case "INT64":
				realType = Type.INT64;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Long.valueOf(defaultValue.toString()):null;
				break;
			case "BINARY":
				realType = Type.BINARY;
				defaultValue = null;
				break;
			case "STRING":
				realType = Type.STRING;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?defaultValue.toString():null;
				break;
			case "BOOL":
				realType = Type.BOOL;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Short.valueOf(defaultValue.toString()):null;
				break;
			case "FLOAT":
				realType = Type.FLOAT;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Float.valueOf(defaultValue.toString()):null;
				break;
			case "DOUBLE":
				realType = Type.DOUBLE;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Double.valueOf(defaultValue.toString()):null;
				break;
			case "UNIXTIME_MICROS":
				realType = Type.UNIXTIME_MICROS;
				defaultValue = StringUtils.isNotBlank(defaultValue.toString())?Long.valueOf(defaultValue.toString()):null;
				break;
		}
		
		ColumnSchemaBuilder column = new ColumnSchema.ColumnSchemaBuilder(name, realType);
		column.key(iskey);
		if(defaultValue != null){
			column.defaultValue(defaultValue);
		}
		if(nullable != null){
			column.nullable(nullable);
		}
		return column.build();
	}

}
