import { useState } from "react";
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"; // Google 로그인 추가
import styles from "../styles/Login.module.css"; // CSS Modules 사용
import Layout from "../components/Layout";

const clientId = "818242899946-o4a9sbi3d9dum52egbn797lhv2fpreq1.apps.googleusercontent.com"; // ✅ Google Cloud Console에서 발급받은 클라이언트 ID

const Login = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);

    // 일반 로그인 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userId, password }),
            });

            if (!response.ok) throw new Error("로그인 실패");

            const data = await response.json();

            // ✅ 로그인 성공 후 JWT 토큰을 localStorage에 저장하여 이후 API 요청에서 인증 유지
            localStorage.setItem("token", data.token);

            console.log("로그인 성공:", data);
        } catch (error) {
            console.error(error);
        }
    };

    // Google 로그인 요청
    const handleGoogleSuccess = async (response: GoogleCredentialResponse) => { 
        try {
            const res = await fetch("/api/auth/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tokenId: response.credential }), // ✅ response.credential 사용
            });

            if (!res.ok) throw new Error("Google 로그인 실패");

            const data = await res.json();

            // ✅ Google 로그인 성공 후 JWT 토큰을 localStorage에 저장하여 인증 유지
            localStorage.setItem("token", data.token);

            console.log("Google 로그인 성공:", data);
        } catch (error) {
            console.error(error);
        }
    };

    // Google 로그인 실패 시 호출
    const handleGoogleFailure = () => {
        console.error("Google 로그인 실패");
    };

    return (
        <GoogleOAuthProvider clientId={clientId}> {/* ✅ JSX 내부에서 감싸도록 수정 */}
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

                                    {/* Google 로그인 버튼 추가 */}
                                    <li className={styles.googleLogin}>
                                        <div className={styles.googleLoginWrapper}>
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleFailure}
                                                width="100%" // 버튼 크기 자동 조정
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
