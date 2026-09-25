-- Extra columns the dashboard stores for each application.
-- applications/_common.php adds these automatically on first use,
-- but you can also run this file yourself in pgAdmin (SPDA_Database).

ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS whatsapp_number     VARCHAR(20),
    ADD COLUMN IF NOT EXISTS business_name       VARCHAR(200),
    ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS number_of_employees INTEGER,
    ADD COLUMN IF NOT EXISTS service_category    VARCHAR(100),
    ADD COLUMN IF NOT EXISTS sub_sector          VARCHAR(150),
    ADD COLUMN IF NOT EXISTS nature_of_business  VARCHAR(150),
    ADD COLUMN IF NOT EXISTS business_field      VARCHAR(150);
