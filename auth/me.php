<?php
/* POST { token } -> returns the logged-in user, or 401 if the login has expired */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();

try {
    $user = findUserByToken($pdo, $data["token"] ?? "");
    if (!$user) {
        respond(401, ["success" => false, "message" => "Please log in again"]);
    }
    $user["user_id"] = (int)$user["user_id"];
    respond(200, ["success" => true, "user" => $user]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Could not check the login", "error" => $e->getMessage()]);
}
