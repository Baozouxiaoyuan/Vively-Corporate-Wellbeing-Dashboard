# Integration Notes

These notes summarise what the frontend would need for a real integration. This is not a database design.

## Existing Vively Data We Expect To Use

- Users and patient profiles
- Invitation or signup status
- Membership or subscription status
- Baseline completion status
- Biomarker values and health score categories

Raw patient health data should be processed on the backend, not sent directly to the corporate admin frontend.

## Corporate Layer We May Need

The dashboard needs a corporate-facing layer for:

- Corporate account details
- Employee invite records
- Team labels
- Email delivery status
- Employee-to-Vively user/patient references
- Activation summary
- Aggregate health metrics
- Billing summary

Some of this can live in our own backend. Some parts need Vively support, especially identity linking and health data access.

## Main Vively Support Needed

- Resolve an employee email to Vively `user_id` and `patient_id`
- Confirm consent or permission for including a user in corporate aggregates
- Provide or allow backend calculation of aggregate health metrics
- Send real invitation emails
- Clarify billing rules if the billing page becomes functional

## Health Metrics Integration

The frontend expects aggregate results like:

```ts
{
  team: "All Teams",
  cohort_size: 34,
  optimal_biomarker_percentage: 54,
  in_range_biomarker_percentage: 31,
  needs_attention_percentage: 15,
  category_distribution: [
    { category: "Nutrients", optimal: 44, in_range: 38, needs_attention: 18 }
  ]
}
```

The backend should enforce the privacy threshold before returning this data.

