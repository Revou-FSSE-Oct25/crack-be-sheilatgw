export function getMinimumDP(price: number) {
  const dpRules = [
    { max: 200_000, dp: 50_000 },
    { max: 700_000, dp: 100_000 },
    { max: 1_000_000, dp: 200_000 },
    { max: 1_500_000, dp: 300_000 },
    { max: 2_000_000, dp: 800_000 },
    { max: 3_000_000, dp: 1_500_000 },
  ]

  const rule = dpRules.find((rule) => price <= rule.max)

  return rule?.dp ?? 2_000_000
}

export function getFullPaymentDiscount(price: number) {
  if (price < 500_000) return 10_000

  if (price < 1_000_000) return 20_000

  if (price < 1_500_000) return 30_000

  return 50_000
}
