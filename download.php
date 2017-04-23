<?php
session_start();
header('Content-Description: STL Zip File');
header("Content-Type: application/zip");
header('Content-Disposition: attachment; filename="splints.zip"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize("zips/".session_id().".zip"));
ob_end_clean();
readfile("zips/".session_id().".zip");
?>