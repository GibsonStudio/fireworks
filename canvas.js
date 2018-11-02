/* ******** global canvas lib ******** */




function load_images (index)
{
	
	index = index || 0;
	
	//define img_objects?
	if (img_objects.length == 0) {
		
		for (var src in images) {
			
			var ref = {};
			ref.name = src;
			ref.file = images[src];
			ref.image = new Image();
			img_objects.push(ref);
			
		}
		
	}
	
	img_objects[index].image.onload = function ()
	{
			
		index++;
			
		if (index < img_objects.length) {
			load_images(index);
		} else {
			images_loaded();
		}
			
	}
		
	img_objects[index].image.src = img_objects[index].file; 
		
}





function get_image_index (name)
{

	for (var i = 0; i < img_objects.length; i++) {
		
		if (img_objects[i].name == name) {
			return i;
		}
		
	}
	
	return 0;
	
}










function clear_canvas (args)
{
	
	args 		= args || {};
	canvas_id	= args['canvas_id'] || 'my_canvas';
	canvas		= args['canvas'] || document.getElementById(canvas_id);
	context 	= args['context'] || canvas.getContext('2d');
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
}






function draw_line (sX, sY, dX, dY, args)
{

	args 		= args || {};
	canvas_id	= args['canvas_id'] || 'my_canvas';
	context 	= args['context'] || document.getElementById(canvas_id).getContext('2d');
	lineWidth 	= args['lineWidth'] || 1;
	strokeStyle = args['strokeStyle'] || '';
	lineCap 	= args['lineCap'] || 'butt'; //butt, round, square
	
	context.beginPath();		
	context.moveTo(sX, sY);
	context.lineTo(dX, dY);
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.lineCap = lineCap;
	context.stroke();

}





function draw_arc (oX, oY, radius, start_angle, end_angle, args)
{
	
	args = args || {};
	canvas_id	= args['canvas_id'] || 'my_canvas';
	context 	= args['context'] || document.getElementById(canvas_id).getContext('2d');
	lineWidth 	= args['lineWidth'] || 1;
	strokeStyle = args['strokeStyle'] || '';
	fillStyle	= args['fillStyle'] || '';
	lineCap 	= args['lineCap'] || 'butt'; //butt, round, square
	closePath	= args['closePath'] || false;
	
	//convert angles to radians
	start_angle = to_radians(start_angle);
	end_angle = to_radians(end_angle);
	
	context.beginPath();
	context.arc(oX, oY, radius, start_angle, end_angle, false);
	
	if (closePath) {
		context.closePath();
	}
	
	if (fillStyle != '') {
		context.fillStyle = fillStyle;
		context.fill();
	}
	
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.lineCap = lineCap;
	context.stroke();
	
}




function draw_curve (sX, sY, cp1X, cp1Y, cp2X, cp2Y, dX, dY, args)
{
	
	args = args || {};
	canvas_id	= args['canvas_id'] || 'my_canvas';
	context 	= args['context'] || document.getElementById(canvas_id).getContext('2d');
	lineWidth 	= args['lineWidth'] || 1;
	strokeStyle = args['strokeStyle'] || '';
	fillStyle	= args['fillStyle'] || '';
	closePath	= args['closePath'] || false;
	lineCap 	= args['lineCap'] || 'butt'; //butt, round, square
	
	context.beginPath();
	context.moveTo(sX, sY);
	context.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, dX, dY);
	
	if (closePath) {
		context.closePath();
	}
	
	if (fillStyle != '') {
		context.fillStyle = fillStyle;
		context.fill();
	}
	
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.lineCap = lineCap;
	context.stroke();
	
}




function draw_rect (sX, sY, width, height, args)
{
	
	args = args || {};
	canvas_id	= args['canvas_id'] || 'my_canvas';
	context 	= args['context'] || document.getElementById(canvas_id).getContext('2d');
	lineWidth 	= args['lineWidth'] || 1;
	strokeStyle = args['strokeStyle'] || '';
	fillStyle	= args['fillStyle'] || '';
	
	context.beginPath();
	context.rect(sX, sY, width, height);
	context.fillStyle = fillStyle;
	context.fill();
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.stroke();
	
}




function draw_circle (oX, oY, radius, args)
{
	
	args = args || {};
	canvas_id	= args['canvas_id'] || 'my_canvas';
	context 	= args['context'] || document.getElementById(canvas_id).getContext('2d');
	lineWidth 	= args['lineWidth'] || 0;
	strokeStyle = args['strokeStyle'] || '';
	fillStyle	= args['fillStyle'] || '';
	
	context.beginPath();
	context.arc(oX, oY, radius, 0, (2 * Math.PI), false);
	context.fillStyle = fillStyle;
	context.fill();
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.stroke();
	
}



