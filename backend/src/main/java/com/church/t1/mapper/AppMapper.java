package com.church.t1.mapper;

import com.church.t1.dto.response.*;
import com.church.t1.model.entity.*;
import com.church.t1.model.enums.CompetitionStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface AppMapper {

    @Mapping(target = "points", source = "weight")
    EventSummary toEventSummary(Event event);

    @Mapping(target = "isCompleted", source = "completed")
    EventProgress toEventProgress(Event event, boolean completed);

    @Mapping(target = "status", source = "isActive", qualifiedByName = "mapCompetitionStatus")
    CompetitionSummary toCompetitionSummary(Competition competition);

    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "teamName", source = "team.teamName")
    @Mapping(target = "teamCode", source = "team.teamCode")
    @Mapping(target = "teamColor", source = "team.teamColor")
    @Mapping(target = "totalPoints", source = "points")
    @Mapping(target = "rank", source = "rank")
    StudentProfile toStudentStatistics(User user, TeamProfile team, Integer points, Integer rank);

    @Named("mapCompetitionStatus")
    default CompetitionStatus mapCompetitionStatus(Boolean isActive) {
        return Boolean.TRUE.equals(isActive) ? CompetitionStatus.ACTIVE : CompetitionStatus.ARCHIVED;
    }
}