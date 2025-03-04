import { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import styles from "../styles/Map.module.css"; // CSS 파일 import
import Layout from "../components/Layout";

const defaultCenter = { lat: 37.5665, lng: 126.978 }; // 기본값: 서울

const predefinedMarkers = [
  { id: 1, lat: 37.5665, lng: 126.978, name: "서울" },
  { id: 2, lat: 35.1796, lng: 129.0756, name: "부산" },
  { id: 3, lat: 33.4996, lng: 126.5312, name: "제주" },
  { id: 4, lat: 37.29283478435398, lng: 126.9910148289709, name: "스타필드점" },
  { id: 5, lat: 37.23743738094663, lng: 127.20524845794462, name: "용인중앙지점" },
];

const Map: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState(defaultCenter);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number; name: string; address: string } | null>(null);

  // 사용자의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("위치 가져오기 오류:", error),
        { enableHighAccuracy: true } // 더 정확한 위치 사용
      );
    }
  }, []);

  // 마커 클릭 시 주소 변환 함수
  const handleMarkerClick = (marker: { lat: number; lng: number; name: string }) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: marker.lat, lng: marker.lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        setSelectedMarker({
          ...marker,
          address: results[0].formatted_address, // 변환된 주소 저장
        });
      } else {
        console.error("주소를 가져올 수 없습니다.", status);
        setSelectedMarker({
          ...marker,
          address: "주소 정보를 찾을 수 없습니다.",
        });
      }
    });
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <Layout>
      <h2 className={styles.mapTitle}>차고지의 가까운 가게</h2>
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={{
            width: "80%",
            height: "600px",
            margin: "80px auto",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          center={center}
          zoom={12} // 사용자 위치 중심이므로 확대 조정
        >
          {predefinedMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              label={marker.name}
              onClick={() => handleMarkerClick(marker)} // 마커 클릭 시 주소 변환
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div style={{ padding: "10px", fontSize: "14px" }}>
                <h3 style={{ margin: "0 0 5px 0" }}>{selectedMarker.name}</h3>
                <p>{selectedMarker.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </Layout>
  );
};

export default Map;
