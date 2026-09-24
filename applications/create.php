<?php
/* POST { name, district, dsDivision, ... } -> saves a new application */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();

try {
    $values = applicationValues($pdo, $data);

    $stmt = $pdo->prepare("
        INSERT INTO applications (
            applicant_name, nic, contact_number, whatsapp_number, email, address,
            district_id, dsd_id, gn_id, gn_division,
            service_division_id, business_nature_id,
            business_name, registration_number, number_of_employees,
            business_registration_date, application_date, status, remarks
        ) VALUES (
            :applicant_name, :nic, :contact_number, :whatsapp_number, :email, :address,
            :district_id, :dsd_id, NULL, :gn_division,
            :service_division_id, :business_nature_id,
            :business_name, :registration_number, :number_of_employees,
            :business_registration_date, CURRENT_TIMESTAMP, 'Pending', :remarks
        )
        RETURNING application_id
    ");
    $stmt->execute($values);

    respond(200, [
        "success" => true,
        "message" => "Application saved successfully",
        "application_id" => (int)$stmt->fetchColumn()
    ]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Failed to save application", "error" => $e->getMessage()]);
}
