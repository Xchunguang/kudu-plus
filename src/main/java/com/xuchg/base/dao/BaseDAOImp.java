package com.xuchg.base.dao;

import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;

import com.xuchg.base.vo.BaseVO;
import com.xuchg.base.vo.RequestPage;
import com.xuchg.base.vo.ResponsePage;
import com.xuchg.exception.CatchRuntimeException;
import com.xuchg.util.ModuleUtil;

public class BaseDAOImp<T extends BaseVO> extends SimpleJpaRepository<T, String> implements BaseDAO<T> {

	private final EntityManager entityManager;

    private final Class<T> voClass;
	
	public BaseDAOImp(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
		super(entityInformation, entityManager);
		voClass = entityInformation.getJavaType();
        this.entityManager = entityManager;
	}

	@Override
	public List<T> findList(String whereClause, int pageIndex, int recordPerPage, Object... paramVarArgs) {
		
        try {
            String jql = "select p from " + this.getGenericClass().getSimpleName() + " p ";
            if (StringUtils.isNotBlank(whereClause)) {
                if (whereClause.toLowerCase().trim().startsWith("order ")) {
                    jql = jql + " " + whereClause;
                } else {
                    jql = jql + " where " + whereClause;
                }

            }
            TypedQuery<T> typedQuery = entityManager.createQuery(jql, this.getGenericClass());
            if (paramVarArgs != null) {
                for (int i = 0; i < paramVarArgs.length; i++) {
                    typedQuery.setParameter(i + 1, paramVarArgs[i]);
                }
            }
            if (recordPerPage > 0) {
                if (pageIndex <= 0)
                    pageIndex = 1;
                typedQuery.setFirstResult((pageIndex - 1) * recordPerPage);
                typedQuery.setMaxResults(recordPerPage);
            }
            List<T> results = typedQuery.getResultList();
            return results;
        } catch (Exception ex) {
            throw new CatchRuntimeException("find List error", ex);
        }
    
	}

	@Override
	public ResponsePage<T> findList(RequestPage requestPage) {
		ResponsePage<T> result = new ResponsePage<>();
        List<T> list = this.findList(requestPage.getWhereJql(),requestPage.getPageIndex(),requestPage.getRecordPerPage(),requestPage.getParams());
        result.setList(list);
        result.setTotalRecord((int)this.count(requestPage.getWhereJql(),requestPage.getParams()));
        result.setPageIndex(requestPage.getPageIndex());
        result.setRecordPerPage(requestPage.getRecordPerPage());
        return result;
	}

	@Override
	public int executeJQL(String jql, Object... paramVarArgs) {
		if (jql == null) {
            return 0;
        }
        try {
            Query query = entityManager.createQuery(jql);
            if(paramVarArgs != null){
                for (int i = 0; i < paramVarArgs.length; i++) {
                    query.setParameter(i + 1, paramVarArgs[i]);
                }
            }
            return query.executeUpdate();
        } catch (Exception ex) {
            throw new CatchRuntimeException("execute JQL " + jql + " error", ex);
        }
	}

	@Override
	public long count(String whereClaus, Object... paramVarArgs) {
		String jql = "select count(*) from " + this.getGenericClass().getSimpleName() + " p ";
        if(StringUtils.isNotBlank(whereClaus)){
            if(whereClaus.toLowerCase().contains(" order ")){
                whereClaus = whereClaus.substring(0,whereClaus.toLowerCase().indexOf(" order "));
            }
            if(!StringUtils.isEmpty(whereClaus)){
            	jql = jql + " where " + whereClaus;
            }
        }
        try{
            TypedQuery<Long> typedQuery = entityManager.createQuery(jql, Long.class);
            if (paramVarArgs != null) {
                for (int i = 0; i < paramVarArgs.length; i++) {
                    typedQuery.setParameter(i + 1, paramVarArgs[i]);
                }
            }

            Long result = typedQuery.getSingleResult();
            return result;
        }catch (Exception ex){
            throw new CatchRuntimeException("count ["+whereClaus+"] error", ex);
        }
	}

	private Class<T> getGenericClass() {
        return voClass;
    }

    @Override
    public <S extends T> S save(S vo) {
        if(vo.isNew()){
            resetPk(vo);
        }
        return super.save(vo);
    }
	
	@Override
	public void resetPk(T vo) {
		ModuleUtil.setVOPkValue(vo, UUID.randomUUID().toString());
	}

}
