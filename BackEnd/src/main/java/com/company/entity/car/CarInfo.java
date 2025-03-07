



// ***********   CarInfo 클래스는 Vehicle 클래스를 상속받습니다. **********************
package com.company.entity.car;

import com.company.entity.vehicle.Vehicle;
import jakarta.persistence.Entity;
import lombok.*;


@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)  // 부모 클래스의 equals, hashCode 호출

public class CarInfo extends Vehicle {
    private boolean coOwner;
    private String coOwnerName;
    private String coOwnerPhone;

    public void setCarModel(String carModel) {
    }
    public void setCarNumber(String carNumber) {
    }
}
