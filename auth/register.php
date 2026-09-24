<?php
/* POST { full_name, username, password } -> creates a new user and logs them in */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();

$fullName = trim($data["full_name"] ?? "");
$username = strtolower(trim($data["username"] ?? ""));
$password = (string)($data["password"] ?? "");

if ($fullName === "" || mb_strlen($fullName) > 150) {
    respond(422, ["success" => false, "message" => "Please enter your full name"]);
}
if (!preg_match('/^[a-z0-9_.]{3,30}$/', $username)) {
    respond(422, ["success" => false, "message" => "Username must be 3-30 characters: letters, numbers, _ or ."]);
}
if (strlen($password) < 6) {
    respond(422, ["success" => false, "message" => "Password must be at least 6 characters"]);
}

try {
    $stmt = $pdo->prepare("SELECT 1 FROM users WHERE username = :u");
    $stmt->execute([":u" => $username]);
    if ($stmt->fetch()) {
        respond(409, ["success" => false, "message" => "This username is already taken"]);
    }

    $stmt = $pdo->prepare("
        INSERT INTO users (full_name, username, password_hash)
        VALUES (:name, :u, :hash)
        RETURNING user_id
    ");
    $stmt->execute([
        ":name" => $fullName,
        ":u"    => $username,
        ":hash" => password_hash($password, PASSWORD_DEFAULT)
    ]);
    $userId = (int)$stmt->fetchColumn();

    respond(201, [
        "success" => true,
        "message" => "Account created",
        "token"   => createToken($pdo, $userId),
        "user"    => ["user_id" => $userId, "full_name" => $fullName, "username" => $username]
    ]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Could not create the account", "error" => $e->getMessage()]);
}
