import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/SignUp.module.css";
import { FormData } from "../types/Signup";
import agreement from "../text/agreement.txt?raw";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const API_URL = "http://localhost:8094/api/users/signup";
const CARS_API_URL = "http://localhost:8094/api/cars?car_make=";

const initialFormData: FormData = {
  userId: "",
  password: "",
  name: "",
  email: "",
  phone: "",
  carMake: "",
  carModel: "",
  carNumber: "",
  year: "",
  vin: "",
  coOwner: false,
  coOwnerName: "",
  coOwnerPhone: "",
  termsAgreed: false,
};

const SignUp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const termsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [cars, setCars] = useState<any[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsScrolledToBottom(true);
      }
    }
  };

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

  return (
    <Layout>
      <div className={styles.signupContainer}>
        <h2 className={styles.signupTitle}>회원가입</h2>
        <p className={styles.signupDescription}>방문해주셔서 감사합니다.</p>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.signupFormGroup}>
            <label>아이디</label>
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />
          </div>

          {!isGoogleSignup && (
            <div className={styles.signupFormGroup}>
              <label>비밀번호</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          )}

          <div className={styles.signupFormGroup}>
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>이메일</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isGoogleSignup} />
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
                      {["쌍용", "쉐보레", "기아", "현대"].map((manufacturer, index) => (
                        <MenuItem key={index} value={manufacturer}>
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
                      {cars.map((car: any) => (
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
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="연식"
                required
              />
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