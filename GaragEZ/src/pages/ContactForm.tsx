import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import styles from "../styles/ContactForm.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Dayjs } from "dayjs";


const predefinedMarkers = [
  { id: "101", lat: 37.5665, lng: 126.978, name: "서울" },
  { id: "102", lat: 35.1796, lng: 129.0756, name: "부산" },
  { id: "103", lat: 33.4996, lng: 126.5312, name: "제주" },
  { id: "104", lat: 37.2928, lng: 126.9910, name: "스타필드점" },
  { id: "105", lat: 37.2374, lng: 127.2052, name: "용인중앙지점" },
];

const ContactForm: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [formData, setFormData] = useState({
    userId: "",
    carId: "",
    inquiryType: "",
    content: "",
    repairStoreId: "",
    repairStoreName: "", // 추가
    appointmentDate: null as Dayjs | null,
  });

  const [selectedMarker, setSelectedMarker] = useState<{ id: string; lat: number; lng: number; name: string } | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 37.5665, lng: 126.978 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userPos);
          setUserLocation(userPos);
        },
        (error) => {
          console.error("위치 가져오기 오류:", error);
          setUserLocation(null);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prevData) => ({ ...prevData, appointmentDate: date }));
  };

  const handleMarkerClick = (marker: { id: string; lat: number; lng: number; name: string }) => {
    setSelectedMarker(marker);
    setFormData((prevData) => ({
      ...prevData,
      repairStoreId: marker.id,
      repairStoreName: marker.name, // 정비소 이름 업데이트
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", { ...formData, appointmentDate: formData.appointmentDate?.format("YYYY-MM-DD") });
    alert("문의가 성공적으로 제출되었습니다!");
  };

  return (
    <Layout>
      <div className={styles.contactContainer}>
        {/* 기존 배너 유지 */}
        <div className={styles.contactBanner}></div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>정비 예약 문의</h2>

          <div className={styles.contactInputGroup}>
            <label>로그인한 회원이름이 여기 뜹니다</label>
            <label>이름</label>
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.contactInputGroup}>
            <label>차량 선택</label>
            <select name="carId" value={formData.carId} onChange={handleChange} required>
              <option value="">차량을 선택하세요</option>
              <option value="1">회원의 차량을</option>
              <option value="2">여기에 띄워서</option>
              <option value="3">선택하게 하기</option>
            </select>
            
          </div>

          <div className={styles.contactInputGroup}>
            <label>문의 유형</label>
            <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} required>
              <option value="">유형을 선택하세요</option>
              <option value="엔진오일">엔진오일</option>
              <option value="타이어">타이어</option>
              <option value="정기점검">정기점검</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className={styles.contactInputGroup}>
            <label>문의 내용</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required />
          </div>

          <div className={styles.contactInputGroup}>
            <label>예약 날짜</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker value={formData.appointmentDate} onChange={handleDateChange} format="YYYY-MM-DD" />
            </LocalizationProvider>
          </div>

          <div className={styles.contactInputGroup}>
            <label>선택한 정비소</label>
            <input type="text" name="repairStoreName" value={formData.repairStoreName} readOnly />
          </div>

          {isLoaded && (
            <div className={styles.mapContainer}>
              <h3>가까운 정비소 선택</h3>
              <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={center} zoom={12}>
                {userLocation && <Marker position={userLocation} label="내 위치" />}

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
