import { BillingCharge } from "../types/corporate";

export const billingChargesMock: BillingCharge[] = [
  {
    id: 1,
    corporate_account_id: 1,
    period: "July 2026",
    amount_cents: 1495000,
    employee_count: 50,
    charge_type: "annual_membership",
    status: "pending",
    charged_at: null,
  },
  {
    id: 2,
    corporate_account_id: 1,
    period: "June 2026",
    amount_cents: 1375400,
    employee_count: 46,
    charge_type: "annual_membership",
    status: "charged",
    charged_at: "2026-06-30T23:30:00Z",
  },
  {
    id: 3,
    corporate_account_id: 1,
    period: "June 2026",
    amount_cents: 24000,
    employee_count: 8,
    charge_type: "test_surcharge",
    status: "charged",
    charged_at: "2026-06-18T03:10:00Z",
  },
  {
    id: 4,
    corporate_account_id: 1,
    period: "May 2026",
    amount_cents: 1196000,
    employee_count: 40,
    charge_type: "annual_membership",
    status: "charged",
    charged_at: "2026-05-31T23:30:00Z",
  },
];
