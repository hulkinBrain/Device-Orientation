let degtorad = Math.PI / 180; // Degree-to-Radian conversion

function getBaseRotationMatrix( alpha, beta, gamma ) {
	let _x = beta  ? beta  * degtorad : 0; // beta value
	let _y = gamma ? gamma * degtorad : 0; // gamma value
	let _z = alpha ? alpha * degtorad : 0; // alpha value

	let cX = Math.cos( _x );
	let cY = Math.cos( _y );
	let cZ = Math.cos( _z );
	let sX = Math.sin( _x );
	let sY = Math.sin( _y );
	let sZ = Math.sin( _z );

	//
	// ZXY-ordered rotation matrix construction.
	//

	let m11 = cZ * cY - sZ * sX * sY;
	let m12 = - cX * sZ;
	let m13 = cY * sZ * sX + cZ * sY;

	let m21 = cY * sZ + cZ * sX * sY;
	let m22 = cZ * cX;
	let m23 = sZ * sY - cZ * cY * sX;

	let m31 = - cX * sY;
	let m32 = sX;
	let m33 = cX * cY;

	return [
		m11,    m12,    m13,
		m21,    m22,    m23,
		m31,    m32,    m33
	];
}

function getScreenTransformationMatrix( screenOrientation ) {
	let orientationAngle = screenOrientation ? screenOrientation * degtorad : 0;

	let cA = Math.cos( orientationAngle );
	let sA = Math.sin( orientationAngle );

	// Construct our screen transformation matrix
	let r_s = [
		cA,    -sA,    0,
		sA,    cA,     0,
		0,     0,      1
	];

	return r_s;
}

function getWorldTransformationMatrix() {
	let x = 90 * degtorad;

	let cA = Math.cos( x );
	let sA = Math.sin( x );

	// Construct our world transformation matrix
	let r_w = [
		1,     0,    0,
		0,     cA,   -sA,
		0,     sA,   cA
	];

	return r_w;
}

function matrixMultiply( a, b ) {
	let final = [];

	final[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
	final[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
	final[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

	final[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
	final[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
	final[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

	final[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
	final[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
	final[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

	return final;
}

function computeMatrix() {
	let rotationMatrix = getBaseRotationMatrix(
		deviceOrientationData.alpha,
		deviceOrientationData.beta,
		deviceOrientationData.gamma
	); // R

	let screenTransform = getScreenTransformationMatrix( currentScreenOrientation ); // r_s

	let screenAdjustedMatrix = matrixMultiply( rotationMatrix, screenTransform ); // R_s

	let worldTransform = getWorldTransformationMatrix(); // r_w

	let finalMatrix = matrixMultiply( screenAdjustedMatrix, worldTransform ); // R_w

	return finalMatrix; // [ m11, m12, m13, m21, m22, m23, m31, m32, m33 ]
}