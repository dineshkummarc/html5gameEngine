import "utils.js";
import "core.js";
import "handlers.js";
import "anim.js";

var star;

function post_paint() {
   c.strokeRect(0, 0, canvas.width, canvas.height);
}

function test_init() {
   console.log('Test init');
}

function splash_init() {
   console.log('Splash init');
   star = new Anim({'x':0, 'y':0, 'width':128, 'height':128, 'img':medias[0]});
   star.animate({'to':new Point(500, 200), 'effect':'bounce', 'duration':1.5}, function() {
      switchState('test');
   });
}

function splash_update() {
   console.log('Splash update');
}

function splash_end() {
   console.log('Splash end');
}

var MyLoader = fw.Loader.extend({
   files: ['star.png'],
   end: function() {
      switchState("splash");
      bindKeys();
      interval = setInterval(fw.cycle, 1000/30)
   }
});

fw.main("canvas", 30, 800, 400, 1, MyLoader);
