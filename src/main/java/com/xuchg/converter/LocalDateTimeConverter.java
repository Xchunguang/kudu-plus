package com.xuchg.converter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.AttributeConverter;

/**
 * LocalDateTime转换成datetime
 * @author xuchg1
 *
 */
public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime,Timestamp> {

	@Override
	public Timestamp convertToDatabaseColumn(LocalDateTime arg0) {
		return (arg0 == null ? null : Timestamp.valueOf(arg0));
	}

	@Override
	public LocalDateTime convertToEntityAttribute(Timestamp arg0) {
		return (arg0 == null ? null : arg0.toLocalDateTime());
	}

}
