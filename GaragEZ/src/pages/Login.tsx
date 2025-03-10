import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import styles from "../styles/Login.module.css";
import Layout from "../components/Layout";

// 타입을 별도의 파일에서 import
import { LoginRequest, GoogleLoginRequest, JwtResponse } from "../types/auth"; // 타입 임포트

const clientId = "818242899946-o4a9sbi3d9dum52egbn797lhv2fpreq1.apps.googleusercontent.com"; 

const Login = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate(); 

    // 일반 로그인 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginRequest: LoginRequest = {
            email: userId,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8094/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginRequest),  // LoginRequest 타입 사용
            });

            if (!response.ok) {
                alert("로그인 실패하였습니다. 다시 로그인하세요.");
                return;
            }

            const data: JwtResponse = await response.json(); // JwtResponse 타입으로 응답 처리
            localStorage.setItem("token", data.token);
            navigate("/home"); 
        } catch (error) {
            console.error(error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    const handleGoogleSuccess = async (response: GoogleCredentialResponse) => {
        // GoogleLoginRequest 타입을 만족하는 객체 생성
        const googleLoginRequest: GoogleLoginRequest = {
            tokenId: response.credential,  // response.credential을 tokenId로 할당
        };
    
        try {
            const res = await fetch("http://localhost:8094/api/auth/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(googleLoginRequest),  // 요청 본문에 googleLoginRequest를 전달
                credentials: "include",  // 쿠키를 포함한 요청
            });
    
            if (!res.ok) {
                alert("Google 로그인 실패하였습니다. 다시 로그인하세요.");
                return;
            }
    
            const data: JwtResponse = await res.json(); // JwtResponse 타입으로 응답 받기
            localStorage.setItem("token", data.token); // 토큰을 로컬스토리지에 저장
            navigate("/home");  // 로그인 성공 시 홈으로 이동
        } catch (error) {
            console.error(error);
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
