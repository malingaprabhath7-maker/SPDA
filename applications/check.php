<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../database.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed"
    ]);
    exit;
}

try {

    $sql = "
        SELECT
            a.application_id,
            a.applicant_name,
            a.nic,
            a.contact_number,
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

            a.service_provision_id,
            a.business_registration_date,
            a.application_date,
            a.status,
            a.remarks

        FROM applications a

        LEFT JOIN districts d
            ON a.district_id = d.district_id

        LEFT JOIN divisional_secretary_divisions dsd
            ON a.dsd_id = dsd.dsd_id

        LEFT JOIN business_natures bn
            ON a.business_nature_id = bn.business_nature_id

        LEFT JOIN service_divisions sd
            ON a.service_division_id = sd.service_division_id

        ORDER BY a.application_id DESC
    ";

    $stmt = $pdo->query($sql);

    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $applications
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch applications",
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}