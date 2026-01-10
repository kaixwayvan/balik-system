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

if (!$identifier) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Identifier required']);
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
    // Don't reveal which identifiers exist — but for dev we'll return success with message
    echo json_encode(['success' => true, 'message' => 'If an account exists for that identifier, a reset token has been sent.']);
    exit;
}

// Generate token and store
$token = bin2hex(random_bytes(16));
$expires = time() + 3600; // 1 hour

$resetEntry = [
    'identifier' => $identifier,
    'token' => $token,
    'expires' => $expires,
    'created_at' => date('c')
];

$resets_file = __DIR__ . '/password_resets.json';
$resets = [];
if (file_exists($resets_file)) {
    $resets = json_decode(file_get_contents($resets_file), true) ?: [];
}
$resets[] = $resetEntry;
file_put_contents($resets_file, json_encode($resets, JSON_PRETTY_PRINT));

// In production you would email the token; in dev return token for testing
echo json_encode(['success' => true, 'message' => 'Reset token generated', 'token' => $token]);
