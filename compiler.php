<?php
$main = $argv[1];
extract(pathinfo($main));
$content = file_get_contents($main);
function callback($matches) {
   $content = file_get_contents($matches[1]);
   $content = preg_replace("#//(.*?)\n#", "", $content);
   //$content = preg_replace("#(\s{2,})#", " ", $content);
   //$content = preg_replace("#\n#", " ", $content);
   $content .= "\n";
   $content = "// $matches[1]\n" . $content . "\n";
   return $content;
}
$content = preg_replace("#//(.*?)\n#", "", $content);
//$content = preg_replace("#(\s{2,})#", " ", $content);
//$content = preg_replace("#\n#", " ", $content);
$content = preg_replace_callback("#import \"([a-zA-Z0-9-_/\.]+\.js)\";#", "callback", $content);
file_put_contents(sprintf("%s/%s", $dirname, 'compile.js'), $content);
