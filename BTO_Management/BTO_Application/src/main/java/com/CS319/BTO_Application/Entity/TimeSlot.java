package com.CS319.BTO_Application.Entity;

import lombok.Getter;
import lombok.Setter;

@Getter
public enum TimeSlot {
    SLOT_9_10("09:00-10:00"),
    SLOT_10_11("10:00-11:00"),
    SLOT_11_12("11:00-12:00"),
    SLOT_13_14("13:00-14:00"),
    SLOT_14_15("14:00-15:00");

    private final String displayName;

    TimeSlot(String displayName) {
        this.displayName = displayName;
    }

}
