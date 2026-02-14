package com.church.t1.repository.projection;

public interface StudentSummary {

    Long getId();

    String getName();

    Integer getRank();

    Integer getTotalPoints();

    String getTeamName();

    String getTeamCode();

    String getTeamColor();
}