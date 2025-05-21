<?php
$host = "localhost";       // serveur MySQL
$dbname = "projet_web";    // nom de ta base de données
$username = "root";        // utilisateur (par défaut: root)
$password = "";            // mot de passe (souvent vide en local)

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit;
}
?>