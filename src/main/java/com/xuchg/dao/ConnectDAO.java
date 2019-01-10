package com.xuchg.dao;

import java.util.List;

import com.xuchg.base.dao.BaseDAO;
import com.xuchg.vo.ConnectVO;

public interface ConnectDAO extends BaseDAO<ConnectVO>{

	/**
	 * 查找是否重名
	 * @param name
	 * @return
	 */
	List<ConnectVO> findByName(String name);
}
