package com.company.repository;

import com.company.entity.role.Role;
import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles({"common","test"})
public class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;
    private Vehicle vehicle1;
    private Vehicle vehicle2;

    @BeforeEach
    public void setUp() {
        // 테스트용 데이터 초기화
        user = new User();
        user.setName("테스터");
        user.setUserId("Tester");
        user.setEmail("dummy@test.mock");
        user.setRole(Role.ADMIN);

        entityManager.persist(user);

        vehicle1 = new Vehicle();
        vehicle1.setOwner(user);
        vehicle1.setCarMake("Toyota");
        vehicle1.setCarModel("Camry");
        vehicle1.setYear(2020);
        vehicle1.setVin("VIN123456789");
        vehicle1.setCarNumber("123가4567");
        vehicle1.setCreatedAt(LocalDateTime.now());
        vehicle1.setCoOwner(false);
        vehicle1.setCoOwnerName(null);
        vehicle1.setCoOwnerPhone(null);
        entityManager.persist(vehicle1);

        vehicle2 = new Vehicle();
        vehicle2.setOwner(user);
        vehicle2.setCarMake("Honda");
        vehicle2.setCarModel("Civic");
        vehicle2.setYear(2021);
        vehicle2.setVin("VIN987654321");
        vehicle2.setCarNumber("456나7890");
        vehicle2.setCreatedAt(LocalDateTime.now());
        vehicle2.setCoOwner(true);
        vehicle2.setCoOwnerName("홍길동");
        vehicle2.setCoOwnerPhone("010-1234-5678");
        entityManager.persist(vehicle2);

        entityManager.flush();
    }

    @Test
    public void testFindById_Success() {
        // When
        Optional<Vehicle> foundVehicle = vehicleRepository.findById(vehicle1.getId());

        // Then
        assertTrue(foundVehicle.isPresent());
        assertEquals("Toyota", foundVehicle.get().getCarMake());
        assertEquals("Camry", foundVehicle.get().getCarModel());
        assertEquals("VIN123456789", foundVehicle.get().getVin());
    }

    @Test
    void testFindById_NotFound() {
        // When
        Optional<Vehicle> foundVehicle = vehicleRepository.findById(999L);

        // Then
        assertFalse(foundVehicle.isPresent());
    }

    @Test
    void testFindAll() {
        // When
        List<Vehicle> vehicles = vehicleRepository.findAll();

        // Then
        assertNotNull(vehicles);
        assertEquals(2, vehicles.size());
        assertEquals("Toyota", vehicles.get(0).getCarMake());
        assertEquals("Honda", vehicles.get(1).getCarMake());
    }

    @Test
    void testSaveVehicle() {
        // Given
        Vehicle newVehicle = new Vehicle();
        newVehicle.setOwner(user);
        newVehicle.setCarMake("Ford");
        newVehicle.setCarModel("Focus");
        newVehicle.setYear(2022);
        newVehicle.setVin("VIN555555555");
        newVehicle.setCarNumber("789다1011");
        newVehicle.setCreatedAt(LocalDateTime.now());
        newVehicle.setCoOwner(false);

        // When
        Vehicle savedVehicle = vehicleRepository.save(newVehicle);

        // Then
        assertNotNull(savedVehicle.getId());
        assertEquals("Ford", savedVehicle.getCarMake());
        assertEquals("VIN555555555", savedVehicle.getVin());
    }

    @Test
    void testDeleteVehicle() {
        // Given
        Long vehicleId = vehicle1.getId();

        // When
        vehicleRepository.deleteById(vehicleId);
        entityManager.flush();
        entityManager.clear();

        // Then
        Optional<Vehicle> deletedVehicle = vehicleRepository.findById(vehicleId);
        assertFalse(deletedVehicle.isPresent());
    }

    @Test
    void testFindByOwner() {
        // When
        List<Vehicle> vehicles = vehicleRepository.findByOwner(user);

        // Then
        assertNotNull(vehicles);
        assertEquals(2, vehicles.size());
        assertEquals("Toyota", vehicles.get(0).getCarMake());
        assertEquals("Honda", vehicles.get(1).getCarMake());
    }

    @Test
    void testFindByOwner_NoVehicles() {
        // Given
        User anotherUser = new User();
        anotherUser.setName("테스터2");
        anotherUser.setUserId("Tester2");
        anotherUser.setEmail("dummy2@test.mock");
        anotherUser.setRole(Role.ADMIN);

        entityManager.persist(anotherUser);

        entityManager.flush();

        // When
        List<Vehicle> vehicles = vehicleRepository.findByOwner(anotherUser);

        // Then
        assertNotNull(vehicles);
        assertTrue(vehicles.isEmpty());
    }

    @Test
    void testFindByVin_Success() {
        // When
        Optional<Vehicle> foundVehicle = vehicleRepository.findByVin("VIN123456789");

        // Then
        assertTrue(foundVehicle.isPresent());
        assertEquals("Toyota", foundVehicle.get().getCarMake());
        assertEquals("Camry", foundVehicle.get().getCarModel());
    }

    @Test
    void testFindByVin_NotFound() {
        // When
        Optional<Vehicle> foundVehicle = vehicleRepository.findByVin("INVALID_VIN");

        // Then
        assertFalse(foundVehicle.isPresent());
    }
}