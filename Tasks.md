Objetivo: Implemetar curvas B-splines e RaG para criar um software de modelagem geométrica baseada na extrusão de formas bidimensionais.

Canvas:
	Criar 3 canvas:
	1o canvas: será desenhado uma curva fechada utilizando os pontos de controle escolhidos pelo usuário.
	2o canvas: será desenhado uma curva aberta utilizando os pontos de controle escolhidos pelo usuário.
	3o canvas: mostra o resultado em 3D da estrusão das duas curvas, onde a curva fechada é a geradora e a curva aberta é a trajetória.
	

Requisitos:
	Utilizando o mouse deve ser possível adicionar pontos de controle e movimentar os pontos existentes, no 1o e 2o canvas. Desenhar os pontos como pequenos circulos ou quadrados.
	
	Algum modo de limpar os canvas, por exemplo um botão.
	
Widget:
	Obter o número de subdivisões
	Para curvas RaG obter valor do desvio padrão
	Para curvas B-spline obter o grau do polinômio.
	Obs: não sei se precisa de um botão para decidir que curva é para usar, ou isso é decidido pelos parametros recebidos?
	Quando mudar o tipo de curva, não apagar os pontos de controle existentes, só mudar as curvas e o objeto nos 3 canvas.
	

3o canvas:
	Implementar uma trackball para rotacionar o objeto.
	Escalar o objeto de forma adequada, para caber no canvas.
	Utilizar uma iluminação local que favoreça o 3D.
	
	 
		
