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

var canvas;
var c;
var objs = new Array();
var vars = {};

var state;
var stateTime;
var nbStates = 0;
var States = {};

var medias = {};

var interval;

//--- Vars Manager ------------------------------------------------------------
function addVar(name, value) {
   vars[name] = value;
}

function removeVar(name) {
   delete vars[name];
}
//-----------------------------------------------------------------------------

//--- States Manager ----------------------------------------------------------
function addState(str) {
   States[str] = nbStates += 1;
}

function switchState(str, callback) {
   //console.log("State: "+str);
   animations = 0;
   finished = 0;
   animationsComplete = function() {};
   eval("if (typeof "+state+"_end == 'function') "+state+"_end();");
   state = str;
   stateTime = new Date();
   eval("if (typeof "+state+"_init == 'function') "+state+"_init();");
}

function dt() {
   return new Date() - stateTime;
}
//-----------------------------------------------------------------------------

var frameTime = Date.now();
var fw = {
   fps: 30,
   tick: function() { return (Date.now() - frameTime); },
   main: function(canvasId, fps, width, height, scale, lloader) {
      this.fps = fps;
      window.addEventListener("load", function() {
         canvas = document.getElementById(canvasId);
         canvas.width = width;
         canvas.height = height;
         c = canvas.getContext("2d");
         new lloader();
      }, false);
   },


   update: function() {
      eval("if (typeof "+state+"_update == 'function') "+state+"_update();");

      for (var i in objs)
         objs[i].update();

      frameTime = Date.now();
   },


   paint: function() {
      c.clearRect(0, 0, canvas.width, canvas.height);

      if (typeof pre_paint == 'function') pre_paint();

      eval("if (typeof "+state+"_paint == 'function') "+state+"_paint();");

      for (var i in objs)
         objs[i].paint();

      eval("if (typeof "+state+"_post_paint == 'function') "+state+"_post_paint();");

      if (typeof post_paint == 'function') post_paint();
   },


   cycle: function() {
      fw.update();
      fw.paint();
   },


   copy: function(object) {
      if (!object || typeof(object) != 'object' || object instanceof fw.Class) {
         return object;
      } else if (object instanceof Array) {
         var c = [];
         for (var i=0, l=object.length; i<l; i++) {
            c[i] = fw.copy(object[i]);
         }
         return c;
      } else {
         var c = {};
         for (var i in object) {
            c[i] = fw.copy(object[i]);
         }
         return c;
      }
   }
};

window.fw.Class = function() {};
window.fw.Class.extend = function(prop) {
   var parent = this.prototype;
   initializing = true;
   var prototype = new this();
   initializing = false;
   for (var name in prop) {
      if (typeof(prop[name]) == "function" && typeof(parent[name]) == "function") {
         prototype[name] = (function(name, fn) {
            return function() {
               var tmp = this.parent;
               this.parent = parent[name];
               var ret = fn.apply(this, arguments);
               this.parent = tmp;
               return ret;
            };
         })(name, prop[name])
      } else {
         prototype[name] = prop[name];
      }
   }
   function Class() {
      if (!initializing) {
         if (this.staticInstantiate) {
            var obj = this.staticInstantiate.apply(this, arguments);
            if (obj) { return obj; }
         }
         for (p in this) {
            this[p] = fw.copy(this[p]);
         }
         if (this.init) {
            this.init.apply(this, arguments);
         }
      }
      return this;
   }
   Class.prototype = prototype;
   Class.constructor = Class;
   Class.extend = arguments.callee;
   return Class;
};

window.fw.Loader = fw.Class.extend({
   init: function() {
      this.load();
   },
   draw: function() {
   },
   load: function() {
      var t = this;
      loaded = 0;
      total = 0;
      if (this.files.length == 0) { this.endd(); return; }
      for (var i in this.files) {
         if (typeof(this.files[i]) != "string") continue;
         var name = this.files[i].substring(0, this.files[i].indexOf("."));
         var extension = this.files[i].substring(this.files[i].indexOf(".")+1, this.files[i].length);
         total++;
         var fn = this.files[i];
         switch (extension) {
            case "jpg":
            case "png":
               medias[i] = new Image();
               medias[i].src = fn;
               medias[i].onload = function() {
                  loaded++;
                  if (loaded == total)
                     t.endd();
               };
               break;
            case "ogg":
            case "wav":
               medias[i] = new Audio();
               medias[i].src = fn;
               medias[i].load();
               loaded++;
               if (loaded == total)
                  t.endd();
               break;
         }
      }
   },
   endd: function() {
      interval = setInterval(fw.cycle, 1000/fw.fps);
      this.end();
   },
   end: function() {
      console.log("END");
   }
});
