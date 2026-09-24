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

$data = json_decode(file_get_contents("php://input"), true);
$applicationId = (int)($data["id"] ?? 0);

if ($applicationId <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Record ID is required"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    $stmt = $pdo->prepare("
        DELETE FROM applications
        WHERE application_id = :application_id
    ");

    $stmt->execute([
        ":application_id" => $applicationId
    ]);

    if ($stmt->rowCount() === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Record not found"
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Application deleted successfully"
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete application",
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
