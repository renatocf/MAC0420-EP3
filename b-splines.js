// n = quantidade de pontos de controle
// k = grau da b-spline
// nos vetor de nos
// t = segmento

function Cox_deBoor(k, t, i, nos) {

	if (k == 1) {
		if (nos[i] <= t && t <= nos[i+1]) {
			return 1.0;
		}
		return 0.0;
	}

	var den1 = nos[i+k-1] - nos[i];
	var den2 = nos[i+k] - nos[i+1];
	var fator1 = 0;
	var fator2 = 0;

	if (den1 > 0) {
		fator1 = ((t - nos[i]) / den1) * Cox_deBoor(k-1, t, i, nos);
	}
	if (den2 > 0) {
		fator2 = ((nos[i+k] - t) / den2) * Cox_deBoor(k-1, t, i+1, nos);
	}
	return fator1 + fator2;
}

function bspline_function(pontosControle, grau, t, nos) {
	var ponto = [];
	ponto[0] = 0.0;
	ponto[1] = 0.0;
	ponto[2] = 0.0;
	ponto[3] = 1.0;	
	
	for(var i = 0; i < pontosControle.length; i++) {
		var b = Cox_deBoor(grau+1, t, i, nos);
		ponto[0] += b * pontosControle[i][0];
		ponto[1] += b * pontosControle[i][1];
		ponto[2] += b * pontosControle[i][2];			
	}

	return ponto;	
}

function bspline_points (pontosControle, grau, subdivisoes, fOUa) {
 	var nos = [];
 	var pontos = [];
 	var pControle = pontosControle.slice();

 	var m; 

 	// Funcionou, a curva está fechada!!
 	if (fOUa == 'f') {
 		pControle.push(pontosControle[0]);
 		pControle.push(pontosControle[1]);
 	}

 	m = grau + pControle.length;

 	// cria o vetor de nos.
	for (var i = 0; i <= m; i++) {
		if (i < grau+1)
			nos.push(0);
		else if (i < m-grau-1) {
			//var aux = m - 2*grau - 1;
			nos.push(i/m);
		}
		else
			nos.push(1); 			
	}
	
	// Funcionou a curva está fechada!
	if (fOUa == 'f') {
		console.log("CURVA FECHADA!!");
		for (var i = 0; i < 2*grau+4; i++)
			nos.push(nos[i]);
	}



	for (var i = 0; i <= subdivisoes; i++) {
		var t = i/subdivisoes;
		var p = bspline_function(pControle, grau, t, nos);
		pontos.push(p);
	}

	return pontos;
 } 