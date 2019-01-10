package com.xuchg.service;

import java.util.List;

import javax.transaction.Transactional;

import com.xuchg.vo.ConnectVO;

/**
 * 连接服务
 * @author xuchg1
 *
 */
public interface ConnectService {

	/**
	 * 保存一个连接
	 * @param connectVO
	 * @return
	 */
	public ConnectVO save(ConnectVO connectVO);
	
	/**
	 * 查找所有的连接
	 * @return
	 */
	public List<ConnectVO> findAll();
	
	/**
	 * 删除一个连接
	 * @param pk
	 */
	public void deleteByPk(String pk);
	
	/**
	 * 查找单个连接信息
	 * @param pk
	 * @return
	 */
	public ConnectVO findByPk(String pk);
	
	/**
	 * 查找是否重名
	 * @param name
	 * @return
	 */
	public Boolean findSameName(String name);
	
}
