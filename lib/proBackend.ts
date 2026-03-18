import type { PricingPlan } from './proPageSchema';

export type PricingApiResponse = {
  plans: PricingPlan[];
};
/**
 * Fetches Pro pricing plans from your API.
 * Called server-side in getStaticProps — replace the URL with your actual endpoint.
 *
 * Expected API response shape:
 * {
 *   plans: [
 *     { duration: "P1M",  label: "Monthly",  unitText: "MONTH", price: "2.49",  currency: "USD" },
 *     { duration: "P3M",  label: "3 Months", unitText: "MONTH", price: "5.99",  currency: "USD" },
 *     { duration: "P1Y",  label: "Annual",   unitText: "YEAR",  price: "14.99", currency: "USD" }
 *   ]
 * }
 */
export async function fetchProPricing(locale: string): Promise<PricingApiResponse> {
  return {
    plans: [
      { duration: 'P1M', label: 'Monthly', unitText: 'MONTH', price: '2.49', currency: 'USD' },
      { duration: 'P3M', label: '3 Months', unitText: 'MONTH', price: '5.99', currency: 'USD' },
      { duration: 'P1Y', label: 'Annual', unitText: 'YEAR', price: '14.99', currency: 'USD' },
    ],
  };

  const res = await fetch(`${process.env.PRICING_API_BASE_URL}/pro/pricing?locale=${locale}`, {
    headers: {
      'Content-Type': 'application/json',
      // Add any auth headers your API requires, e.g.:
      // Authorization: `Bearer ${process.env.PRICING_API_KEY}`,
    },
    // Revalidate pricing every hour during ISR if you use it
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Pro pricing for locale "${locale}": ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<PricingApiResponse>;
}
