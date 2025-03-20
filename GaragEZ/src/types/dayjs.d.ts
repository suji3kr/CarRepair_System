// dayjs.d.ts
import 'dayjs';

declare module 'dayjs' {
  interface Dayjs {
    tz(timezone?: string): Dayjs; // tz 메서드 타입 정의
  }
}

