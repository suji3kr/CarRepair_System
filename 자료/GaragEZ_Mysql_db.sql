-- 🚗 차량 정비 시스템 데이터베이스 삭제 및 생성
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS part_prices;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS repair_store;
DROP TABLE IF EXISTS maintenance_records;
DROP TABLE IF EXISTS approvals;
DROP TABLE IF EXISTS store_orders;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS setup_tracks;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS parts;
DROP TABLE IF EXISTS admin;
SET FOREIGN_KEY_CHECKS=1;

-- 👤 사용자 테이블: 고객 및 관리자의 정보를 저장
CREATE TABLE users (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
phone VARCHAR(20),
role ENUM('USER', 'ADMIN') NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🚘 차량 테이블: 사용자가 소유한 차량 정보 저장
CREATE TABLE vehicles (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
owner_id BIGINT,
make VARCHAR(100) NOT NULL,
model VARCHAR(100) NOT NULL,
year INT NOT NULL,
vin VARCHAR(50) UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 🔩 부품 테이블: 자동차 부품 정보를 저장
CREATE TABLE parts (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
category VARCHAR(100),
price DECIMAL(10,2) NOT NULL,
stock INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏪 부품 판매점 테이블: 부품 판매점의 정보 저장
CREATE TABLE store (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
part_id BIGINT,
price DECIMAL(10,2) NOT NULL,
stock INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE
);

-- 🛍 부품 주문 테이블: 사용자가 부품을 주문한 내역 저장
CREATE TABLE store_orders (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT,
part_id BIGINT,
quantity INT NOT NULL,
order_price DECIMAL(10,2) NOT NULL,
total_price DECIMAL(10,2) NOT NULL,
status ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL,
order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE
);

-- 🛠 정비 예약 테이블: 사용자가 정비를 예약한 내역 저장
CREATE TABLE appointments (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT,
vehicle_id BIGINT,
service_type VARCHAR(100) NOT NULL,
status ENUM('예약', '진행중', '완료') NOT NULL,
scheduled_date TIMESTAMP NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 🛠 정비소 정보 테이블: 정비소 정보를 저장하고 예약과 연결
CREATE TABLE repair_store (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
store_id BIGINT,
appointment_id BIGINT,
location VARCHAR(255) NOT NULL,
contact_info VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE SET NULL,
FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- 📢 알림 테이블: 사용자에게 전송된 알림을 저장
CREATE TABLE notifications (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT,
message TEXT NOT NULL,
status ENUM('읽음', '안읽음') NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 📈 부품 가격 비교 테이블: 여러 판매점에서 제공하는 부품 가격을 저장
CREATE TABLE part_prices (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
part_id BIGINT,
store_id BIGINT,
price DECIMAL(10,2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE,
FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
);

-- 🎢 트랙 관리 테이블: 관리자가 관리하는 트랙 정보를 저장
CREATE TABLE setup_tracks (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 👑 관리자 테이블: 관리자 정보 저장
CREATE TABLE admin (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 🛠 관리자 승인 테이블: 예약 및 결제 승인을 관리
CREATE TABLE approvals (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
admin_id BIGINT,
user_id BIGINT,
approval_type ENUM('예약', '결제', '주문 승인', '반품 승인') NOT NULL,
status ENUM('승인', '거절') NOT NULL,
order_id BIGINT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (order_id) REFERENCES store_orders(id) ON DELETE CASCADE
);

-- 🛠 정비 기록 테이블: 완료된 정비 내역 저장
CREATE TABLE maintenance_records (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
vehicle_id BIGINT,
user_id BIGINT,
appointment_id BIGINT,
service_type VARCHAR(100) NOT NULL,
description TEXT,
service_date DATE NOT NULL,
cost DECIMAL(10,2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS=1;