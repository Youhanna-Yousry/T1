package com.church.t1.repository.projection;

import com.church.t1.model.entity.User;

public interface WeeklyRawScore {

    User getUser();

    Long getTotalScore();
}