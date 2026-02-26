package com.church.t1.utils;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class TimeUtils {

    private static final ZoneId EGYPT_ZONE = ZoneId.of("Africa/Cairo");

    private TimeUtils() {
    }

    public static ZonedDateTime nowInEgypt() {
        return ZonedDateTime.now(EGYPT_ZONE);
    }

    public static Instant currentLocalTimeAsInstant() {
        return nowInEgypt()
                .toLocalDateTime()
                .toInstant(ZoneOffset.UTC);
    }
}
