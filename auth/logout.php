<?php
/* POST { token } -> ends that login */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();
$token = $data["token"] ?? "";

try {
    if (is_string($token) && $token !== "") {
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE token_hash = :hash");
        $stmt->execute([":hash" => hash("sha256", $token)]);
    }
    respond(200, ["success" => true, "message" => "Logged out"]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Logout failed", "error" => $e->getMessage()]);
}
