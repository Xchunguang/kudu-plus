package com.xuchg.base.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.NoRepositoryBean;

import com.xuchg.base.vo.BaseVO;
import com.xuchg.base.vo.RequestPage;
import com.xuchg.base.vo.ResponsePage;

/**
 * 基础DAO
 * @author xuchg1
 *
 */
@NoRepositoryBean
public interface BaseDAO<T extends BaseVO> extends JpaRepository<T, String>{

	/**
	 * 条件查找
	 * @param whereClause
	 * @param pageIndex
	 * @param recordPerPage
	 * @param paramVarArgs
	 * @return
	 */
	public List<T> findList(String whereClause, int pageIndex, int recordPerPage,Object... paramVarArgs);
	
	/**
	 * 分页查找
	 * @param requestPage
	 * @return
	 */
	public ResponsePage<T> findList(RequestPage requestPage);
	
    /**
     * 执行jsql
     * @param jql
     * @param paramVarArgs
     */
	public int executeJQL(String jql, Object... paramVarArgs);

    /**
     * 条件计数
     * @param whereClaus
     * @param paramVarArgs
     * @return
     */
	public long count(String whereClaus,Object... paramVarArgs);
    
    /**
     * 设置VO主键
     * @param vo
     */
	public void resetPk(T vo);
    
}
