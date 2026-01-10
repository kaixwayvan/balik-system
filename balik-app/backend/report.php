<?php
// Allow requests from the Vite dev server during development
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // restrict this in production
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

header('Content-Type: application/json');

// Reply to preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$uploads_dir = __DIR__ . '/uploads';
if (!is_dir($uploads_dir)) mkdir($uploads_dir, 0755, true);

$reports_file = __DIR__ . '/reports.json';

$report = [];
$fields = ['mode','itemType','category','brand','color','dateFound','location','time','additionalInfo','whereTurned','anonymous','fullName','email','phone','phoneCountry','fullPhone'];
foreach ($fields as $f) {
    $report[$f] = isset($_POST[$f]) ? $_POST[$f] : '';
}

$report['anonymous'] = ($report['anonymous'] === 'true' || $report['anonymous'] === '1');
$report['timestamp'] = date('c');

// Handle uploaded image if present
if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
    $tmp = $_FILES['imageFile']['tmp_name'];
    $name = basename($_FILES['imageFile']['name']);
    $ext = pathinfo($name, PATHINFO_EXTENSION);
    $safeName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', pathinfo($name, PATHINFO_FILENAME));
    $newName = $safeName . '_' . time() . '.' . $ext;
    $dest = $uploads_dir . '/' . $newName;
    if (move_uploaded_file($tmp, $dest)) {
        $report['imagePath'] = 'backend/uploads/' . $newName;
    } else {
        $report['imageError'] = 'Failed to move uploaded file';
    }
}

$reports = [];
if (file_exists($reports_file)) {
    $content = file_get_contents($reports_file);
    $reports = json_decode($content, true) ?: [];
}

$reports[] = $report;
file_put_contents($reports_file, json_encode($reports, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'report' => $report]);
