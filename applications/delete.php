<?php
/* POST { id } -> deletes an application */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();
$applicationId = (int)($data["id"] ?? 0);

if ($applicationId <= 0) {
    respond(422, ["success" => false, "message" => "Record ID is required"]);
}

try {
    $stmt = $pdo->prepare("DELETE FROM applications WHERE application_id = :application_id");
    $stmt->execute([":application_id" => $applicationId]);

    if ($stmt->rowCount() === 0) {
        respond(404, ["success" => false, "message" => "Record not found"]);
    }

    respond(200, ["success" => true, "message" => "Application deleted successfully"]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Failed to delete application", "error" => $e->getMessage()]);
}
