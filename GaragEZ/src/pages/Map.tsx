import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "600px",
  margin: "80px",
};

// 기본 지도 중심 (서울)
const defaultCenter = { lat: 37.5665, lng: 126.978 };

// 특정 지역 마커 목록 (예: 서울, 부산, 제주)
const predefinedMarkers = [
  { id: 1, lat: 37.5665, lng: 126.978, name: "서울" },
  { id: 2, lat: 35.1796, lng: 129.0756, name: "부산" },
  { id: 3, lat: 33.4996, lng: 126.5312, name: "제주" },
];

const Map: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState(defaultCenter);

  // Google Maps API가 로드되지 않았을 때 로딩 메시지 표시
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
      {predefinedMarkers.map((marker) => (
        <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} label={marker.name} />
      ))}
    </GoogleMap>
  );
};

export default Map;
