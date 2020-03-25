package com.xuchg.vo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.xuchg.base.vo.BaseVO;

import lombok.Getter;
import lombok.Setter;

/**
 * 连接信息模型
 * @author xuchg1
 *
 */
@Getter
@Setter
@Entity
@Table(name = "CONNECT_INFO")
public class ConnectVO extends BaseVO{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8377897864492729710L;

	@Id
	@Column(name = "PK_CONNECT", unique = true, nullable = false)
	private String connectPk;
	
	@Column(name = "NAME", length=255)
	private String name;
	
	@Column(name = "IP_ADDRESS",length=255)
	private String ipAddress;
	
	@Column(name = "PORT",length=255)
	private String port = "7051";
	
}
