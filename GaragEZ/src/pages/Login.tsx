import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import styles from "../styles/Login.module.css";
import Layout from "../components/Layout";

// 타입을 별도의 파일에서 import
import { LoginRequest, GoogleLoginRequest, JwtResponse } from "../types/auth"; // 타입 임포트

const clientId = "818242899946-o4a9sbi3d9dum52egbn797lhv2fpreq1.apps.googleusercontent.com"; 

const Login = () => {
    const [userId, setUserId] = useState(""); // email 대신 userId 유지
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate(); 

    // ✅ 로그인 성공 후 UI 즉시 반영하는 함수
    const handleLoginSuccess = (userId: string, userEmail?: string) => {
        localStorage.setItem("userId", userId);
        if (userEmail) {
            localStorage.setItem("userEmail", userEmail);
        }

        alert(`환영합니다, ${userId}님!`);
        navigate("/home");
    };

    // ✅ 일반 로그인 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert("아이디를 입력해주세요.");
            return;
        }
        if (!password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        const loginRequest: LoginRequest = {
            userId: userId,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8094/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginRequest),
                credentials: "include", // CORS 문제 해결을 위해 추가
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert("로그인 실패: " + errorText);
                return;
            }

            const data: JwtResponse = await response.json();
            localStorage.setItem("token", data.token);

            // ✅ 로그인 성공 처리
            handleLoginSuccess(userId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("로그인 중 오류가 발생했습니다: " + error.message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    // ✅ Google 로그인 성공 처리
    const handleGoogleSuccess = async (response: GoogleCredentialResponse) => {
        if (!response.credential) {
            alert("Google 로그인 응답이 올바르지 않습니다.");
            return;
        }

        const googleLoginRequest: GoogleLoginRequest = {
            tokenId: response.credential, 
        };

        try {
            const res = await fetch("http://localhost:8094/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(googleLoginRequest),
                credentials: "include",
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert("Google 로그인 실패: " + errorText);
                return;
            }

            const data: JwtResponse = await res.json();
            localStorage.setItem("token", data.token);

            // ✅ Google 로그인 후 이메일 정보 가져오기
            const userProfile = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${response.credential}`,
                },
            });

            if (!userProfile.ok) {
                alert("사용자 프로필을 가져오는 데 실패했습니다.");
                return;
            }

            const profileData = await userProfile.json();
            const userEmail = profileData.email;

            // ✅ Google 로그인 성공 처리
            handleLoginSuccess("GoogleUser", userEmail);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("Google 로그인 중 오류가 발생했습니다: " + error.message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    const handleGoogleFailure = () => {
        alert("Google 로그인 실패하였습니다. 다시 로그인하세요.");
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
                                        <h3>Password</h3>
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
