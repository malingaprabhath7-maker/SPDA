<?php
/* GET -> list of all applications for the dashboard */

require_once __DIR__ . "/_common.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    respond(405, ["success" => false, "message" => "Only GET requests are allowed"]);
}

try {
    $stmt = $pdo->query("
        SELECT
            a.application_id,
            a.applicant_name,
            a.nic,
            a.contact_number,
            a.whatsapp_number,
            a.email,
            a.address,
            a.district_id,
            d.district_name,
            a.dsd_id,
            dsd.dsd_name,
            a.gn_division,
            a.business_nature_id,
            bn.business_nature_name,
            a.service_division_id,
            sd.service_division_name,
            a.business_name,
            a.registration_number,
            a.number_of_employees,
            a.service_provision_id,
            a.business_registration_date,
            a.application_date,
            a.status,
            a.remarks
        FROM applications a
        LEFT JOIN districts d ON a.district_id = d.district_id
        LEFT JOIN divisional_secretary_divisions dsd ON a.dsd_id = dsd.dsd_id
        LEFT JOIN business_natures bn ON a.business_nature_id = bn.business_nature_id
        LEFT JOIN service_divisions sd ON a.service_division_id = sd.service_division_id
        ORDER BY a.application_id DESC
    ");

    respond(200, ["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Failed to fetch applications", "error" => $e->getMessage()]);
}
