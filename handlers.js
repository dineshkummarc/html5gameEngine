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

HTMLElement.prototype.onMouseOver = function(e) { };
HTMLElement.prototype.onMouseOut = function(e) { };
HTMLElement.prototype.onMouseMove = function(e) { };
HTMLElement.prototype.onClick = function(e) { };
HTMLElement.prototype.onMouseDown = function(e) { };
HTMLElement.prototype.onMouseUp = function(e) { };
HTMLElement.prototype.onKeyDown = function(e) { };
HTMLElement.prototype.onKeyUp = function(e) { };
HTMLElement.prototype.onDblClick = function(e) { };
HTMLElement.prototype.init = function() { };

function bindKeys() {
   var overEl = false;
   canvas.onmousemove = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            if (!overEl && !objs[i].mouseOver) {
               objs[i].onMouseOver(pos);
               objs[i].mouseOver = true;

               overEl = true;

            }
            objs[i].onMouseMove(pos);
         } else {
            if (objs[i].mouseOver) {
               objs[i].onMouseOut(pos);
               objs[i].mouseOver = false;
               overEl = false;
            }
         }
      }

      this.onMouseMove(pos);
   };

   canvas.onmouseout = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i in objs) {
         if (objs[i].mouseOver) {
            objs[i].onMouseOut(pos);
            objs[i].mouseOver = false;
         }
      }

      this.onMouseOut(pos);
   };

   canvas.onclick = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onClick(pos);
            break;
         }
      }

      this.onClick(pos);
   };

   canvas.ondblclick = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onDblClick(pos);
            break;
         }
      }

      this.onDblClick(pos);
   };

   canvas.onmousedown = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      pos.button = e.button;

      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onMouseDown(pos);
            break;
         }
      }

      this.onMouseDown(pos);
   };

   canvas.onmouseup = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onMouseUp(pos);
            break;
         }
      }

      this.onMouseUp(pos);
   };
}
