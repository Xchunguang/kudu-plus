package com.xuchg.base.vo;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Persistable;

import com.xuchg.converter.LocalDateTimeConverter;
import com.xuchg.util.ModuleUtil;

import lombok.Getter;

/**
 * 基础VO类，包含创建时间，更新时间
 * @author xuchg1
 */
@MappedSuperclass
public abstract class BaseVO implements Serializable,Persistable<String> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8935398542755648873L;

	
	@Getter
	@Column(name = "CREATE_TIME")
	@Convert(converter = LocalDateTimeConverter.class)
	protected LocalDateTime createTime;
	
	@Getter
	@Column(name = "UPDATE_TIME")
	@Convert(converter = LocalDateTimeConverter.class)
	protected LocalDateTime updateTime;
	
	
	@PrePersist
	public void insertCreateTime(){
		createTime = LocalDateTime.now();
	}
	
	@PreUpdate
	public void insertUpdateTime(){
		updateTime = LocalDateTime.now();
	}
	
	@Override
	public Object clone() throws CloneNotSupportedException{
		return super.clone();
	}
	
	@Override
	public int hashCode(){
		String pk = getId();
        return pk == null ? super.hashCode() : pk.hashCode();
	}
	
	@Override
	public boolean equals(Object other){
		if(this == other){
			return true;
		}
		if (other == null || getClass() != other.getClass()){
			return false;
		}
		return getId()!=null && getId().equals(((BaseVO)other).getId());
	}
	
	public String getId() {
		return String.valueOf(ModuleUtil.findModulePkValue(this));
	}

	public boolean isNew() {
		return null == getId() || !StringUtils.isNotBlank(getId());
	}
	
}
