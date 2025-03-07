



// ***********   CarInfo 클래스는 Vehicle 클래스를 상속받습니다. **********************
package com.company.entity.car;

import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


//@Entity
@Getter
@Setter
@ToString
//@EqualsAndHashCode(callSuper = true)  // 부모 클래스의 equals, hashCode 호출

public class CarInfo {
    private Long id;

    private User owner;

    private String make;
    private String model;
    private int year;
    private String vin;

    private String carNumber;
    private LocalDateTime createdAt;
    private boolean coOwner;
    private String coOwnerName;
    private String coOwnerPhone;

    public void setCarModel(String carModel) {
    }

}
