
//canvas
var canvas = null;
var context = null;

//vars
var gravity = 0.1;
var y_origin = 360;
var x_min = 0;
var x_max = 700;
var bounce = true;
var autolaunch = false;
var launch_frequency = 0.05;
var element_fade = 0.02;

//fireworks
var fireworks = [];
var vx_min = -4;
var vx_max = 4;
var vy_min = 5;
var vy_max = 8;
var fuse_min = 30;
var fuse_max = 100;
var explode_below = 50;

//trails
var trails = [];
var trails_on = true;
var trail_gravity_on = true;
var trail_life = 30;
var trail_spread = 4;
var trail_gravity_factor = 0.2;

//fragments
var fragments = [];
var fragments_on = true;
var fragment_gravity_on = true;
var fragment_gravity_factor = 0.2;
var fragments_min = 20;
var fragments_max = 50;
var fragment_energy_max = 2;
var fragment_life = 60;
var fragment_decceleration = 0.99;


// audio engine
var launch1 = new Howl({ src:['fw_launch_1.mp3'] });
var launch2 = new Howl({ src:['fw_launch_2.mp3'] });
var launch3 = new Howl({ src:['fw_launch_3.mp3'] });
var launch4 = new Howl({ src:['fw_launch_4.mp3'] });
var launch5 = new Howl({ src:['fw_launch_5.mp3'] });

var explode1 = new Howl({ src: ['fw_explode_1.mp3'] });
var explode2 = new Howl({ src: ['fw_explode_2.mp3'] });
var explode3 = new Howl({ src: ['fw_explode_3.mp3'] });
var explode4 = new Howl({ src: ['fw_explode_4.mp3'] });


function ini_vars ()
{

	canvas = document.getElementById('my_canvas');
	context = canvas.getContext('2d');
	fireworks = [];
	trails = [];
	fragments = [];

	//ini sliders
	$('#launch_frequency').val(launch_frequency);
	$('#gravity').val(gravity);
	$('#trail_life').val(trail_life);
	$('#trail_spread').val(trail_spread);
	$('#element_fade').val(element_fade);
	$('#fragment_energy_max').val(fragment_energy_max);
	$('#fragments_max').val(fragments_max);

}



function debug (message) {

	var db = document.getElementById("debug");
	db.innerHTML += message + "<br />";
	db.scrollTop = db.scrollHeight;

}




function toggle_autolaunch ()
{

	autolaunch = !autolaunch;

	if (autolaunch) {

		$('#autolaunch_button').html('Autolaunch ON');

	} else {

		$('#autolaunch_button').html('Autolaunch OFF');

	}


}



function run_animation ()
{

	//update vars from sliders
	launch_frequency = $('#launch_frequency').val();
	gravity = $('#gravity').val();
	trail_life = $('#trail_life').val();
	trail_spread = $('#trail_spread').val();
	element_fade = $('#element_fade').val();
	fragment_energy_max = $('#fragment_energy_max').val();
	fragments_max = $('#fragments_max').val();

	if (autolaunch) {
		if (Math.random() < launch_frequency) {
			launch_firework();
		}
	}

	clear_canvas();
	update_fireworks();
	draw_fireworks();

	if (trails_on) {
		update_trails();
		draw_trails();
	}

	if (fragments_on) {
		update_fragments();
		draw_fragments();
	}

	//call next frame
	window.requestAnimationFrame(run_animation);

}





function launch_firework ()
{

	var f = {};
	f.x = x_min + (x_max - x_min) * Math.random();
	f.y = 0;
	f.vx = vx_min + (vx_max - vx_min) * Math.random();
	f.vy = vy_min + (vy_max - vy_min) * Math.random();
	f.fuse = fuse_min + (fuse_max - fuse_min) * Math.random(); //frames before exploding

	fireworks.push(f);

	var vol = 0.2 + (Math.random() * 0.8);
	playLaunch(vol);

}



function playLaunch (vol) {

	var vol = vol || 1;

	var whichExplosion = Math.floor(Math.random() * 5) + 1;

	if (whichExplosion == 1) {
		var me = launch1.play();
		launch1.volume(vol, me);
	} else if (whichExplosion == 2) {
		var me = launch2.play();
		launch2.volume(vol, me);
	} else if (whichExplosion == 3) {
		var me = launch3.play();
		launch3.volume(vol, me);
	} else if (whichExplosion == 4) {
		var me = launch4.play();
		launch4.volume(vol, me);
	} else {
		var me = launch5.play();
		launch5.volume(vol, me);
	}

}



