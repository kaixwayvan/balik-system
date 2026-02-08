<?php
// Simple mock endpoint for Google OAuth login during development
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
$token = isset($data['access_token']) ? $data['access_token'] : '';

if (!$token) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing access_token']);
    exit;
}

// In a real app you'd verify the token with Google. Here we mock a user.
$mockUser = [
    'id' => 'google_'.substr(md5($token),0,8),
    'name' => 'Google User',
    'email' => 'google.user@example.com'
];

echo json_encode(['success' => true, 'user' => $mockUser]);
