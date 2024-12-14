package com.CS319.BTO_Application.Entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
public class BTOManager extends BTOMember{

}



