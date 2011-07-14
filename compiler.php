<?php
/*
Copyright (c) 2010, ALAIN GILBERT.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by ALAIN GILBERT.
4. Neither the name of the ALAIN GILBERT nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY ALAIN GILBERT ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL ALAIN GILBERT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
