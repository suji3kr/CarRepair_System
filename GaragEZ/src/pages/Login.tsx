import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동을 위한 useNavigate 추가
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import styles from "../styles/Login.module.css";
import Layout from "../components/Layout";

const clientId = "818242899946-o4a9sbi3d9dum52egbn797lhv2fpreq1.apps.googleusercontent.com"; // ✅ Google Cloud Console 클라이언트 ID

const Login = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate 사용

    // 일반 로그인 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8094/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userId, password }),
            });

            if (!response.ok) {
                alert("로그인 실패하였습니다. 다시 로그인하세요."); // ✅ 실패 시 경고창 띄우기
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // ✅ JWT 토큰 저장
            navigate("/"); // ✅ 로그인 성공 시 HOME으로 이동
        } catch (error) {
            console.error(error);
            alert("로그인 중 오류가 발생했습니다."); // ✅ 에러 처리 추가
        }
    };

    // Google 로그인 요청
    const handleGoogleSuccess = async (response: GoogleCredentialResponse) => { 
        try {
            const res = await fetch("http://localhost:8094/api/auth/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tokenId: response.credential }),
                credentials: "include",
            });

            if (!res.ok) {
                alert("Google 로그인 실패하였습니다. 다시 로그인하세요."); // ✅ Google 로그인 실패 시 경고창 띄우기
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token); // ✅ JWT 토큰 저장
            navigate("/"); // ✅ Google 로그인 성공 시 HOME으로 이동
        } catch (error) {
            console.error(error);
            alert("Google 로그인 중 오류가 발생했습니다."); // ✅ 에러 처리 추가
        }
    };

    // Google 로그인 실패 시 호출
    const handleGoogleFailure = () => {
        alert("Google 로그인 실패하였습니다. 다시 로그인하세요."); // ✅ Google 로그인 실패 시 경고창 띄우기
    };

    return (
        <GoogleOAuthProvider clientId={clientId}> 
            <Layout>
                <div className={styles.wrapLogin}>
                    <div className={styles.loginMain}>
                        <h2>Login</h2>
                        <h4>자동차는 역시 차고지</h4>

                        <form onSubmit={handleSubmit}>
                            <fieldset>
                                <ul>
                                    <li>
                                        <h3>ID</h3>
                                        <input
                                            type="text"
                                            placeholder="아이디를 입력해주세요."
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            autoFocus
                                        />
                                    </li>
                                    <li>
                                        <h3>PASSWORD</h3>
                                        <input
                                            type="password"
                                            placeholder="비밀번호를 입력해주세요."
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </li>
                                    <li>
                                        <label className={styles.checkbox}>
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                            />{" "}
                                            아이디 저장
                                        </label>
                                    </li>
                                    <li>
                                        <input type="submit" value="로그인" />
                                    </li>

                                    {/* Google 로그인 버튼 */}
                                    <li className={styles.googleLogin}>
                                        <div className={styles.googleLoginWrapper}>
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleFailure}
                                                width="100%"
                                            />
                                        </div>
                                    </li>

                                    <p className={styles.signup}>
                                        아직 회원이 아니신가요? <a href="/signup">회원가입하러가기</a>
                                    </p>
                                </ul>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </Layout>
        </GoogleOAuthProvider> 
    );
};

export default Login;
