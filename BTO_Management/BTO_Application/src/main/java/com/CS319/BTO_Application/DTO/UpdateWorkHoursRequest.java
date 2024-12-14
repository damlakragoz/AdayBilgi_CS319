package com.CS319.BTO_Application.DTO;

public class UpdateWorkHoursRequest {
    private String userName;  // Email of the tour guide
    private float hoursWorked;  // Hours worked to update

    // Getters and setters
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public float getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(float hoursWorked) {
        this.hoursWorked = hoursWorked;
    }
}
