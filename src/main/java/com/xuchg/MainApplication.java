package com.xuchg;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.xuchg.base.dao.BaseDAOImp;
import com.xuchg.window.MainWindow;

/**
 * 启动类
 * @author xuchg1
 *
 */
@SpringBootApplication
@EnableJpaRepositories(repositoryBaseClass=BaseDAOImp.class)
public class MainApplication extends MainWindow{
	
	public static void main(String[] args) {
        launch(args);
    }
}
