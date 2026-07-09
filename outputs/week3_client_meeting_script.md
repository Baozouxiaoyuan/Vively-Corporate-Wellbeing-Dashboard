# Vively Corporate Dashboard MVP - Week 3 Client Meeting Script

## Slide 1 - Week 3 prototype update

Good morning, everyone. Today we will walk through our Week 3 progress on the Vively Corporate Wellbeing Dashboard MVP.

The focus of this week was to turn the agreed direction into a working frontend prototype. We concentrated on the corporate admin workflow, mock data, privacy-safe health metrics, and a mock API layer that can later be replaced by real Vively routes.

By the end of this update, we want to confirm whether the workflow and data structure feel aligned with Vively's expectations before we continue building deeper interactions.

## Slide 2 - We focused on the frontend workflow first

Based on the previous meeting, we understood that the most useful next step was not to wait for final production API routes.

Instead, we built a frontend-first prototype with lightweight mock API functions. This allows us to test the admin experience now, while keeping the code structure close to a future real integration.

The prototype treats Vively as the source of truth for users, patients, memberships and health data. Our dashboard only stores corporate workflow records and Vively ID references. Most importantly, individual health records are not displayed.

## Slide 3 - The prototype now covers the main admin journey

The prototype currently includes the core pages we discussed: login, dashboard overview, employees, activation, health metrics and billing.

The key point is that these pages are not just static mockups. They are connected to mock API functions, so the frontend behaves more like a real application. For example, employee invite data comes from the mock API layer rather than being hardcoded directly in the page components.

We also started using selected Vively UI assets, including the logo, fonts, button, input and card styling, so the prototype is moving closer to Vively's own product language without importing the entire component library.

## Slide 4 - The dashboard gives admins a quick corporate snapshot

The Dashboard page is designed as the admin's quick overview.

It brings together the most important corporate signals: how many employees have been invited, how many active memberships there are, the activation rate, and the current mock billing amount.

It also shows corporate account details such as the company name, invite code, admin contact and plan price. This is useful because the admin should not need to jump into every page just to understand the current state of the company account.

The dashboard also includes a privacy notice. We placed that early in the experience because health reporting in this project must stay aggregate-only and must not expose individual health records.

## Slide 5 - Employee invites are the first working workflow

The Employees page is the first real workflow in the prototype.

An admin can enter an employee name, email, team and Medicare status, then create an invite. The new invite appears in the employee table with an invite status, signup match status, baseline status and membership status.

We also added a mock email resolver. This simulates a future Vively route that checks whether an invited employee email already maps to a Vively patient. If Vively builds that route later, this mock function can be replaced without rewriting the page.

The invite link currently follows the format `/join/{invite_token}`. The join page itself is not built yet, but this gives us a clear next step for the invite flow.

## Slide 6 - Activation reporting turns invite data into progress metrics

The Activation page converts employee workflow data into summary metrics.

It shows total invited, opened invites, continued to Vively, linked employees, baseline completed and active memberships. It also shows activation rate, baseline completion rate and membership rate.

The funnel chart is based on the same mock employee records. This helps us test whether the admin view communicates progress clearly before connecting to real Vively data.

One thing we would like feedback on is whether these activation stages match how Vively thinks about the onboarding journey.

## Slide 7 - Health metrics are aggregate-only by design

For Health Metrics, we implemented the strongest privacy boundary in the prototype.

The page only shows anonymised aggregate metrics. It does not show patient IDs, individual biomarker rows, raw blood test values or individual health records.

We also added a privacy threshold. If a selected team has fewer than 10 people, the dashboard shows an Insufficient Data message instead of showing the metrics. This is currently enforced in the frontend prototype, and we recommend that any production version should also enforce it in the backend.

The health category matrix shows aggregate percentages across categories such as Aging, Metabolic, Heart, Liver, Kidney and Blood.

## Slide 8 - Billing is represented as a safe mock workflow

The Billing page is included as a mock workflow only.

It shows the current company plan, the employee count used for billing, the current billing period, the amount due and the billing status. It also includes a billing history table with mock charges.

We intentionally did not integrate Stripe or real payment processing, because this prototype is focused on frontend workflow and data structure. The purpose of this page is to confirm what billing information a corporate admin would expect to see, not to process real payments.

This gives us a safe way to discuss billing requirements without adding production payment risk at this stage.

## Slide 9 - What we need from Vively next

For the next stage, we would like to confirm a few things with Vively.

First, are the employee invite fields correct: email, name, team and Medicare status? Second, do the activation stages match the real Vively onboarding process? Third, is a threshold of 10 appropriate for team-level health reporting? Finally, does the mock billing page show the right information for a corporate admin at this stage?

After this meeting, our next build priorities are to add a simple join invite page, improve the employee filtering/search workflow, keep aligning the UI with Vively components, and prepare the mock API layer so it can be replaced by real routes later.

The main message is that the foundation is now in place. We can demo the core admin journey, and we are ready to refine it based on Vively's feedback.
