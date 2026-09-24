<?php
/*
 * Shared helpers for the login / register API (auth/*.php).
 * Every auth endpoint includes this file first.
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../database.php";

/* How long a login stays valid */
const TOKEN_LIFETIME_HOURS = 12;

/* Send a JSON reply and stop */
function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/* Only POST requests with a JSON body are accepted */
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

/* Creates the users / user_tokens tables the first time (safe to run every time) */
function ensureAuthTables($pdo)
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            user_id       SERIAL PRIMARY KEY,
            full_name     VARCHAR(150) NOT NULL,
            username      VARCHAR(50)  NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_tokens (
            token_hash CHAR(64)  PRIMARY KEY,
            user_id    INT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ");
}

/* Makes a new login token for a user and returns it (only its hash is stored) */
function createToken($pdo, $userId)
{
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("
        INSERT INTO user_tokens (token_hash, user_id, expires_at)
        VALUES (:hash, :uid, CURRENT_TIMESTAMP + (:hours || ' hours')::interval)
    ");
    $stmt->execute([
        ":hash"  => hash("sha256", $token),
        ":uid"   => $userId,
        ":hours" => (string)TOKEN_LIFETIME_HOURS
    ]);
    return $token;
}

/* Returns the logged-in user for a token, or null if the token is missing / expired */
function findUserByToken($pdo, $token)
{
    if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/', $token)) {
        return null;
    }
    $stmt = $pdo->prepare("
        SELECT u.user_id, u.full_name, u.username
        FROM user_tokens t
        JOIN users u ON u.user_id = t.user_id
        WHERE t.token_hash = :hash AND t.expires_at > CURRENT_TIMESTAMP
    ");
    $stmt->execute([":hash" => hash("sha256", $token)]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
}

try {
    ensureAuthTables($pdo);
} catch (PDOException $e) {
    respond(500, [
        "success" => false,
        "message" => "Could not prepare the users table",
        "error"   => $e->getMessage()
    ]);
}
