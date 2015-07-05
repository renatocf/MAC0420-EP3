/*
////////////////////////////////////////////////////////////////////////////////
-------------------------------------------------------------------------------
                                   B-SPLINE
-------------------------------------------------------------------------------
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

// Make subclass of Curve
BSpline.prototype = Object.create(Curve.prototype);

/**
 * B-Spline constructor
 * Class representing B-Spline curves
 * @param degree      Degree of B-spline polynomials
 * @param ctrlPoints  Vector of control points
 * @param closed      Boolean to indicate if curve is closed
 */
function BSpline(degree, ctrlPoints, closed) {
    Curve.call(this, ctrlPoints, closed);
    this.degree = degree;

    if (this.closed) {
        this.ctrlPoints.push(ctrlPoints[0]);
        this.ctrlPoints.push(ctrlPoints[1]);
    }

    this.knots = [];
    for (var i = 0; i <= this.degree + this.ctrlPoints.length; i++) {
        if (i < this.degree + 1)
            this.knots.push(0);
        else if (i < this.ctrlPoints.length - 1)
            this.knots.push(i/(this.ctrlPoints.length + this.degree));
        else
            this.knots.push(1);
    }

    if (this.closed) {
        for (var i = 0; i < 2 * this.degree + 4; i++)
            this.knots.push(this.knots[i]);
    }
}

/**
 * Generate weights to build curve points for control points
 * @param num_subdivisions Number of subdivisions to interpolate points
 * @return Array of values with weights for each curve interval
 */
BSpline.prototype.generateCtrlPointWeights = function(t) {
    var base = [];

    for (var i = 0; i < this.ctrlPoints.length; i++)
        base[i] = this.coxDeBoor(t, this.degree+1, i);

    return base;
}

/**
 * Cox-de Boor recurrence
 * @param t Parameter of the curve to be calculated
 * @param k Polynomial degree of iteration
 * @param i Interval for control point
 */
BSpline.prototype.coxDeBoor = function(t, k, i) {

    if (k == 1) {
        if (this.knots[i] <= t && t <= this.knots[i+1]) return 1;
        return 0;
    }

    var den1 = this.knots[i+k-1] - this.knots[i];
    var den2 = this.knots[i+k] - this.knots[i+1];
    var factor1 = 0;
    var factor2 = 0;

    if (den1 > 0)
        factor1 = ((t - this.knots[i]) / den1) * this.coxDeBoor(t, k-1, i);
    if (den2 > 0)
        factor2 = ((this.knots[i+k] - t) / den2) * this.coxDeBoor(t, k-1, i+1);

    return factor1 + factor2;
}
