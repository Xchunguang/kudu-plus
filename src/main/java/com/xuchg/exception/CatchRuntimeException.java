package com.xuchg.exception;

/**
 * 捕捉运行时异常
 * @author xuchg1
 *
 */
public class CatchRuntimeException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 781712632647626636L;

	public CatchRuntimeException(){
		super();
	}
	
	public CatchRuntimeException(String message){
		super(message);
	}
	
	public CatchRuntimeException(String message,Throwable e){
		super(message,e);
	}
	
	public CatchRuntimeException(Throwable e){
		super(e);
	}
	
}
