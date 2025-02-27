import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Google 로그인 추가
import styles from "../styles/Login.module.css"; // CSS Modules 사용
import Layout from "../components/Layout";

const Login = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("로그인 시도:", { userId, password, rememberMe });
        // TODO: 로그인 API 호출 로직 추가
    };

    // Google 로그인 성공 시 호출
    const handleGoogleSuccess = (response: any) => {
        console.log("Google 로그인 성공:", response);
        // TODO: 서버로 Google 로그인 데이터 전송 및 처리
    };

    // Google 로그인 실패 시 호출
    const handleGoogleFailure = () => {
        console.error("Google 로그인 실패");
    };

    return (
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

                                <p className={styles.signup}>아직 회원이 아니신가요? <a href="/">회원가입하러가기</a></p>

                            </ul>
                        </fieldset>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
