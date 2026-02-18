package com.church.t1.dto.request;

public record AttendanceRequest(
        long eventId,
        String username,
        int points
) {}