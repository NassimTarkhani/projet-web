<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['email'], $data['password'], $data['role'])) {
    echo json_encode(["status" => "error", "message" => "Champs manquants"]);
    exit();
}

$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->execute([
    $data['name'],
    $data['email'],
    $hashedPassword,
    $data['role']
]);

echo json_encode(["status" => "success"]);
?>