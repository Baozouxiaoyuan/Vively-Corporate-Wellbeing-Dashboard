import { HealthMetrics, HealthTrend } from "../types/corporate";
import { teamsMock } from "./employees.mock";

const categorySets = {
  company: [
    ["Aging", 57, 30, 13], ["Metabolic", 56, 31, 13], ["Heart", 61, 28, 11], ["Liver", 68, 24, 8], ["Nutrients", 44, 38, 18],
    ["Kidney", 72, 22, 6], ["Hormones", 49, 34, 17], ["Immunity", 63, 29, 8], ["Inflammation", 52, 30, 18], ["Blood", 66, 27, 7],
  ],
  operations: [
    ["Aging", 51, 31, 18], ["Metabolic", 53, 33, 14], ["Heart", 47, 35, 18], ["Liver", 57, 31, 12], ["Nutrients", 42, 37, 21],
    ["Kidney", 69, 23, 8], ["Hormones", 46, 35, 19], ["Immunity", 58, 30, 12], ["Inflammation", 49, 32, 19], ["Blood", 61, 28, 11],
  ],
  engineering: [
    ["Aging", 60, 27, 13], ["Metabolic", 61, 28, 11], ["Heart", 55, 31, 14], ["Liver", 64, 27, 9], ["Nutrients", 50, 34, 16],
    ["Kidney", 74, 20, 6], ["Hormones", 54, 33, 13], ["Immunity", 67, 25, 8], ["Inflammation", 57, 29, 14], ["Blood", 69, 24, 7],
  ],
  sales: [
    ["Aging", 52, 32, 16], ["Metabolic", 49, 34, 17], ["Heart", 55, 31, 14], ["Liver", 60, 29, 11], ["Nutrients", 39, 39, 22],
    ["Kidney", 66, 24, 10], ["Hormones", 44, 36, 20], ["Immunity", 58, 29, 13], ["Inflammation", 46, 34, 20], ["Blood", 62, 28, 10],
  ],
} as const;

function categories(rows: readonly (readonly [string, number, number, number])[]) {
  return rows.map(([name, optimal, in_range, needs_attention]) => ({
    name,
    average_score: optimal,
    trend: (optimal >= 55 ? "up" : optimal >= 45 ? "flat" : "down") as HealthTrend,
    optimal,
    in_range,
    needs_attention,
  }));
}

export const healthMetricsMock: HealthMetrics[] = [
  {
    scope: "company",
    team: null,
    cohort_size: 50,
    below_privacy_threshold: false,
    categories: categories(categorySets.company),
  },
  {
    scope: "team",
    team: teamsMock[0],
    cohort_size: 12,
    below_privacy_threshold: false,
    categories: categories(categorySets.operations),
  },
  {
    scope: "team",
    team: teamsMock[1],
    cohort_size: 11,
    below_privacy_threshold: false,
    categories: categories(categorySets.engineering),
  },
  {
    scope: "team",
    team: teamsMock[2],
    cohort_size: 10,
    below_privacy_threshold: false,
    categories: categories(categorySets.sales),
  },
  {
    scope: "team",
    team: teamsMock[3],
    cohort_size: 9,
    below_privacy_threshold: true,
    categories: null,
  },
  {
    scope: "team",
    team: teamsMock[4],
    cohort_size: 8,
    below_privacy_threshold: true,
    categories: null,
  },
];
