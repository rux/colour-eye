
var coldata;
var maxcol=ntc.shade.length;
function rgb2hsl(r, g, b){
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	if(max == min){
		h = s = 0;
// achromatic
	} else{
		var d = max - min;
		s = l >0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
		case r: h = (g - b) / d + (g < b ? 6 : 0);
			break;
		case g: h = (b - r) / d + 2;
			break;
		case b: h = (r - g) / d + 4;
			break;
		}
		h /= 6;
	}
	return [h, s, l];
}

function dec2hex(d) {
	var n1 = d&15;
	var n2 = (d&240)>>4;
	return n2.toString(16)+n1.toString(16);
}

function rgb2html(r, g, b) {
	return '#'+dec2hex(r)+dec2hex(g)+dec2hex(b);
}

function hsl2int(h, s, l) {
	var decColor = Math.floor(l*127) | ( Math.floor(s*127) << 7) | ( Math.floor(h*1023) << 14);
	return decColor;
}

function cmpLength(a,b) {
	return (b.length-a.length);
}

function calcColours(data) {
	var i;
	delete(coldata);
	coldata=new Array();
	for (i=0;
				i<maxcol;
				i++) {
		coldata[i]=new Array();
	}
	for (i=0;
				i<data.length;
				i+=4) {
		var colour = rgb2html(data[i], data[i+1], data[i+2]);
		var hsl=rgb2hsl(data[i], data[i+1], data[i+2]);
		var n_match = ntc.name(colour);
		var d={
			"pixel":i, "colour":n_match, "hsl": hsl
		};
		coldata[ntc.shade.indexOf(n_match[3])].push(d);
	}
	coldata.sort(cmpLength);
}
function detectColour(place, data) {
	var maxhue=256;
	var maxsat=256;
	var maxlum=256;
	var i,j,r,g,b;
	var colplace=coldata[place];
	var hsldata= new Array();
	var sldata= new Array();
	var ldata= new Array();
	for (i=0;
	i<maxhue;
	i++) {
		hsldata[i]=new Array();
	}
	for (i=0;
		i<maxsat;
		i++) {
		sldata[i]=new Array();
	}
	for (i=0;
	i<maxlum;
	i++) {
		ldata[i]=new Array();
	}
	for (i=0;
	i<colplace.length;
	i++) {
		j=colplace[i];
		var hsl=j.hsl;
		var hue=Math.floor(hsl[0]*(maxhue-1));
		hsldata[hue].push(i);
	}
	hsldata.sort(cmpLength);
	for (i=0;
	i<hsldata[0].length;
	i++) {
		j=colplace[hsldata[0][i]];
		var hsl=j.hsl;
		var sat=Math.floor(hsl[1]*(maxsat-1));
		sldata[sat].push(i);
	}
	sldata.sort(cmpLength);
	for (i=0;
	i<sldata[0].length;
	i++) {
		var j=colplace[sldata[0][i]];
		var hsl=j.hsl;
		var lum=Math.floor(hsl[2]*(maxlum-1));
		ldata[lum].push(i);
	}
	ldata.sort(cmpLength);
	var result=colplace[ldata[0][0]];
	return result;
}




function draw(freshimage) {
	var orig = document.getElementById('canvas');
	var ctx = orig.getContext('2d');
	var img = new Image();
	img.onload = function(){
		ctx.clearRect(0,0,orig.width,orig.height);
		ctx.drawImage(img, 0,0, orig.width, orig.height);
		var pix;
		var colour;
		var n_match;
		var hsl;
		var imgd = ctx.getImageData(0, 0, orig.width, orig.height);
		var data=imgd.data;
		calcColours(data);
		for (i=0;
		((i<maxcol) && (coldata[i].length>0));
		i++) {
			pix =detectColour(i, data);
			var perc=Math.round(Math.floor(coldata[i].length/(data.length/4000))/10);
			colour = rgb2html(data[pix.pixel], data[pix.pixel+1], data[pix.pixel+2]);
			n_match = pix.colour;
			hsl=pix.hsl;
			prefix = "";
			sat = ntc.saturation[1];
			if (hsl[1]<0.1) {
				sat=ntc.saturation[2];
				prefix=sat+' ';
			} else if (hsl[1]>0.5) {
				sat=ntc.saturation[0];
				prefix=sat+' ';
			}
			lum = ntc.luminance[1];
			if (hsl[2]<0.3) {
				lum= ntc.luminance[2];
				prefix=prefix+lum+' ';
			} else if (hsl[2]>0.7) {
				lum= ntc.luminance[0];
				prefix=prefix+lum+' ';
			}
			if (i==0) {
				document.getElementById('col').innerHTML="The camera sees \n";
				//return focus to containing div
				document.getElementById('col').focus();

				document.getElementById('swatches').innerHTML = "";
				 // document.bgColor = colour;
				document.getElementById('width').value=img.width;
				document.getElementById('height').value=img.height;
				document.getElementById('red').value=data[pix.pixel];
				document.getElementById('green').value=data[pix.pixel+1];
				document.getElementById('blue').value=data[pix.pixel+2];
				document.getElementById('bgcolor').value=colour;
				document.getElementById('sat').value=sat;
				document.getElementById('lum').value=lum;
			}


			if (perc > 1) {
				// this is the double description
				// document.getElementById('col').innerHTML+= "<div>" + perc + "% "+prefix + n_match[3].toLowerCase() +' - '+ n_match[1]+"</div>";

				// This is the swifter (more efficient) description
				//document.getElementById('col').innerHTML+= "<div>" + perc + "% "+ n_match[1]+"</div>";
				document.getElementById('col').innerHTML+= perc + "% "+ n_match[1]+".\n";
				document.getElementById('swatches').innerHTML += '<div style="height:'+ perc/9 + 'em; background-color:'+ n_match[0] +'">&nbsp;</div>';
			}
		}
		delete img;
	}
	img.src = freshimage.src;
}



