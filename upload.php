<?php
session_start();
if (isset($_FILES['data'])) {
  move_uploaded_file(
    $_FILES['data']['tmp_name'],
    "splint-models/".$_POST['fname']
  );

  $zip = new ZipArchive();
  $filename = "./zips/".session_id().".zip";

  if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
      exit("cannot open <$filename>\n");
  }

  $zip->addFile("splint-models/".$_POST['fname']);
  $zip->close();
}
?>