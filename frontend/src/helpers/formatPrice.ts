export default function formatPrice(price: number | string): string {
  const value = typeof price === "string" ? Number(price) : price;

  if (Number.isNaN(value)) return "0 ₫";

  return value.toLocaleString("en-US") + " ₫";
}
