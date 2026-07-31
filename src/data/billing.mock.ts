import { BillingCharge, BillingSummary } from "../types/corporate";

export const billingChargesMock: BillingCharge[] = [
  {
    id: 1,
    period: "2026-07",
    amount_cents: 1495000,
    employee_count: 50,
    charge_type: "annual_membership",
    status: "pending",
    charged_at: null,
    created_at: "2026-07-01T00:00:00+00:00",
  },
  {
    id: 2,
    period: "2026-06",
    amount_cents: 1375400,
    employee_count: 46,
    charge_type: "annual_membership",
    status: "charged",
    charged_at: "2026-06-30T23:30:00+00:00",
    created_at: "2026-06-01T00:00:00+00:00",
  },
  {
    id: 3,
    period: "2026-06",
    amount_cents: 24000,
    employee_count: 8,
    charge_type: "test_surcharge",
    status: "charged",
    charged_at: "2026-06-18T03:10:00+00:00",
    created_at: "2026-06-18T03:10:00+00:00",
  },
  {
    id: 4,
    period: "2026-05",
    amount_cents: 1196000,
    employee_count: 40,
    charge_type: "annual_membership",
    status: "charged",
    charged_at: "2026-05-31T23:30:00+00:00",
    created_at: "2026-05-01T00:00:00+00:00",
  },
];

export const billingSummaryMock: BillingSummary = {
  current_period: "2026-07",
  annual_membership: {
    amount_cents: billingChargesMock[0].amount_cents,
    employee_count: billingChargesMock[0].employee_count,
    status: billingChargesMock[0].status,
    charged_at: billingChargesMock[0].charged_at,
  },
  charges: billingChargesMock,
};
