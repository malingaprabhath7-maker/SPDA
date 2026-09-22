<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../database.php";

/* =========================
   HANDLE OPTIONS REQUEST
   ========================= */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

/* =========================
   ONLY POST ALLOWED
   ========================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

/* =========================
   READ JSON DATA
   ========================= */

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    /* =========================
       GET FORM DATA
       ========================= */

    $name = trim($data["name"] ?? "");
    $nic = trim($data["nic"] ?? "");
    $phone = trim($data["phone"] ?? "");
    $email = trim($data["email"] ?? "");
    $address = trim($data["address"] ?? "");

    $districtName = trim($data["district"] ?? "");
    $dsdName = trim($data["dsDivision"] ?? "");
    $gnDivision = trim($data["gnDivision"] ?? "");

    $businessRegistrationDate =
        !empty($data["registrationDate"])
            ? $data["registrationDate"]
            : (
                !empty($data["business_registration_date"])
                    ? $data["business_registration_date"]
                    : null
            );

    $remarks = trim($data["remarks"] ?? "");


    /* =========================
       VALIDATE REQUIRED FIELDS
       ========================= */

    if ($name === "") {

        echo json_encode([
            "success" => false,
            "message" => "Name is required"
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    if ($districtName === "") {

        echo json_encode([
            "success" => false,
            "message" => "District is required"
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    if ($dsdName === "") {

        echo json_encode([
            "success" => false,
            "message" => "Divisional Secretary Division is required"
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    /* =========================
       FIND DISTRICT ID
       ========================= */

    $districtId = null;

    $stmt = $pdo->prepare("
        SELECT district_id
        FROM districts
        WHERE TRIM(LOWER(district_name))
              = TRIM(LOWER(:district_name))
        ORDER BY district_id ASC
        LIMIT 1
    ");

    $stmt->execute([
        ":district_name" => $districtName
    ]);

    $district = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($district) {

        $districtId = (int)$district["district_id"];
    }


    /* =========================
       DISTRICT NOT FOUND
       ========================= */

    if ($districtId === null) {

        echo json_encode([
            "success" => false,
            "message" => "District not found: " . $districtName
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


   /* =========================
   FIND DSD ID
   ========================= */

$dsdId = null;

$stmt = $pdo->prepare("
    SELECT dsd_id, dsd_name, district_id
    FROM divisional_secretary_divisions
    WHERE TRIM(dsd_name) = TRIM(:dsd_name)
    ORDER BY dsd_id ASC
    LIMIT 1
");

$stmt->execute([
    ":dsd_name" => $dsdName
]);

$dsd = $stmt->fetch(PDO::FETCH_ASSOC);

if ($dsd) {

    /* Check whether DSD belongs to selected district */
    if ((int)$dsd["district_id"] === (int)$districtId) {

        $dsdId = (int)$dsd["dsd_id"];

    } else {

        echo json_encode([
            "success" => false,
            "message" => "DSD belongs to a different district",
            "dsd_name" => $dsdName,
            "dsd_district_id" => $dsd["district_id"],
            "selected_district_id" => $districtId
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}


/* =========================
   DSD NOT FOUND
   ========================= */

if ($dsdId === null) {

    echo json_encode([
        "success" => false,
        "message" => "Divisional Secretary Division not found: " . $dsdName
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

    /* =========================
       INSERT APPLICATION
       ========================= */

    $sql = "
        INSERT INTO applications (
            applicant_name,
            nic,
            contact_number,
            email,
            address,
            district_id,
            dsd_id,
            gn_id,
            gn_division,
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
            NULL,
            :gn_division,
            :business_registration_date,
            CURRENT_TIMESTAMP,
            'Pending',
            :remarks
        )
        RETURNING application_id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([

        ":applicant_name" =>
            $name !== "" ? $name : null,

        ":nic" =>
            $nic !== "" ? $nic : null,

        ":contact_number" =>
            $phone !== "" ? $phone : null,

        ":email" =>
            $email !== "" ? $email : null,

        ":address" =>
            $address !== "" ? $address : null,

        ":district_id" =>
            $districtId,

        ":dsd_id" =>
            $dsdId,

        ":gn_division" =>
            $gnDivision !== "" ? $gnDivision : null,

        ":business_registration_date" =>
            $businessRegistrationDate,

        ":remarks" =>
            $remarks !== "" ? $remarks : null
    ]);


    /* =========================
       GET NEW APPLICATION ID
       ========================= */

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $applicationId = $result["application_id"] ?? null;


    /* =========================
       SUCCESS RESPONSE
       ========================= */

    echo json_encode([
        "success" => true,
        "message" => "Application saved successfully",
        "application_id" => $applicationId
    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to save application",
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}