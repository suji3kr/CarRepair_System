package com.company.service;

import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle vehicle;
    private User owner;

    @BeforeEach
    void setUp() {
        // 테스트용 데이터 초기화
        owner = new User();
        owner.setId(1L);

        vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setOwner(owner);
        vehicle.setCarMake("Toyota");
        vehicle.setCarModel("Camry");
        vehicle.setYear(2020);
        vehicle.setVin("VIN123456789");
        vehicle.setCarNumber("123가4567");
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setCoOwner(false);
        vehicle.setCoOwnerName(null);
        vehicle.setCoOwnerPhone(null);
    }

    @Test
    void testGetVehicleById_Success() {
        // Given
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        // When
        Vehicle result = vehicleService.getVehicleById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Toyota", result.getCarMake());
        assertEquals("Camry", result.getCarModel());
    }

    @Test
    void testGetVehicleById_NotFound() {
        // Given
        when(vehicleRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.getVehicleById(1L);
        });
        assertEquals("차량 정보를 찾을 수 없습니다. ID: 1", exception.getMessage());
    }

    @Test
    void testGetVehicleByVIN_Success() {
        // Given
        when(vehicleRepository.findByVin("VIN123456789")).thenReturn(Optional.of(vehicle));

        // When
        Vehicle result = vehicleService.getVehicleByVIN("VIN123456789");

        // Then
        assertNotNull(result);
        assertEquals("VIN123456789", result.getVin());
    }

    @Test
    void testGetVehicleByVIN_NotFound() {
        // Given
        when(vehicleRepository.findByVin("VIN123456789")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.getVehicleByVIN("VIN123456789");
        });
        assertEquals("차량 정보를 찾을 수 없습니다. V ID Number: VIN123456789", exception.getMessage());
    }

    @Test
    void testGetVehicleByOwner() {
        // Given
        List<Vehicle> vehicles = Arrays.asList(vehicle);
        when(vehicleRepository.findByOwner(owner)).thenReturn(vehicles);

        // When
        List<Vehicle> result = vehicleService.getVehicleByOwner(owner);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(vehicle, result.get(0));
    }

    @Test
    void testSaveVehicle_Success() {
        // Given
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // When
        Vehicle result = vehicleService.saveVehicle(vehicle);

        // Then
        assertNotNull(result);
        assertEquals(vehicle, result);
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    void testSaveVehicle_WithCoOwner_Success() {
        // Given
        vehicle.setCoOwner(true);
        vehicle.setCoOwnerName("홍길동");
        vehicle.setCoOwnerPhone("010-1234-5678");
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // When
        Vehicle result = vehicleService.saveVehicle(vehicle);

        // Then
        assertNotNull(result);
        assertTrue(result.isCoOwner());
        assertEquals("홍길동", result.getCoOwnerName());
        assertEquals("010-1234-5678", result.getCoOwnerPhone());
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    void testSaveVehicle_WithCoOwner_MissingInfo() {
        // Given
        vehicle.setCoOwner(true);
        vehicle.setCoOwnerName(null);
        vehicle.setCoOwnerPhone("010-1234-5678");

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.saveVehicle(vehicle);
        });
        assertEquals("공동 소유자 정보가 누락되었습니다. 이름과 연락처가 필요합니다.", exception.getMessage());
    }

    @Test
    void testDeleteVehicle_Success() {
        // Given
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        doNothing().when(vehicleRepository).delete(vehicle);

        // When
        vehicleService.deleteVehicle(1L);

        // Then
        verify(vehicleRepository, times(1)).delete(vehicle);
    }

    @Test
    void testDeleteVehicle_NotFound() {
        // Given
        when(vehicleRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.deleteVehicle(1L);
        });
        assertEquals("차량 정보를 찾을 수 없습니다. ID: 1", exception.getMessage());
    }

    @Test
    void testUpdateVehicle_Success() {
        // Given
        Vehicle updatedVehicle = new Vehicle();
        updatedVehicle.setCarMake("Honda");
        updatedVehicle.setCarModel("Camry");
        updatedVehicle.setYear(2021);
        updatedVehicle.setVin("VIN987654321");
        updatedVehicle.setCarNumber("456나7890");
        updatedVehicle.setCoOwner(false);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // When
        Vehicle result = vehicleService.updateVehicle(1L, updatedVehicle);

        // Then
        assertNotNull(result);
        assertEquals("Honda", result.getCarMake()); // 기존 차량 정보가 유지됨
        assertEquals("Camry", result.getCarModel());
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    void testUpdateVehicle_NotFound() {
        // Given
        Vehicle updatedVehicle = new Vehicle();
        when(vehicleRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.updateVehicle(1L, updatedVehicle);
        });
        assertEquals("차량 정보를 찾을 수 없습니다. ID: 1", exception.getMessage());
    }

    @Test
    void testGetAllVehicles() {
        // Given
        List<Vehicle> vehicles = Arrays.asList(vehicle);
        when(vehicleRepository.findAll()).thenReturn(vehicles);

        // When
        List<Vehicle> result = vehicleService.getAllVehicles();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(vehicle, result.get(0));
    }

    @Test
    void testCreateVehicle_Success() {
        // Given
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // When
        Vehicle result = vehicleService.createVehicle(vehicle);

        // Then
        assertNotNull(result);
        assertEquals(vehicle, result);
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    void testCreateVehicle_WithCoOwner_Success() {
        // Given
        vehicle.setCoOwner(true);
        vehicle.setCoOwnerName("홍길동");
        vehicle.setCoOwnerPhone("010-1234-5678");
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // When
        Vehicle result = vehicleService.createVehicle(vehicle);

        // Then
        assertNotNull(result);
        assertTrue(result.isCoOwner());
        assertEquals("홍길동", result.getCoOwnerName());
        assertEquals("010-1234-5678", result.getCoOwnerPhone());
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    void testCreateVehicle_WithCoOwner_MissingInfo() {
        // Given
        vehicle.setCoOwner(true);
        vehicle.setCoOwnerName(null);
        vehicle.setCoOwnerPhone("010-1234-5678");

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.createVehicle(vehicle);
        });
        assertEquals("공동 소유자 정보가 누락되었습니다. 이름과 연락처가 필요합니다.", exception.getMessage());
    }

    @Test
    void testGetVehicleWithCoOwnerInfo_Success() {
        // Given
        vehicle.setCoOwner(true);
        vehicle.setCoOwnerName("홍길동");
        vehicle.setCoOwnerPhone("010-1234-5678");
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        // When
        Vehicle result = vehicleService.getVehicleWithCoOwnerInfo(1L);

        // Then
        assertNotNull(result);
        assertTrue(result.isCoOwner());
        assertEquals("홍길동", result.getCoOwnerName());
        assertEquals("010-1234-5678", result.getCoOwnerPhone());
    }

    @Test
    void testGetVehicleWithCoOwnerInfo_NoCoOwner() {
        // Given
        vehicle.setCoOwner(false);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.getVehicleWithCoOwnerInfo(1L);
        });
        assertEquals("이 차량은 공동 소유자가 없습니다.", exception.getMessage());
    }

    @Test
    void testGetVehicleWithCoOwnerInfo_NotFound() {
        // Given
        when(vehicleRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.getVehicleWithCoOwnerInfo(1L);
        });
        assertEquals("차량 정보를 찾을 수 없습니다. ID: 1", exception.getMessage());
    }
}