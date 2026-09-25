-- =====================================================================
--  SPDA database setup
--  Run this in pgAdmin: right-click SPDA_Database -> Query Tool,
--  paste everything, then press F5 (Execute).
--  Safe to run more than once: it never deletes existing data.
-- =====================================================================

-- ---------- Lookup tables ----------

CREATE TABLE IF NOT EXISTS districts (
    district_id   SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS divisional_secretary_divisions (
    dsd_id      SERIAL PRIMARY KEY,
    dsd_name    VARCHAR(100) NOT NULL,
    district_id INT NOT NULL REFERENCES districts(district_id),
    UNIQUE (dsd_name, district_id)
);

CREATE TABLE IF NOT EXISTS service_divisions (
    service_division_id   SERIAL PRIMARY KEY,
    service_division_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS business_natures (
    business_nature_id   SERIAL PRIMARY KEY,
    business_nature_name VARCHAR(150) NOT NULL UNIQUE
);

-- ---------- Main table ----------

CREATE TABLE IF NOT EXISTS applications (
    application_id             SERIAL PRIMARY KEY,
    applicant_name             VARCHAR(200) NOT NULL,
    nic                        VARCHAR(20),
    contact_number             VARCHAR(20),
    email                      VARCHAR(150),
    address                    TEXT,
    district_id                INT REFERENCES districts(district_id),
    dsd_id                     INT REFERENCES divisional_secretary_divisions(dsd_id),
    gn_id                      INT,
    gn_division                VARCHAR(150),
    business_nature_id         INT REFERENCES business_natures(business_nature_id),
    service_division_id        INT REFERENCES service_divisions(service_division_id),
    service_provision_id       INT,
    business_registration_date DATE,
    application_date           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status                     VARCHAR(30) NOT NULL DEFAULT 'Pending',
    remarks                    TEXT
);

-- Extra fields used by the dashboard form (added safely if the table already existed)
ALTER TABLE applications ADD COLUMN IF NOT EXISTS whatsapp_number     VARCHAR(20);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS business_name       VARCHAR(200);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS registration_number VARCHAR(60);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS number_of_employees INT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS service_category    VARCHAR(100);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS sub_sector          VARCHAR(150);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS nature_of_business  VARCHAR(150);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS business_field      VARCHAR(150);

-- ---------- Login / register ----------

CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    full_name     VARCHAR(150) NOT NULL,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_tokens (
    token_hash CHAR(64)  PRIMARY KEY,
    user_id    INT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Starting data (same lists as the dashboard) ----------
-- Each value is only added if it is not there yet.

INSERT INTO districts (district_name)
SELECT v.name FROM (VALUES ('Galle'), ('Matara'), ('Hambantota')) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM districts d WHERE LOWER(d.district_name) = LOWER(v.name));

INSERT INTO divisional_secretary_divisions (dsd_name, district_id)
SELECT v.dsd, d.district_id
FROM (VALUES
    ('Galle', 'Akmeemana'),
    ('Galle', 'Ambalangoda'),
    ('Galle', 'Baddegama'),
    ('Galle', 'Balapitiya'),
    ('Galle', 'Benthota'),
    ('Galle', 'Bope-Poddala'),
    ('Galle', 'Elpitiya'),
    ('Galle', 'Galle Four Gravets'),
    ('Galle', 'Gonapinuwala'),
    ('Galle', 'Habaraduwa'),
    ('Galle', 'Hikkaduwa'),
    ('Galle', 'Imaduwa'),
    ('Galle', 'Karandeniya'),
    ('Galle', 'Nagoda'),
    ('Galle', 'Neluwa'),
    ('Galle', 'Niyagama'),
    ('Galle', 'Thawalama'),
    ('Galle', 'Welivitiya-Divithura'),
    ('Galle', 'Yakkalamulla'),
    ('Matara', 'Akuressa'),
    ('Matara', 'Athuraliya'),
    ('Matara', 'Devinuwara'),
    ('Matara', 'Dickwella'),
    ('Matara', 'Hakmana'),
    ('Matara', 'Kamburupitiya'),
    ('Matara', 'Kirinda Puhulwella'),
    ('Matara', 'Kotapola'),
    ('Matara', 'Malimbada'),
    ('Matara', 'Matara'),
    ('Matara', 'Mulatiyana'),
    ('Matara', 'Pasgoda'),
    ('Matara', 'Pitabeddara'),
    ('Matara', 'Thihagoda'),
    ('Matara', 'Weligama'),
    ('Matara', 'Welipitiya'),
    ('Hambantota', 'Ambalantota'),
    ('Hambantota', 'Angunakolapelessa'),
    ('Hambantota', 'Beliatta'),
    ('Hambantota', 'Hambantota'),
    ('Hambantota', 'Katuwana'),
    ('Hambantota', 'Lunugamwehera'),
    ('Hambantota', 'Okewela'),
    ('Hambantota', 'Sooriyawewa'),
    ('Hambantota', 'Tangalle'),
    ('Hambantota', 'Tissamaharama'),
    ('Hambantota', 'Walasmulla'),
    ('Hambantota', 'Weeraketiya')
) AS v(district, dsd)
JOIN districts d ON LOWER(d.district_name) = LOWER(v.district)
WHERE NOT EXISTS (
    SELECT 1 FROM divisional_secretary_divisions x
    WHERE LOWER(x.dsd_name) = LOWER(v.dsd) AND x.district_id = d.district_id
);

INSERT INTO service_divisions (service_division_name)
SELECT v.name FROM (VALUES
    ('Export'), ('Self-employment'), ('Micro'), ('Small-scale'), ('Large-scale'), ('Certified Trainees')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM service_divisions s WHERE LOWER(s.service_division_name) = LOWER(v.name));

INSERT INTO business_natures (business_nature_name)
SELECT v.name FROM (VALUES
    ('Wood & Handicrafts'), ('Food & Beverages'), ('Apparel & Textiles'), ('Agro-based Products'),
    ('Clay & Ceramics'), ('Metal & Machinery'), ('Health & Beauty'), ('IT & Services')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM business_natures b WHERE LOWER(b.business_nature_name) = LOWER(v.name));