function update_fireworks ()
{

	for (var i = 0; i < fireworks.length; i++) {

		var f = fireworks[i];
		f.x = f.x + f.vx;
		f.vy = f.vy - gravity;
		f.y = f.y + f.vy;
		f.fuse = f.fuse - 1;

		if (bounce) {
			if (f.x < x_min) {
				f.x = x_min + (x_min - f.x);
				f.vx = -f.vx;
			} else if (f.x > x_max) {
				f.x = x_max + (x_max - f.x);
				f.vx = -f.vx;
			}
		}

		if (f.fuse <= 0 || (f.vy < 0 && f.y < explode_below)) {

			fireworks.splice(i, 1);
			i = i - 1;
			explode_firework(f);

		} else {
			fireworks[i] = f;
		}

	}

}






function draw_fireworks ()
{

	for (var i = 0; i < fireworks.length; i++)
	{

		var f = fireworks[i];
		draw_circle(f.x, y_origin - f.y, 1.4, {lineWidth:0.01, fillStyle:'#ffffff'});
		if (trails_on) { add_trail(f); }

	}


}





function explode_firework (firework)
{

	if (fragments_on) {

		var fragment_count = fragments_min + (fragments_max - fragments_min) * Math.random();

		var vol = fragment_count / fragments_max;
		playExplode(vol);
		//var me = explode1.play();
		//explode1.volume(vol, me);

		for (var j = 0; j <= fragment_count; j++) {
			add_fragment(firework);
		}

	}

}




function playExplode (vol) {

	var vol = vol || 1;

	var whichExplosion = Math.floor(Math.random() * 5) + 1;

	if (whichExplosion == 1) {
		var me = explode1.play();
		explode1.volume(vol, me);
	} else if (whichExplosion == 2) {
		var me = explode2.play();
		explode2.volume(vol, me);
	} else if (whichExplosion == 3) {
		var me = explode3.play();
		explode3.volume(vol, me);
	} else {
		var me = explode4.play();
		explode4.volume(vol, me);
	}

}



function add_trail (firework)
{

	var t = {};
	t.life = trail_life;
	t.x = firework.x + (Math.random() * trail_spread) - (trail_spread / 2.0);
	t.y = firework.y + (Math.random() * trail_spread) - (trail_spread / 2.0);
	t.vy = 0;
	t.alpha = 0.9;
	trails.push(t);

}



function update_trails ()
{

	for (var i = 0; i < trails.length; i++) {

		var t = trails[i];
		if (trail_gravity_on) {
			t.vy = t.vy - (gravity * trail_gravity_factor);
			t.y = t.y + t.vy;
		}
		t.life = t.life - 1;
		t.alpha = t.alpha - element_fade;

		if (bounce) {
			if (t.x < x_min) {
				t.x = x_min + (x_min - t.x);
				t.vx = -t.vx;
			} else if (t.x > x_max) {
				t.x = x_max + (x_max - t.x);
				t.vx = -t.vx;
			}
		}

		if (t.life <= 0) {

			trails.splice(i, 1);
			i = i - 1;

		} else {
			trails[i] = t;
		}

	}

}


function draw_trails ()
{

	for (var i = 0; i < trails.length; i++)
	{

		var t = trails[i];
		draw_circle(t.x, y_origin - t.y, 0.8, {lineWidth:0.01, fillStyle:'rgba(255,236,150,' + t.alpha + ')'});

	}

}




function add_fragment (firework)
{

	var f = {};
	f.life = fragment_life;
	f.x = firework.x;
	f.y = firework.y;
	f.alpha = 1;

	var energy = fragment_energy_max - ((fragment_energy_max * Math.random()) / 2.0);
	var angle = Math.random() * 2 * Math.PI;

	f.vx = firework.vx + (energy * Math.sin(angle));
	f.vy = firework.vy + (energy * Math.cos(angle));

	fragments.push(f);

}







function update_fragments ()
{


	for (var i = 0; i < fragments.length; i++) {

		var f = fragments[i];

		if (fragment_gravity_on) {
			f.vy = f.vy - (gravity * fragment_gravity_factor);
		}

		f.vx = f.vx * fragment_decceleration;
		f.vy = f.vy * fragment_decceleration;
		f.life = f.life - 1;

		f.x = f.x + f.vx;
		f.y = f.y + f.vy;
		f.alpha = f.alpha - element_fade;

		if (bounce) {
			if (f.x < x_min) {
				f.x = x_min + (x_min - f.x);
				f.vx = -f.vx;
			} else if (f.x > x_max) {
				f.x = x_max + (x_max - f.x);
				f.vx = -f.vx;
			}
		}

		if (f.life <= 0) {

			fragments.splice(i, 1);
			i = i - 1;

		} else {
			fragments[i] = f;
		}

	}

}


function draw_fragments ()
{

	for (var i = 0; i < fragments.length; i++)
	{

		var f = fragments[i];
		draw_circle(f.x, y_origin - f.y, 0.8, {lineWidth:0.01, fillStyle:'rgba(255,255,255,' + f.alpha + ')'});

	}

}
