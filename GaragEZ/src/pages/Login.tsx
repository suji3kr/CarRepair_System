import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import styles from "../styles/Login.module.css";
import Layout from "../components/Layout";
import { LoginRequest, GoogleLoginRequest, JwtResponse } from "../types/auth";

const clientId = "818242899946-o4a9sbi3d9dum52egbn797lhv2fpreq1.apps.googleusercontent.com"; 

const Login = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUserId = localStorage.getItem("savedUserId");
        if (savedUserId) {
            setUserId(savedUserId);
            setRememberMe(true);
        }
    }, []);

    const handleLoginSuccess = (userId: string, userRole: string, userEmail?: string) => {
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole); // ✅ userRole 저장

        if (userEmail) {
            localStorage.setItem("userEmail", userEmail);
        }

        if (rememberMe) {
            localStorage.setItem("savedUserId", userId);
        } else {
            localStorage.removeItem("savedUserId");
        }

        // ✅ 로그인한 사용자 정보 콘솔 출력
        console.log("🔹 로그인 성공!");
        console.log("👤 사용자 ID:", userId);
        console.log("🎭 사용자 역할(userRole):", userRole);
        if (userEmail) console.log("📧 사용자 이메일:", userEmail);

        alert(`환영합니다, ${userId}님!`);
        navigate("/home");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        const loginRequest: LoginRequest = { userId, password };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginRequest),
                credentials: "include",
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json(); // JSON 응답 파싱
                    let errorMessage = "로그인 실패: 알 수 없는 오류";
            
                    // 특정 오류 메시지에 대한 한글 변환
                    if (errorData.message.includes("User not found")) {
                        errorMessage = "로그인 실패: 해당 사용자를 찾을 수 없습니다📌";
                    } else if (errorData.message.includes("Unauthorized")) {
                        errorMessage = "로그인 실패: 인증되지 않은 사용자입니다📌";
                    }
            
                    alert(errorMessage);
                } catch (e) {
                    alert("로그인 실패: 서버 응답 오류");
                }
                return;
            }

            const data: JwtResponse = await response.json();
            localStorage.setItem("token", data.token);

            // ✅ userRole이 없으면 기본값 "user"로 설정
            const userRole = data.userRole || "user"; 

            // ✅ 로그인 정보 콘솔 출력
            console.log("🔹 일반 로그인 성공!");
            console.log("👤 사용자 ID:", userId);
            console.log("🎭 사용자 역할(userRole):", userRole);

            handleLoginSuccess(userId, userRole);
        } catch (error) {
            alert("로그인 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    const parseJwt = (token: string) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("JWT 디코딩 실패:", error);
            return null;
        }
    };

    const handleGoogleSuccess = async (response: GoogleCredentialResponse) => {
        if (!response.credential) {
            alert("Google 로그인 응답이 올바르지 않습니다.");
            return;
        }

        const decoded = parseJwt(response.credential);
        if (!decoded) {
            alert("Google 로그인 정보를 디코딩하는 데 실패했습니다.");
            return;
        }

        const userEmail = decoded.email;
        const userName = decoded.name || "GoogleUser";

        try {
            const googleLoginRequest: GoogleLoginRequest = {
                tokenId: response.credential,
            };

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(googleLoginRequest),
                credentials: "include",
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (res.status === 400 && errorText.includes("additional info required")) {
                    navigate("/signup", {
                        state: {
                            googleData: {
                                email: userEmail,
                                name: userName,
                                tokenId: response.credential
                            }
                        }
                    });
                    return;
                }
                alert("Google 로그인 실패: " + errorText);
                return;
            }

            const data: JwtResponse = await res.json();
            localStorage.setItem("token", data.token);

            // ✅ userRole이 없으면 기본값 "user"로 설정
            const userRole = data.userRole || "user"; 

            // ✅ Google 로그인 정보 콘솔 출력
            console.log("🔹 Google 로그인 성공!");
            console.log("👤 사용자 이름:", userName);
            console.log("📧 사용자 이메일:", userEmail);
            console.log("🎭 사용자 역할(userRole):", userRole);

            handleLoginSuccess(userName, userRole, userEmail);
        } catch (error) {
            console.error("Google 로그인 오류:", error);
            alert("Google 로그인 중 오류가 발생했습니다.");
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
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleFailure}
                                            useOneTap
                                            auto_select={false}
                                        />
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
