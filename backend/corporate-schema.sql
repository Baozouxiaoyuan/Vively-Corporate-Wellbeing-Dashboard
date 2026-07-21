-- Corporate dashboard layer schema.
-- This is intentionally separate from Vively patient health tables.
-- It stores corporate workflow data and nullable references to existing Vively users/patients.

CREATE TABLE corporate_accounts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  invite_code VARCHAR(64) NOT NULL,
  plan_price_cents INT UNSIGNED NOT NULL,
  primary_admin_name VARCHAR(255) NOT NULL,
  primary_admin_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY corporate_accounts_invite_code_unique (invite_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE corporate_admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  corporate_account_id BIGINT UNSIGNED NOT NULL,
  -- Optional link to Vively users.id if corporate admins also exist as Vively users.
  vively_user_id BIGINT UNSIGNED DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('owner','admin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY corporate_admins_account_email_unique (corporate_account_id, email),
  KEY corporate_admins_vively_user_id_index (vively_user_id),
  CONSTRAINT corporate_admins_account_foreign
    FOREIGN KEY (corporate_account_id) REFERENCES corporate_accounts (id)
    ON DELETE CASCADE
  -- Future Vively codebase integration can add:
  -- FOREIGN KEY (vively_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE corporate_employees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  corporate_account_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  has_medicare TINYINT(1) NOT NULL DEFAULT 1,
  invite_token VARCHAR(100) NOT NULL,
  invite_status ENUM('invited','opened','continued_to_vively') NOT NULL DEFAULT 'invited',
  signup_match_status ENUM('not_found','found') NOT NULL DEFAULT 'not_found',
  -- These match existing Vively users.id and patients.id.
  -- They are stored for server-side linking only; the frontend should not display them.
  vively_user_id BIGINT UNSIGNED DEFAULT NULL,
  vively_patient_id BIGINT UNSIGNED DEFAULT NULL,
  membership_status ENUM('inactive','active') NOT NULL DEFAULT 'inactive',
  baseline_status ENUM('not_started','booked','completed') NOT NULL DEFAULT 'not_started',
  invited_at TIMESTAMP NULL DEFAULT NULL,
  email_sent_at TIMESTAMP NULL DEFAULT NULL,
  opened_at TIMESTAMP NULL DEFAULT NULL,
  signedup_at TIMESTAMP NULL DEFAULT NULL,
  removed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY corporate_employees_invite_token_unique (invite_token),
  UNIQUE KEY corporate_employees_account_email_unique (corporate_account_id, email),
  KEY corporate_employees_vively_user_id_index (vively_user_id),
  KEY corporate_employees_vively_patient_id_index (vively_patient_id),
  KEY corporate_employees_team_name_index (team_name),
  CONSTRAINT corporate_employees_account_foreign
    FOREIGN KEY (corporate_account_id) REFERENCES corporate_accounts (id)
    ON DELETE CASCADE
  -- Future Vively codebase integration can add:
  -- FOREIGN KEY (vively_user_id) REFERENCES users (id) ON DELETE SET NULL
  -- FOREIGN KEY (vively_patient_id) REFERENCES patients (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE corporate_billing_charges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  corporate_account_id BIGINT UNSIGNED NOT NULL,
  period VARCHAR(32) NOT NULL,
  amount_cents INT UNSIGNED NOT NULL,
  employee_count INT UNSIGNED NOT NULL,
  charge_type ENUM('annual_membership','test_surcharge') NOT NULL,
  status ENUM('charged','pending','failed') NOT NULL DEFAULT 'pending',
  charged_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY corporate_billing_charges_account_period_index (corporate_account_id, period),
  CONSTRAINT corporate_billing_charges_account_foreign
    FOREIGN KEY (corporate_account_id) REFERENCES corporate_accounts (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
