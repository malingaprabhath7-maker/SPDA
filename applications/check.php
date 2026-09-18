<?php

require_once "../database.php";

$tables = [
    "districts",
    "divisional_secretary_divisions",
    "grama_niladhari_divisions",
    "business_natures",
    "service_divisions",
    "service_provisions"
];

foreach ($tables as $table) {

    echo "<h3>$table</h3>";

    $stmt = $pdo->query("SELECT * FROM $table");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<pre>";
    print_r($data);
    echo "</pre>";
}