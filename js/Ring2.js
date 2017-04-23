Ring = function()
{
	THREE.Object3D.call(this);

	this.height = 14;
	this.width = 12;
	this.thickness = 3;
	this.radialSegments = 128;
	this.tubularSegments = 32;
	this.flaten = 0;
	this.showFaces = true;
	this.showFaceMovement = true;
	this.mesh = null;
	this.material = null;
	this.extra = {};
	this.extra.mag = 0;
	this.extra.freq = 0;
	this.extra.clamp = false;
	this.extra.stride = 0;
	this.extra.flattenSides = 0.35;
	this.extra.flattenTop = 0.35;
	this.extra.flattenAngle = 0;
	this.extra.trueTubOrientation = false;
}
Ring.prototype = Object.create(THREE.Object3D.prototype);

Ring.prototype.init = function()
{
	this.updateGeometry(this);
}

Ring.prototype.updateGeometry = function(that)
{
	that.geo = that.RingGeometry(that.width, that.height, that.thickness, that.radialSegments, that.tubularSegments, Math.PI*2, that.extra);
	if (that.mesh != null) {
		that.remove(that.mesh);
	}
	that.mesh = new THREE.Mesh(that.geo, that.material?this.material:resMgr.materials.object);
	that.mesh.castShadow = true;
	that.mesh.receiveShadow = true;
	this.add(that.mesh);
}

Ring.prototype.RingGeometry = function(width, height, thickness, radialSegments, tubularSegments, arc, extra)
{
	var geo = new THREE.Geometry();

	width = width || 12;
	height = height || 14;
	thickness = thickness || 40;
	radialSegments = Math.floor( radialSegments ) || 8;
	tubularSegments = Math.floor( tubularSegments ) || 6;
	arc = arc || Math.PI * 2;

	var hby2 = (height+thickness)/2;
	var wby2 = (width+thickness)/2;
	var radAng = arc/radialSegments;
	var tubAng = Math.PI*2 / tubularSegments;
	//var radVec = new THREE.Vector3(0, radius, 0);
	var tubVec = new THREE.Vector3(0, thickness, 0);
	var strechVec = new THREE.Vector3(0,0,0);
	var zero = new THREE.Vector3(0,0,0);

	var time=0;

	for (var r=0; r<radialSegments; r++)
	{
		// oscillate radius
		var radOsc = extra.mag*(Math.sin(time));
		if (extra.clamp && radOsc<0) {
			radOsc=0;
		}
		time+=extra.freq*radAng;
		// var rad = radVec.clone().multiplyScalar(1+radOsc).applyAxisAngle(new THREE.Vector3(0, 0, 1), r*radAng); // rad for circle
		// var tub = tubVec.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), r*radAng);

		var rad = new THREE.Vector3(wby2*Math.cos(r*radAng+Math.PI/2), hby2*Math.sin(r*radAng+Math.PI/2), 0);
		var tub = rad.clone().normalize().multiplyScalar(thickness);
		// TODO: remove strech
		var strech = strechVec.clone().add(new THREE.Vector3(0, 0, extra.stride*Math.cos(r*radAng)));

		if (extra.trueTubOrientation) {
			var nextRadOsc = extra.mag*(Math.sin(time));
			if (extra.clamp && nextRadOsc<0) {
				nextRadOsc=0;
			}
			// var nextRad = radVec.clone().multiplyScalar(1+nextRadOsc).applyAxisAngle(new THREE.Vector3(0, 0, 1), (r+1)*radAng);  // rad for circle
			// var nextTub = tubVec.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), (r+1)*radAng);

			var nextRad = new THREE.Vector3(wby2*Math.cos((r+1)*radAng+Math.PI/2), hby2*Math.sin((r+1)*radAng+Math.PI/2), 0);
			var nextTub = nextRad.clone().normalize().multiplyScalar(thickness);

			// TODO: remove strech
			var nextStrech = strechVec.clone().add(new THREE.Vector3(0, 0, extra.stride*Math.cos((r+1)*radAng)));

			var rotAxis = nextStrech.add(nextRad).sub(nextTub).sub(strech.clone().add(rad).sub(tub)).normalize();
		}
		else {
			var rotAxis = rad.clone().normalize().applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
		}

		for (var t=0; t<tubularSegments; t++)
		{
			var tubShell = tub.clone().applyAxisAngle(rotAxis, t*tubAng);
			tubShell.x *= map(Math.abs(Math.sin(r*radAng)), 0, 1, 1, extra.flattenSides, true);
			tubShell.y *= map(Math.sin(r*radAng/2), 0, 1, extra.flattenTop, 1, true);
			tubShell.applyAxisAngle(new THREE.Vector3(1, 0, 0), extra.flattenAngle);


			var vert = rad.clone().add(tubShell);
			geo.vertices.push(new THREE.Vector3(vert.x, vert.y, vert.z));

			// set face indices (build two triangles in front of the vertex- next index in row,column, wraped around to 0)
			geo.faces.push(new THREE.Face3(((r+1)%radialSegments)*tubularSegments+((t+1)%tubularSegments),
											((r+1)%radialSegments)*tubularSegments+t,
											r*tubularSegments + t));
			geo.faces.push(new THREE.Face3(r*tubularSegments + t,
											r*tubularSegments+(t+1)%tubularSegments,
											((r+1)%radialSegments)*tubularSegments+((t+1)%tubularSegments)));
		}
	}

	geo.computeFaceNormals();
	geo.computeBoundingSphere();
	return geo;
}



