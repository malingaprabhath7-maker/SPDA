<?php
/* POST { username, password } -> returns a login token */

require_once __DIR__ . "/_common.php";

$data = readJsonBody();

$username = strtolower(trim($data["username"] ?? ""));
$password = (string)($data["password"] ?? "");

if ($username === "" || $password === "") {
    respond(422, ["success" => false, "message" => "Please enter your username and password"]);
}

try {
    $stmt = $pdo->prepare("SELECT user_id, full_name, username, password_hash FROM users WHERE username = :u");
    $stmt->execute([":u" => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password_hash"])) {
        respond(401, ["success" => false, "message" => "Invalid username or password"]);
    }

    /* clean up old expired logins */
    $pdo->exec("DELETE FROM user_tokens WHERE expires_at < CURRENT_TIMESTAMP");

    respond(200, [
        "success" => true,
        "message" => "Logged in",
        "token"   => createToken($pdo, (int)$user["user_id"]),
        "user"    => [
            "user_id"   => (int)$user["user_id"],
            "full_name" => $user["full_name"],
            "username"  => $user["username"]
        ]
    ]);
} catch (PDOException $e) {
    respond(500, ["success" => false, "message" => "Login failed", "error" => $e->getMessage()]);
}
