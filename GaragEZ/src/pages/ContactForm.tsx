import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/ContactForm.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import dayjs, { Dayjs } from "dayjs";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

const predefinedMarkers = [
  { id: "101", lat: 37.5665, lng: 126.978, name: "서울" },
  { id: "102", lat: 35.1796, lng: 129.0756, name: "부산" },
  { id: "103", lat: 33.4996, lng: 126.5312, name: "제주" },
  { id: "104", lat: 37.2928, lng: 126.9910, name: "스타필드점" },
  { id: "105", lat: 37.2374, lng: 127.2052, name: "용인중앙지점" },
];

interface Car {
  carId: number;
  carModel: string;
  imageUrl: string;
  carMake: string;
}

interface FormData {
  userId: string;
  name: string;
  carMake: string;
  carModel: string; // carId 제거, carModel만 사용
  inquiryType: string;
  content: string;
  repairStoreId: string;
  repairStoreName: string;
  appointmentDate: Dayjs | null;
}

const fetchCarsByMake = async (carMake: string): Promise<Car[]> => {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cars?car_make=${carMake}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Fetched cars:", data); // 디버깅용
  return Array.isArray(data) ? data : data.cars || [];
};

const ContactForm: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    userId: "",
    name: "",
    carMake: "",
    carModel: "",
    inquiryType: "",
    content: "",
    repairStoreId: "",
    repairStoreName: "",
    appointmentDate: null,
  });

  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<{ id: string; lat: number; lng: number; name: string } | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 37.5665, lng: 126.978 });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserEmail = localStorage.getItem("userEmail");

    if (storedUserId || storedUserEmail) {
      setFormData((prev) => ({
        ...prev,
        userId: storedUserId || storedUserEmail || "Unknown User",
      }));
    } else {
      setError("로그인 정보가 없습니다. 로그인 후 시도해주세요.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const { state } = location;
    if (state && state.carMake && state.carModel) {
      setFormData((prev) => ({
        ...prev,
        carMake: state.carMake,
        carModel: state.carModel,
      }));
    }
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userPos);
        },
        (error) => {
          console.error("위치 가져오기 오류:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (formData.carMake) {
      const loadCars = async () => {
        try {
          const data = await fetchCarsByMake(formData.carMake);
          setCars(data);
        } catch (err) {
          setError(`차량 데이터를 불러오는 데 실패했습니다: ${err}`);
          console.error(err);
        }
      };
      loadCars();
    } else {
      setCars([]);
    }
  }, [formData.carMake]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "carMake" ? { carModel: "" } : {}), // carMake 변경 시 carModel 초기화
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prevData) => ({ ...prevData, appointmentDate: date }));
  };

  const handleMarkerClick = (marker: { id: string; lat: number; lng: number; name: string }) => {
    setSelectedMarker(marker);
    setFormData((prevData) => ({
      ...prevData,
      repairStoreId: marker.id,
      repairStoreName: marker.name,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", {
      ...formData,
      appointmentDate: formData.appointmentDate?.format("YYYY-MM-DD"),
    });
    alert("문의 및 예약이 성공적으로 제출되었습니다!");
    navigate("/reservations");
  };

  return (
    <Layout>
      <div className={styles.contactContainer}>
        <div className={styles.contactBanner}></div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>견적 요청</h2>

          <div className={styles.contactInputGroup}>
            <label>회원 아이디</label>
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} readOnly required />
          </div>

          {/* 제조사와 차량 선택 */}
          <div className={styles.carSelectionGroup}>
            <div>
              <FormControl fullWidth>
                <InputLabel id="carMake-label">제조사 선택</InputLabel>
                <Select
                  labelId="carMake-label"
                  name="carMake"
                  value={formData.carMake}
                  label="제조사 선택"
                  onChange={handleSelectChange}
                  required
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="">제조사를 선택하세요</MenuItem>
                  {["현대", "기아", "쉐보레", "쌍용"].map((manufacturer, index) => (
                    <MenuItem key={index} value={manufacturer}>
                      {manufacturer}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth>
                <InputLabel id="carModel-label">차량 선택</InputLabel>
                <Select
                  labelId="carModel-label"
                  name="carModel"
                  value={formData.carModel}
                  label="차량 선택"
                  onChange={handleSelectChange}
                  required
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="">차량을 선택하세요</MenuItem>
                  {cars.map((car) => (
                    <MenuItem key={car.carId} value={car.carModel}>
                      {car.carModel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.contactInputGroup}>
            <FormControl fullWidth>
              <InputLabel id="inquiryType-label">문의 유형</InputLabel>
              <Select
                labelId="inquiryType-label"
                name="inquiryType"
                value={formData.inquiryType}
                label="문의 유형"
                onChange={handleSelectChange}
                required
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">유형을 선택하세요</MenuItem>
                <MenuItem value="엔진오일">엔진오일</MenuItem>
                <MenuItem value="타이어">타이어</MenuItem>
                <MenuItem value="정기점검">정기점검</MenuItem>
                <MenuItem value="기타">기타</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className={styles.contactInputGroup}>
            <label>문의 내용</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required />
          </div>

          <div className={styles.contactInputGroup}>
            <label>예약 날짜</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker value={formData.appointmentDate} onChange={handleDateChange} format="YYYY-MM-DD" minDate={dayjs()}/>
            </LocalizationProvider>
          </div>

          <div className={styles.contactInputGroup}>
            <label>선택한 정비소 (아래 지도에서 선택 시 자동 입력)</label>
            <input type="text" name="repairStoreName" value={formData.repairStoreName} readOnly />
          </div>

          {isLoaded && (
            <div className={styles.mapContainer}>
              <h3>가까운 정비소 선택 (마커를 선택하세요)</h3>
              <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={center} zoom={12}>
                {predefinedMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    label={marker.name}
                    onClick={() => handleMarkerClick(marker)}
                  />
                ))}
                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div>
                      <h4>{selectedMarker.name}</h4>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          )}

          <button type="submit" className={styles.contactSubmitButton}>제출하기</button>
        </form>
      </div>
    </Layout>
  );
};

export default ContactForm;