<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../database.php";

/* "ගාල්ල / Galle" vage names -> ["ගාල්ල / Galle", "ගාල්ල", "Galle"] */
function nameCandidates($name) {
    $list = [trim($name)];
    foreach (explode("/", $name) as $part) {
        $part = trim($part);
        if ($part !== "" && !in_array($part, $list, true)) {
            $list[] = $part;
        }
    }
    return $list;
}

/* table ekaka name eken id eka hoyanawa (naththam null) */
function findIdByName($pdo, $table, $idCol, $nameCol, $name) {
    if ($name === "") {
        return null;
    }
    $stmt = $pdo->prepare("
        SELECT $idCol FROM $table
        WHERE TRIM(LOWER($nameCol)) = TRIM(LOWER(:n))
        ORDER BY $idCol ASC
        LIMIT 1
    ");
    foreach (nameCandidates($name) as $candidate) {
        $stmt->execute([":n" => $candidate]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return (int)$row[$idCol];
        }
    }
    return null;
}

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

    $serviceCategory = trim($data["serviceCategory"] ?? "");
    $natureOfBusiness = trim($data["natureOfBusiness"] ?? "");


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

    $districtId = findIdByName($pdo, "districts", "district_id", "district_name", $districtName);


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
       SERVICE DIVISION / BUSINESS NATURE (optional)
       ========================= */

    $serviceDivisionId = findIdByName($pdo, "service_divisions", "service_division_id", "service_division_name", $serviceCategory);
    $businessNatureId = findIdByName($pdo, "business_natures", "business_nature_id", "business_nature_name", $natureOfBusiness);

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
            service_division_id,
            business_nature_id,
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
            :service_division_id,
            :business_nature_id,
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

        ":service_division_id" =>
            $serviceDivisionId,

        ":business_nature_id" =>
            $businessNatureId,

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