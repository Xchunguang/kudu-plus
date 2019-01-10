package com.xuchg.service.imp;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xuchg.dao.ConnectDAO;
import com.xuchg.service.ConnectService;
import com.xuchg.vo.ConnectVO;

@Service
public class ConnectServiceImp implements ConnectService{

	@Autowired
	private ConnectDAO connectDAO;
	
	@Override
	@Transactional
	public ConnectVO save(ConnectVO connectVO) {
		return connectDAO.save(connectVO);
	}

	@Override
	public List<ConnectVO> findAll() {
		return connectDAO.findAll();
	}

	@Override
	@Transactional
	public void deleteByPk(String pk) {
		connectDAO.deleteById(pk);
	}

	@Override
	public ConnectVO findByPk(String pk) {
		return connectDAO.findById(pk).orElse(null);
	}

	@Override
	public Boolean findSameName(String name) {
		return connectDAO.findByName(name).size() > 0;
	}

}
