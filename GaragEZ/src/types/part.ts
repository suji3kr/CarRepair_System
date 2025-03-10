export interface Part {
  id?: number;  // 선택적 필드 (추가 시 자동 생성)
  name: string;  // 부품 이름
  category: string;  // 부품 카테고리
  price: number;  // 부품 가격
  stock: number;  // 부품 재고
  imageUrl?: string;  // 부품 이미지 URL (선택적)
}
