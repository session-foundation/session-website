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
 *     { duration: "P1M",  label: "Monthly",  unitText: "MONTH", price: "4.49",  currency: "USD" },
 *     { duration: "P3M",  label: "3 Months", unitText: "MONTH", price: "11.99",  currency: "USD" },
 *     { duration: "P1Y",  label: "Annual",   unitText: "YEAR",  price: "35.99", currency: "USD" }
 *   ]
 * }
 */
export const proPricing: PricingApiResponse =  {
    plans: [
      { duration: 'P1M', label: 'Monthly', unitText: 'MONTH', price: '4.49', currency: 'USD' },
      { duration: 'P3M', label: '3 Months', unitText: 'MONTH', price: '11.99', currency: 'USD' },
      { duration: 'P1Y', label: 'Annual', unitText: 'YEAR', price: '35.99', currency: 'USD' },
    ]
}
