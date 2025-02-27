import { useState } from "react";
import axios from "axios";

// API 응답 데이터 인터페이스 정의
interface RPAResponse {
    url: string;
    title: string;
}

const RPAComponent: React.FC = () => {
    const [url, setUrl] = useState<string>("");
    const [result, setResult] = useState<RPAResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleExtract = async () => {
        setLoading(true); // 로딩 시작
        setError(null);   // 이전 에러 초기화
        setResult(null);  // 이전 결과 초기화

        try {

            const response = await axios.get<RPAResponse>(
                `http://localhost:8094/api/rpa/scrape?url=${encodeURIComponent(url)}`
            );

            setResult(response.data);
            console.log(response);
            console.log(result);
        } catch (error) {
            setError("데이터를 가져오는 중 오류가 발생했습니다.");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <div style={{padding:'100px 3rem'}}>
          
            <h2>RPA 데이터 추출</h2>
            <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="URL 입력"
                disabled={loading} // 로딩 중 입력 비활성화
            />
            <button onClick={handleExtract} disabled={loading || !url.trim()}>
                {loading ? "추출 중..." : "데이터 추출"}
            </button>
            
            {loading && <p>⏳ 데이터를 불러오는 중...</p>} {/* 로딩 메시지 */}
            
            {error && <p style={{ color: "red" }}>❌ {error}</p>} {/* 오류 메시지 */}

            {result && (
                <div>
                    <h3>결과:</h3>
                    <p>✅ URL: {result.url}</p>
                    <p>📄 제목: {result.title}</p>
                </div>
            )}
        </div>
    );
};

export default RPAComponent;
