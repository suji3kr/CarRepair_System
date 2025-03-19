import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/SignUp.module.css";
import { FormData, initialFormData } from "../types/Signup";
import agreement from "../text/agreement.txt?raw";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users/signup`;
const CARS_API_URL = `${import.meta.env.VITE_API_URL}/api/cars?car_make=`;
const CHECK_DUPLICATE_URL = `${import.meta.env.VITE_API_URL}/api/users/check-duplicate`;

interface Car {
  id: string;
  carModel: string;
}

const SignUp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const termsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null); // 비밀번호 일치 여부 상태 추가

  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email,
        name: location.state.name || "",
        userId: location.state.email.split("@")[0],
        password: "",
      }));
      setIsGoogleSignup(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.carMake) {
      const loadCars = async () => {
        try {
          const response = await axios.get(`${CARS_API_URL}${formData.carMake}`, {
            headers: { "Content-Type": "application/json" },
          });
          if (response.data && Array.isArray(response.data)) {
            setCars(response.data);
          } else {
            setCars([]);
          }
        } catch (error) {
          console.error("차량 모델 로드 실패:", error);
          setCars([]);
        }
      };
      loadCars();
    } else {
      setCars([]);
    }
  }, [formData.carMake]);

  // 비밀번호와 비밀번호 확인 일치 여부 실시간 확인
  useEffect(() => {
    if (formData.password === "" && passwordConfirm === "") {
      setIsPasswordMatch(null); // 둘 다 비어있으면 상태 초기화
    } else {
      setIsPasswordMatch(formData.password === passwordConfirm);
    }
  }, [formData.password, passwordConfirm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      ? e.target
      : (e.target as HTMLSelectElement);

    const checked = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : name === "year" ? (value === "" ? "" : parseInt(value, 10)) : value,
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setPasswordConfirm("");
    setIsIdAvailable(null);
    setIsPasswordMatch(null); // 초기화 시 비밀번호 일치 상태도 리셋
  };

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsScrolledToBottom(true);
      }
    }
  };

  useEffect(() => {
    if (formData.userId.trim() === "") {
      setIsIdAvailable(null);
      return;
    }

    const checkId = async () => {
      try {
        const response = await axios.post(
          CHECK_DUPLICATE_URL,
          { userId: formData.userId },
          { headers: { "Content-Type": "application/json" } }
        );
        setIsIdAvailable(!response.data.isDuplicate);
      } catch (error) {
        console.error("아이디 중복 확인 실패:", error);
        setIsIdAvailable(null);
      }
    };

    checkId();
  }, [formData.userId]);

  const signUp = async (data: FormData) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("회원가입 성공:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("회원가입 실패:", error.response?.data || error.message);
      } else {
        console.error("알 수 없는 에러:", error);
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("약관에 동의해야 합니다.");
      return;
    }
    if (isIdAvailable === null) {
      alert("아이디 중복 확인이 필요합니다.");
      return;
    }
    if (isIdAvailable === false) {
      alert("사용 workplaces 수 없는 아이디입니다. 다른 아이디를 입력해 주세요.");
      return;
    }
    if (!isGoogleSignup && isPasswordMatch === false) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signUp(formData);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "서버 오류가 발생했습니다.";
        alert(`회원가입 중 오류가 발생했습니다: ${errorMessage}`);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const years = Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) => 1980 + i).reverse();

  return (
    <Layout>
      <div className={styles.signupContainer}>
        <h2 className={styles.signupTitle}>회원가입</h2>
        <p className={styles.signupDescription}>방문해주셔서 감사합니다.</p>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.signupFormGroup}>
            <label>아이디</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
            {isIdAvailable === false && <p style={{ color: "red" }}>중복된 아이디입니다.</p>}
            {isIdAvailable === true && <p style={{ color: "green" }}>사용 가능한 아이디입니다.</p>}
          </div>

          {!isGoogleSignup && (
            <>
              <div className={styles.signupFormGroup}>
                <label>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.signupFormGroup}>
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
                {isPasswordMatch === false && <p style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</p>}
                {isPasswordMatch === true && <p style={{ color: "green" }}>비밀번호가 일치합니다.</p>}
              </div>
            </>
          )}

          <div className={styles.signupFormGroup}>
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isGoogleSignup}
            />
          </div>

          <div className={styles.signupFormGroup}>
            <label>휴대전화</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>차량정보</label>
            <div className={styles.vehicleInfoGroup}>
              <div className={styles.vehicleSelectGroup}>
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="carMake-label">차 브랜드</InputLabel>
                    <Select
                      labelId="carMake-label"
                      name="carMake"
                      value={formData.carMake}
                      label="차 브랜드"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="">브랜드를 선택하세요</MenuItem>
                      {["쌍용", "쉐보레", "기아", "현대"].map((manufacturer) => (
                        <MenuItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className={styles.MultiSelect}>
                  <FormControl fullWidth>
                    <InputLabel id="carModel-label">차 모델</InputLabel>
                    <Select
                      labelId="carModel-label"
                      name="carModel"
                      value={formData.carModel}
                      label="차 모델"
                      onChange={handleChange}
                      required
                      disabled={!formData.carMake || cars.length === 0}
                    >
                      <MenuItem value="">차량을 선택하세요</MenuItem>
                      {cars.map((car) => (
                        <MenuItem key={car.id} value={car.carModel}>
                          {car.carModel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <input
                type="text"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                placeholder="차량 번호"
                required
              />
              <br />
              <br />
              <FormControl fullWidth className={styles.yearbtn}>
                <InputLabel id="year-label">연식</InputLabel>
                <Select
                  labelId="year-label"
                  name="year"
                  value={formData.year === "" ? "" : formData.year.toString()}
                  label="연식"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">연식을 선택하세요</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="차대 번호"
                required
              />
            </div>
          </div>

          <div className={styles.signupTerms}>
            <label>
              <input
                type="checkbox"
                name="coOwner"
                checked={formData.coOwner}
                onChange={handleChange}
              />
              공동 소유주 여부
            </label>

            {formData.coOwner && (
              <div className={styles.coOwnerFields}>
                <p className={styles.coOwnerWarning}>
                  최초 등록 후 수정이 어려우니 신중하게 작성해주세요.<br />수정 요청은 관리자 문의를 통해서만 가능합니다.
                </p>
                <label>공동 소유주 이름:</label>
                <input
                  type="text"
                  name="coOwnerName"
                  value={formData.coOwnerName}
                  onChange={handleChange}
                />
                <label>공동 소유주 전화번호:</label>
                <input
                  type="text"
                  name="coOwnerPhone"
                  value={formData.coOwnerPhone}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className={styles.termsContainer} ref={termsRef} onScroll={handleScroll}>
            <h3>이용약관</h3>
            <p>
              <pre>{agreement}</pre>
            </p>
          </div>

          <label className={styles.termsLabel}>
            <input
              type="checkbox"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
              disabled={!isScrolledToBottom}
              required
            />
            약관에 동의합니다.
          </label>

          <div className={styles.signupFormActions}>
            <button type="submit" className={styles.signupButton}>
              회원가입
            </button>
            <button type="reset" className={styles.signupButton} onClick={handleReset}>
              다시 작성
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;