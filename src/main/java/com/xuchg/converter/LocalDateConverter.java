package com.xuchg.converter;

import java.sql.Date;
import java.time.LocalDate;

import javax.persistence.AttributeConverter;

/**
 * LocalDate转换成date
 * @author xuchg1
 *
 */
public class LocalDateConverter implements AttributeConverter<LocalDate,Date>{

	@Override
	public Date convertToDatabaseColumn(LocalDate arg0) {
		return (arg0 == null ? null : Date.valueOf(arg0));
	}

	@Override
	public LocalDate convertToEntityAttribute(Date arg0) {
		return (arg0 == null ? null : arg0.toLocalDate());
	}

}
