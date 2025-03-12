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
    const [rememberMe, setRememberMe] = useState(false); // 기본값 false로 변경
    const navigate = useNavigate();

    // ✅ 페이지 로드 시 저장된 아이디 불러오기
    useEffect(() => {
        const savedUserId = localStorage.getItem("savedUserId");
        if (savedUserId) {
            setUserId(savedUserId);
            setRememberMe(true);
        }
    }, []);

    const handleLoginSuccess = (userId: string, userEmail?: string) => {
        localStorage.setItem("userId", userId);
        if (userEmail) {
            localStorage.setItem("userEmail", userEmail);
        }
        // ✅ rememberMe가 체크되어 있으면 아이디 저장
        if (rememberMe) {
            localStorage.setItem("savedUserId", userId);
        } else {
            localStorage.removeItem("savedUserId");
        }
        alert(`환영합니다, ${userId}님!`);
        navigate("/home");
    };

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
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert("로그인 실패: " + errorText);
                return;
            }

            const data: JwtResponse = await response.json();
            localStorage.setItem("token", data.token);
            handleLoginSuccess(userId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("로그인 중 오류가 발생했습니다: " + error.message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
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

            const res = await fetch("http://localhost:8094/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(googleLoginRequest),
                credentials: "include",
            });

            if (!res.ok) {
                const errorText = await res.text();
                // ✅ 추가 정보가 필요한 경우 signup 페이지로 이동
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

            // JwtResponse - newUser, userId도 받도록 수정
            const data: JwtResponse = await res.json();
            localStorage.setItem("token", data.token);
            // 신규 유저 회원가입으로
            handleLoginSuccess(userName, userEmail);
        } catch (error: unknown) {
            console.error("Google 로그인 오류:", error);
            if (error instanceof Error) {
                alert(`Google 로그인 중 오류가 발생했습니다: ${error.message}`);
            } else {
                alert(`Google 로그인 중 알 수 없는 오류가 발생했습니다: ${JSON.stringify(error)}`);
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
                                                useOneTap
                                                auto_select={false}
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