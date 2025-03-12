export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  products?: Product[]; // 챗봇이 최저가 상품 목록을 포함할 수 있음
  endChat?: boolean; // 챗봇이 상담을 종료하도록 요청할 수 있음
}

export interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  link: string;
}
