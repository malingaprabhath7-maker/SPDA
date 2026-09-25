<?php
/*
 * Shared code for the applications API (check / create / update / delete).
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../database.php";

/* Adds the dashboard's extra columns to the applications table the first time (safe to run every time) */
function ensureApplicationColumns($pdo)
{
    $pdo->exec("
        ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS whatsapp_number     VARCHAR(20),
            ADD COLUMN IF NOT EXISTS business_name       VARCHAR(200),
            ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
            ADD COLUMN IF NOT EXISTS number_of_employees INTEGER,
            ADD COLUMN IF NOT EXISTS service_category    VARCHAR(100),
            ADD COLUMN IF NOT EXISTS sub_sector          VARCHAR(150),
            ADD COLUMN IF NOT EXISTS nature_of_business  VARCHAR(150),
            ADD COLUMN IF NOT EXISTS business_field      VARCHAR(150)
    ");
}

try {
    ensureApplicationColumns($pdo);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not prepare the applications table",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* Send a JSON reply and stop */
function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/* Read the JSON body of a POST request */
function readJsonBody()
{
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        respond(405, ["success" => false, "message" => "Only POST requests are allowed"]);
    }
    $data = json_decode(file_get_contents("php://input"), true);
    if (!is_array($data)) {
        respond(400, ["success" => false, "message" => "Invalid JSON data"]);
    }
    return $data;
}

/* "ගාල්ල / Galle" -> ["ගාල්ල / Galle", "ගාල්ල", "Galle"] */
function nameCandidates($name)
{
    $list = [trim($name)];
    foreach (explode("/", $name) as $part) {
        $part = trim($part);
        if ($part !== "" && !in_array($part, $list, true)) {
            $list[] = $part;
        }
    }
    return $list;
}

/* Finds a row id by its name in a lookup table (null if not found).
   Also matches the English part of stored bilingual names like "<Sinhala> / Galle". */
function findIdByName($pdo, $table, $idCol, $nameCol, $name)
{
    if (trim((string)$name) === "") {
        return null;
    }
    $stmt = $pdo->prepare("
        SELECT $idCol FROM $table
        WHERE TRIM(LOWER($nameCol)) = TRIM(LOWER(:n))
           OR TRIM(LOWER(regexp_replace($nameCol, '^.*/', ''))) = TRIM(LOWER(:n2))
        ORDER BY $idCol ASC
        LIMIT 1
    ");
    foreach (nameCandidates($name) as $candidate) {
        $stmt->execute([":n" => $candidate, ":n2" => $candidate]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return (int)$row[$idCol];
        }
    }
    return null;
}

/*
 * Checks the form data from the dashboard and turns it into database values.
 * Stops with an error message if something required is missing or wrong.
 */
function applicationValues($pdo, $data)
{
    $text = function ($key) use ($data) {
        $value = trim((string)($data[$key] ?? ""));
        return $value === "" ? null : $value;
    };

    $name = $text("name");
    $districtName = $text("district");
    $dsdName = $text("dsDivision");

    if ($name === null) {
        respond(422, ["success" => false, "message" => "Name is required"]);
    }
    if ($districtName === null) {
        respond(422, ["success" => false, "message" => "District is required"]);
    }
    if ($dsdName === null) {
        respond(422, ["success" => false, "message" => "Divisional Secretary Division is required"]);
    }

    $districtId = findIdByName($pdo, "districts", "district_id", "district_name", $districtName);
    if ($districtId === null) {
        respond(422, ["success" => false, "message" => "District not found: " . $districtName]);
    }

    $stmt = $pdo->prepare("
        SELECT dsd_id FROM divisional_secretary_divisions
        WHERE TRIM(LOWER(dsd_name)) = TRIM(LOWER(:n)) AND district_id = :d
        ORDER BY dsd_id ASC
        LIMIT 1
    ");
    $dsdId = null;
    foreach (nameCandidates($dsdName) as $candidate) {
        $stmt->execute([":n" => $candidate, ":d" => $districtId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $dsdId = (int)$row["dsd_id"];
            break;
        }
    }
    if ($dsdId === null) {
        /* New DS Division from the dashboard list: add it to this district */
        $insert = $pdo->prepare("
            INSERT INTO divisional_secretary_divisions (dsd_name, district_id)
            VALUES (:n, :d)
            RETURNING dsd_id
        ");
        $insert->execute([":n" => trim($dsdName), ":d" => $districtId]);
        $dsdId = (int)$insert->fetchColumn();
    }

    $employees = $data["employees"] ?? null;
    $employees = is_numeric($employees) ? max(0, (int)$employees) : null;

    $regDate = $text("registrationDate") ?? $text("business_registration_date");

    return [
        ":applicant_name"             => $name,
        ":nic"                        => $text("nic"),
        ":contact_number"             => $text("phone"),
        ":whatsapp_number"            => $text("whatsapp"),
        ":email"                      => $text("email"),
        ":address"                    => $text("address"),
        ":district_id"                => $districtId,
        ":dsd_id"                     => $dsdId,
        ":gn_division"                => $text("gnDivision"),
        ":service_division_id"        => findIdByName($pdo, "service_divisions", "service_division_id", "service_division_name", $text("serviceCategory")),
        ":business_nature_id"         => findIdByName($pdo, "business_natures", "business_nature_id", "business_nature_name", $text("natureOfBusiness")),
        ":service_category"           => $text("serviceCategory"),
        ":sub_sector"                 => $text("subSector"),
        ":nature_of_business"         => $text("natureOfBusiness"),
        ":business_field"             => $text("businessField"),
        ":business_name"              => $text("businessName"),
        ":registration_number"        => $text("regNo"),
        ":number_of_employees"        => $employees,
        ":business_registration_date" => $regDate,
        ":remarks"                    => $text("remarks"),
    ];
}
