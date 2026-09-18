<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ]);
    exit;
}

try {

    $sql = "INSERT INTO applications (
                applicant_name,
                nic,
                contact_number,
                email,
                address,
                district_id,
                dsd_id,
                gn_id,
                business_nature_id,
                service_division_id,
                service_provision_id,
                business_registration_date,
                application_date,
                status,
                remarks
            )
            VALUES (
                :applicant_name,
                :nic,
                :contact_number,
                :email,
                :address,
                :district_id,
                :dsd_id,
                :gn_id,
                :business_nature_id,
                :service_division_id,
                :service_provision_id,
                :business_registration_date,
                CURRENT_TIMESTAMP,
                'Pending',
                :remarks
            )
            RETURNING application_id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":applicant_name" => $data["applicant_name"] ?? null,
        ":nic" => $data["nic"] ?? null,
        ":contact_number" => $data["contact_number"] ?? null,
        ":email" => $data["email"] ?? null,
        ":address" => $data["address"] ?? null,

        ":district_id" => $data["district_id"] ?? null,
        ":dsd_id" => $data["dsd_id"] ?? null,
        ":gn_id" => $data["gn_id"] ?? null,

        ":business_nature_id" => $data["business_nature_id"] ?? null,
        ":service_division_id" => $data["service_division_id"] ?? null,
        ":service_provision_id" => $data["service_provision_id"] ?? null,

        ":business_registration_date" =>
            $data["business_registration_date"] ?? null,

        ":remarks" => $data["remarks"] ?? null
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Application saved successfully",
        "application_id" => $result["application_id"]
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to save application",
        "error" => $e->getMessage()
    ]);
}