import { useState } from "react";
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
                </ul>
            </fieldset>
            </form>
        </div>
        </div>
    </Layout>
    );
};

export default Login;
