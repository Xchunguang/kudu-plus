package com.xuchg.util;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;

import javax.persistence.Id;

import org.apache.commons.lang3.reflect.FieldUtils;

import com.xuchg.exception.CatchRuntimeException;

/**
 * 模型工具类
 * @author xuchg1
 *
 */
public class ModuleUtil {

	/**
	 * 查询VO类主键的值
	 * @param obj
	 * @return
	 * @throws CatchRuntimeException
	 */
	public static Object findModulePkValue(Object obj) throws CatchRuntimeException{
		if(obj == null){
			return null;
		}
		
		Object result = null;
		Field field = getVOPkField(obj.getClass());
		field.setAccessible(true);
		try {
			result = field.get(obj);
		} catch (IllegalArgumentException | IllegalAccessException e) {
			throw new CatchRuntimeException(e);
		}
		return result;
	}
	
	public static Field getVOPkField(Class<?> objClass){
		Field result = null;
		Class<?> clazz = Id.class;
		
		Field[] fields = FieldUtils.getAllFields(objClass);
		for(Field field : fields){
			Annotation[] annos = field.getAnnotations();
			boolean sameAnno = false;
			for(Annotation anno : annos){
				if(anno.annotationType().equals(clazz)){
					sameAnno = true;
					break;
				}
			}
			
			if(sameAnno){
				result = field;
				break;
			}
		}
		return result;
	}
	
	public static void setVOPkValue(Object obj,String pk){
		Field field = getVOPkField(obj.getClass());
		if(field != null){
			field.setAccessible(true);
			try {
				field.set(obj, pk);
			} catch (IllegalArgumentException | IllegalAccessException e) {
				throw new CatchRuntimeException(e);
			}
		}
	}
}
