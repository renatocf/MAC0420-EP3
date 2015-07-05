/*
////////////////////////////////////////////////////////////////////////////////
-------------------------------------------------------------------------------
                                      RAG
-------------------------------------------------------------------------------
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

// Make subclass of Curve
RaG.prototype = Object.create(Curve.prototype);

/**
 * RaG constructor
 * Class representing RaG curves
 * @param degree      Degree of B-spline polynomials
 * @param ctrlPoints  Vector of control points
 * @param closed      Boolean to indicate if curve is closed
 */
function RaG(std_deviation, ctrlPoints, closed) {
    Curve.call(this, ctrlPoints, closed);
    this.std_deviation = std_deviation / 10;

    this.ctrlPoints = [];
    for (var i = 0; i < ctrlPoints.length; i++) {
        this.ctrlPoints.push(ctrlPoints[i]);
    }

    var distance = 0;
    for (var i = 0; i < this.ctrlPoints.length-1; i++) {
        distance += this.distance(this.ctrlPoints[i], this.ctrlPoints[i+1]);
    }

    this.knots = [];
    for (var i = 0; i < this.ctrlPoints.length; i++) {
        this.knots.push(i/this.ctrlPoints.length);
    }
}

/**
 * Generate weights to build curve points for control points
 * @param num_subdivisions Number of subdivisions to interpolate points
 * @return Array of values with weights for each curve interval
 */
RaG.prototype.generateCtrlPointWeights = function(t) {

    var gaussian = this.gaussian(t);
    var normalized_gaussian = [];

    var sum = 0;
    for (var i = 0; i < this.ctrlPoints.length; i++)
        sum += gaussian[i];

    for (var i = 0; i < this.ctrlPoints.length; i++)
        normalized_gaussian[i] = gaussian[i]/sum;

    return normalized_gaussian;
}

/**
 * Gaussian function
 * @param p1 First point
 * @param p2 Second point
 * @return Distance between p1 and p2
 */
RaG.prototype.gaussian = function(t) {
    var gaussian = [];

    var min = Math.ceil(
        (-this.std_deviation) * Math.sqrt((-2) * Math.log(0.000001))
    );
    var max = Math.ceil(
        this.std_deviation * Math.sqrt((-2) * Math.log(0.000001))
    );

    if (this.closed) {
        for (var i = 0; i < this.ctrlPoints.length; i++) {
            gaussian[i] = 0;
            for (var j = min; j <= max; j++) {
                var aux1 = (t - (this.knots[i] + j)) * (t - (this.knots[i] + j));
                var aux2 = 2 * (this.std_deviation * this.std_deviation);
                gaussian[i] += Math.exp(-aux1/aux2);
            }
        }
    }
    else {
        for (var i = 0; i < this.ctrlPoints.length; i++) {
            var aux1 = (t - this.knots[i]) * (t - this.knots[i]);
            var aux2 = 2 * (this.std_deviation * this.std_deviation);
            gaussian[i] = Math.exp(-aux1/aux2);
        }
    }

    return gaussian;
}

/**
 * Distance between 2D points
 * @param p1 First point
 * @param p2 Second point
 * @return Distance between p1 and p2
 */
RaG.prototype.distance = function(p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];

    var dist = Math.sqrt(dx*dx + dy*dy);

    return dist;
}
