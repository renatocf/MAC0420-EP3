/*
////////////////////////////////////////////////////////////////////////////////
-------------------------------------------------------------------------------
                                     CURVE
-------------------------------------------------------------------------------
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

/**
 * Curve constructor
 * Class representing B-Spline curves
 * @param degree           Degree of B-spline polynomials
 * @param ctrlPoints       Vector of control points
 * @param closed           Boolean to indicate if curve is closed
 */
function Curve(ctrlPoints, closed) {
    this.closed = closed;

    this.ctrlPoints = [];
    for (var i = 0; i < ctrlPoints.length; i++) {
        this.ctrlPoints.push(ctrlPoints[i]);
    }
}

/**
 * Generate interpolation of points in the curve
 * @param num_subdivisions Number of subdivisions applied in algorithm
 * @return Points interpolated in the curve
 */
Curve.prototype.generatePoints = function(num_subdivisions) {
    var points = [];

    for (var i = 0; i <= num_subdivisions; i++)
        points.push(this.generatePoint(i/num_subdivisions));

    return points;
}

/**
 * Generate single point in the curve
 * @param t Parameter of the curve to be calculated
 * @param num_subdivisions Number of subdivisions to interpolate points
 * @return Point in the curve
 */
Curve.prototype.generatePoint = function(t) {
    var point = vec4(0.0, 0.0, 0.0, 1.0);
    var weights = this.generateCtrlPointWeights(t);

    for (var i = 0; i < this.ctrlPoints.length; i++) {
        point[0] += weights[i] * this.ctrlPoints[i][0];
        point[1] += weights[i] * this.ctrlPoints[i][1];
        point[2] += weights[i] * this.ctrlPoints[i][2];
    }

    return point;
}