Ring.prototype.update = function()
{
}

Ring.prototype.reset = function()
{
}


Ring.prototype.extrudeTriangles = function(geo)
{

	var faces = geo.faces;
	var vertices = geo.vertices;

	// create shape particles
	var index=0;
	for (var i=0; i<vertices.length; i++)
	{
		// if the same vertex was already added to a different particle get its index
		var vert = vertices[i];
		var added = false;
		for (var j=0; j<this.shapeParticles.length; j++) {
			if (equals(vert, this.shapeParticles[j].restPos)) {
				this.shapeParticles[j].addVertex(vert);
				added = true;
				//index = this.shapeParticles[j].index;
			}
		}
		if (!added) {
			var par = new ShapeParticle(vert, vert.clone().normalize(), index++);	// (restPos, direction, mapping index)
			par.addVertex(vert);
			this.shapeParticles.push(par);
		}
	}

	for (var i=0; i<faces.length; i++)
	{
		var geo = this.extrudeFace(i, faces, vertices);
		var mesh = new THREE.Mesh(geo, resMgr.materials.object);
		mesh.castShadow = true;
		this.add(mesh);
	}

	for (var i=0; i<this.extrusionFaces.length*3; i++)
	{
		mappingData[i] = 0;
	}

}

Ring.prototype.extrudeFace = function(index, faces, vertices)
{
	var geo = new THREE.Geometry();

	var face = faces[index];

	var basev1 = vertices[face.a];
	var basev2 = vertices[face.b];
	var basev3 = vertices[face.c];
	var normal = face.normal.clone();

	// if the same vertex was already added to a different particle get its index
	var index1=index*3;
	var index2=index*3+1;
	var index3=index*3+2;

	var extrudedFace = {};
	extrudedFace.v1 = basev1.clone();
	extrudedFace.v2 = basev2.clone();
	extrudedFace.v3 = basev3.clone();
	extrudedFace.normal = normal;
	extrudedFace.geo = geo;
	this.extrusionFaces[index] = extrudedFace;
	this.particles.push(new Particle(extrudedFace.v1, basev1, extrudedFace.normal, index*3));
	this.particles.push(new Particle(extrudedFace.v2, basev2, extrudedFace.normal, index*3+1));
	this.particles.push(new Particle(extrudedFace.v3, basev3, extrudedFace.normal, index*3+2));
	nParticles += 3;

	geo.vertices.push(basev1);
	geo.vertices.push(basev2);
	geo.vertices.push(basev3);
	geo.vertices.push(extrudedFace.v1);
	geo.vertices.push(extrudedFace.v2);
	geo.vertices.push(extrudedFace.v3);

	geo.faces.push(new THREE.Face3(0, 1, 2));

	geo.faces.push(new THREE.Face3(3, 2, 0));
	geo.faces.push(new THREE.Face3(2, 3, 5));

	geo.faces.push(new THREE.Face3(1, 5, 4));
	geo.faces.push(new THREE.Face3(1, 2, 5));

	geo.faces.push(new THREE.Face3(1, 4, 0));
	geo.faces.push(new THREE.Face3(0, 4, 3));

	geo.faces.push(new THREE.Face3(3, 4, 5));
	geo.computeFaceNormals();
	geo.dynamic = true;

	return geo;
}

Ring.prototype.makeIntoNeckless = function()
{
	var torusGeo = new THREE.TorusGeometry( radius, tube, segmentsR, segmentsT, arc );
}

Ring.prototype.getMax = function()
{
	//var max = new THREE.Vector3(0, 0, 0);
	var max = 0;

	for (var c=0; c<this.children.length; c++)
	{
		var child = this.children[c];
		var verts = child.geometry.vertices;
		for (var i=0; i<verts.length; i++)
		{
			if (Math.abs(verts[i].x) > max) {
				max = Math.abs(verts[i].x);
			}
			if (Math.abs(verts[i].y) > max) {
				max = Math.abs(verts[i].y);
			}
			if (Math.abs(verts[i].z) > max) {
				max = Math.abs(verts[i].z);
			}
		}

		// console.log(maxX);

		// return Math.max(max.x, max.y, max.z);
		return max;
	}
}

Ring.prototype.toggleFaces = function()
{
	this.showFaces = !this.showFaces;
	for (var i=1; i<this.children.length; i++)
	{
		this.children[i].visible = this.showFaces;
	}
}

Ring.prototype.toggleFaceMovement = function()
{
	this.showFaceMovement = !this.showFaceMovement;
}

function equals(v1, v2)
{
	if (Math.abs(v1.x - v2.x) < 0.001 &&
		Math.abs(v1.y - v2.y) < 0.001 &&
		Math.abs(v1.z - v2.z) < 0.001) {
		return true;
	}
	else {
		return false;
	}
}

var FLT_EPSILON = 0.0001

function map(value, inputMin, inputMax, outputMin, outputMax, clamp) {

	if (Math.abs(inputMin - inputMax) < FLT_EPSILON){
		return outputMin;
	} else {
		var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);

		if( clamp ){
			if(outputMax < outputMin){
				if( outVal < outputMax )outVal = outputMax;
				else if( outVal > outputMin )outVal = outputMin;
			}else{
				if( outVal > outputMax )outVal = outputMax;
				else if( outVal < outputMin )outVal = outputMin;
			}
		}
		return outVal;
	}

}


