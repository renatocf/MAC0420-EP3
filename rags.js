

function rag_function(pontosControle, desvio, t, nos, fOUa) {
	var g = [];
	var G = [];
	var ponto = [];
	var n = pontosControle.length;
	var soma = 0;

	G = gaussian(desvio, nos, t, n, fOUa);

	for (var i = 0; i < n; i++) {
		soma = soma + G[i];
	}

	for (var i = 0; i < n; i++) {
		g[i] = G[i] / soma;
	}

	ponto[0] = 0.0;
	ponto[1] = 0.0;
	ponto[2] = 0.0;
	ponto[3] = 1.0;	
	
	for(var i = 0; i < n; i++) {
		ponto[0] += g[i] * pontosControle[i][0];
		ponto[1] += g[i] * pontosControle[i][1];
		ponto[2] += g[i] * pontosControle[i][2];			
	}

	return ponto;	

}

function rag_points(pontosControle, desvio, subdivisoes, fOUa) {
	var nos = [];
 	var pontos = [];
 	var dist = 0;
 	var n = pontosControle.length;
 	var peso;

 	for (var i = 0; i < n-1; i++) {
 		dist = dist + distance(pontosControle[i], pontosControle[i+1]);
 	}

  	for (var i = 0; i < n; i++) {
 		nos.push(dist*i);
 	}

 	/*for (var i = 0; i < n; i++) {
 		nos.push(i/n);
 	}*/

 	/*for (var i = 0; i < n; i++) {
 		nos.push((dist*i)/n);
 	}*/

 	for (var i = 0; i <= subdivisoes; i++) {
		//var t = i/subdivisoes;
		var t = i;
		var p = rag_function(pontosControle, desvio, t, nos, fOUa);
		pontos.push(p);
	}

	console.log("Pontos RaG");
	console.log(pontos);
	return pontos;

}

// desvio = desvio padrao
// nos = vetor de nos
// n = quantidade de pontos de controle
// t = parametro da funcao
function gaussian(desvio, nos, t, n, fOUa) {
	var G = [];
	var soma = 0;

	var min = Math.ceil((-desvio) * Math.sqrt((-2) * Math.log(0.000001)));
	var max = Math.ceil(desvio * Math.sqrt((-2) * Math.log(0.000001)));

	if (fOUa == 'f') {
		// Não está funcionando essa curva fechada!!!
		console.log("CURVA FECHADA RAG");
		for (var i = 0; i < n; i++) {
			for (var j = min; j <= max; j++) {
				var aux1 = (t - (nos[i] + j)) * (t - (nos[i] + j));
				var aux2 = 2 * (desvio * desvio);
				soma = soma + Math.exp((-aux1) / aux2);
				}
			G[i] = soma;		
		}
	}
	else {
		console.log("CURVA ABERTA RAG");
		for (var i = 0; i < n; i++) {
			var aux1 = (t - nos[i]) * (t - nos[i]);
			var aux2 = 2 * (desvio * desvio);
			G[i] = Math.exp((-aux1) / aux2);
		}
	}

	return G;
}


function distance(p1, p2) {
	var dx = p1[0] - p2[0];
	var dy = p1[1] - p2[1];

	var dist = Math.sqrt(dx*dx + dy*dy);

	return dist;
} 