<?php
/* POST { id, name, district, dsDivision, ... } -> updates an existing application */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();
$applicationId = (int)($data["id"] ?? 0);

if ($applicationId <= 0) {
    respond(422, ["success" => false, "message" => "Record ID is required"]);
}

try {
    $values = applicationValues($pdo, $data);
    $values[":application_id"] = $applicationId;

    $stmt = $pdo->prepare("
        UPDATE applications SET
            applicant_name             = :applicant_name,
            nic                        = :nic,
            contact_number             = :contact_number,
            whatsapp_number            = :whatsapp_number,
            email                      = :email,
            address                    = :address,
            district_id                = :district_id,
            dsd_id                     = :dsd_id,
            gn_division                = :gn_division,
            service_division_id        = :service_division_id,
            business_nature_id         = :business_nature_id,
            service_category           = :service_category,
            sub_sector                 = :sub_sector,
            nature_of_business         = :nature_of_business,
            business_field             = :business_field,
            business_name              = :business_name,
            registration_number        = :registration_number,
            number_of_employees        = :number_of_employees,
            business_registration_date = COALESCE(:business_registration_date, business_registration_date),
            remarks                    = COALESCE(:remarks, remarks)
        WHERE application_id = :application_id
    ");
    $stmt->execute($values);

    if ($stmt->rowCount() === 0) {
        respond(404, ["success" => false, "message" => "Record not found"]);
    }

    respond(200, ["success" => true, "message" => "Application updated successfully"]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Failed to update application", "error" => $e->getMessage()]);
}
