import "utils.js";
import "core.js";
import "handlers.js";
import "anim.js";

function pre_paint() {
   c.fillStyle = "#000";
   c.fillRect(0,0,canvas.width,canvas.height);
}

function post_paint() {
   c.strokeStyle = "#000";
   c.strokeRect(0.5,0.5,canvas.width-0.5,canvas.height-0.5);
}

function splash_init() {
   vars.objs = [];
   for (var i=0; i<10; i++) {
      var an = new Anim({x:rand(10, canvas.width-10), y:rand(10, canvas.height-10), width:5, height:5});
      an.direction = rand(0,2);
      console.log(an.direction);
      an.onPaint = function() {
         c.save();
         
         var g = c.createRadialGradient(this.x, this.y, 5, this.x, this.y, 5*3);
         g.addColorStop(0,"rgba(" + 113 + "," + 157 + "," + 34 + "," + 1 +")");
         g.addColorStop(1.0,"rgba(0,0,0,0)");
         c.fillStyle = g;

         c.beginPath();
         c.arc(this.x, this.y, 5*3, 0, Math.PI*2, false);
         c.closePath();
         c.fill();
         
         c.restore();
      };
      vars.objs.push(an);
   }
}

function splash_update() {
   for (var i=0; i<10; i++) {
      var tmp = vars.objs[i];
      if (tmp.direction == 0) {
        tmp.x += 3;
      } else {
        tmp.y += 3;
      }

      if (tmp.x > canvas.width + 5 || tmp.y > canvas.height + 5) {
         var d = rand(0, 2);
         tmp.direction = d;
         if (d == 0) {
           tmp.x = -3;
           tmp.y = rand(0, canvas.height);
         } else {
           tmp.y = -3;
           tmp.x = rand(0, canvas.width)
         }
      }
   }
}

var MyLoader = fw.Loader.extend({
   files: [],
   end: function() {
      switchState("splash");
      bindKeys();
      interval = setInterval(fw.cycle, 1000/30)
   }
});

fw.main("canvas", 30, 300, 500, 1, MyLoader);
