package com.xuchg.spring;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.alibaba.druid.pool.DruidDataSource;

@Configuration
public class DruidConfig {

    private String baseUrl = System.getProperty("user.home");

    @Bean
    public DataSource druidDataSource() {
        DruidDataSource datasource = new DruidDataSource();
        datasource.setTestWhileIdle(false);
        datasource.setTestOnBorrow(false);
        datasource.setTestOnReturn(false);
        //发布路径
        datasource.setUrl("jdbc:derby:" + baseUrl + "/.kudu-plus/data;create=true");
        datasource.setDriverClassName("org.apache.derby.jdbc.EmbeddedDriver");
        return datasource;
    }

}
