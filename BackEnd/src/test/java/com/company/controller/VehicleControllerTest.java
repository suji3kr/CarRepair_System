package com.company.controller;

import com.company.entity.vehicle.Vehicle;
import com.company.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class VehicleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VehicleService vehicleService;

    @InjectMocks
    private VehicleController vehicleController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        // MockMvc를 수동으로 초기화
        mockMvc = MockMvcBuilders.standaloneSetup(vehicleController).build();

        // 테스트용 데이터 초기화
        vehicle = new Vehicle();
        vehicle.setId(1L);
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
    void testGetAllVehicles() throws Exception {
        // Given
        List<Vehicle> vehicles = Arrays.asList(vehicle);
        when(vehicleService.getAllVehicles()).thenReturn(vehicles);

        // When & Then
        mockMvc.perform(get("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].carMake").value("Toyota"))
                .andExpect(jsonPath("$[0].carModel").value("Camry"))
                .andExpect(jsonPath("$[0].year").value(2020))
                .andExpect(jsonPath("$[0].vin").value("VIN123456789"))
                .andExpect(jsonPath("$[0].carNumber").value("123가4567"))
                .andExpect(jsonPath("$[0].coOwner").value(false))
                .andExpect(jsonPath("$[0].coOwnerName").doesNotExist())
                .andExpect(jsonPath("$[0].coOwnerPhone").doesNotExist());
    }

    @Test
    void testGetVehicleById_Success() throws Exception {
        // Given
        when(vehicleService.getVehicleById(1L)).thenReturn(vehicle);

        // When & Then
        mockMvc.perform(get("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.carMake").value("Toyota"))
                .andExpect(jsonPath("$.carModel").value("Camry"))
                .andExpect(jsonPath("$.year").value(2020))
                .andExpect(jsonPath("$.vin").value("VIN123456789"))
                .andExpect(jsonPath("$.carNumber").value("123가4567"));
    }

    @Test
    void testCreateVehicle() throws Exception {
        // Given
        Vehicle newVehicle = new Vehicle();
        newVehicle.setCarMake("Honda");
        newVehicle.setCarModel("Civic");
        newVehicle.setYear(2021);
        newVehicle.setVin("VIN987654321");
        newVehicle.setCarNumber("456나7890");
        newVehicle.setCoOwner(true);
        newVehicle.setCoOwnerName("홍길동");
        newVehicle.setCoOwnerPhone("010-1234-5678");

        when(vehicleService.createVehicle(any(Vehicle.class))).thenReturn(vehicle);

        // When & Then
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newVehicle)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.carMake").value("Toyota"))
                .andExpect(jsonPath("$.carModel").value("Camry"));
    }

    @Test
    void testUpdateVehicle_Success() throws Exception {
        // Given
        Vehicle updatedVehicle = new Vehicle();
        updatedVehicle.setCarMake("Honda");
        updatedVehicle.setCarModel("Civic");
        updatedVehicle.setYear(2021);
        updatedVehicle.setVin("VIN987654321");
        updatedVehicle.setCarNumber("456나7890");

        when(vehicleService.updateVehicle(eq(1L), any(Vehicle.class))).thenReturn(vehicle);

        // When & Then
        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedVehicle)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.carMake").value("Toyota"))
                .andExpect(jsonPath("$.carModel").value("Camry"));
    }



    @Test
    void testDeleteVehicle() throws Exception {
        // Given
        doNothing().when(vehicleService).deleteVehicle(1L);

        // When & Then
        mockMvc.perform(delete("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify
        verify(vehicleService, times(1)).deleteVehicle(1L);
    }


}