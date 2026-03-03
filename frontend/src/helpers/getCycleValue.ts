export default function getCycleValue(n: number): number {
  // Chuỗi lặp: 3, 2, 1
  // (n - 1) % 3 → index trong mảng
  const cycle = [3, 2, 1];
  return cycle[(n - 1) % 3];
}