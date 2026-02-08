<?php
// Allow requests from dev servers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$identifier = isset($data['identifier']) ? trim($data['identifier']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$identifier || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

$users_file = __DIR__ . '/users.json';
if (!file_exists($users_file)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'User store missing']);
    exit;
}

$users = json_decode(file_get_contents($users_file), true) ?: [];
$found = null;
foreach ($users as $u) {
    if ((isset($u['email']) && strtolower($u['email']) === strtolower($identifier)) || (isset($u['phone']) && $u['phone'] === $identifier)) {
        $found = $u;
        break;
    }
}

if (!$found) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

$stored = isset($found['password']) ? $found['password'] : '';
$ok = false;
if (strpos($stored, '$2y$') === 0 || strpos($stored, '$2a$') === 0) {
    $ok = password_verify($password, $stored);
} else {
    $ok = ($password === $stored);
}

if (!$ok) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

// Successful login: return user info (no password)
unset($found['password']);
echo json_encode(['success' => true, 'user' => $found]);
