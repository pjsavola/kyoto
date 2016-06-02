<?php
  $fh = fopen("logs/out.log", 'a') or die('fail');
  $pc = $_POST['pc'];
  $pos = $_POST['pos'];
  $score = $_POST['score'];
  fwrite($fh, $pc);
  fwrite($fh, ",");
  fwrite($fh, $pos);
  fwrite($fh, ",");
  fwrite($fh, $score);
  fwrite($fh, ";\n");
  fclose($fh);
?>
