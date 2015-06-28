Objetivo
=========

Implemetar curvas B-splines e RaG para criar um software de modelagem geométrica
baseada na extrusão de formas bidimensionais.

Tarefas
=========

- 1º Canvas:
  - [ ] Desenhar curva fechada utilizando os pontos de controle escolhidos
        pelo usuário.
  - [ ] Adicionar pontos de controle (pequenos circulos ou quadrados)
        utilizando o mouse.
  - [ ] Permitir movimentação pontos de controle existentes.

- 2º Canvas:
  - [ ] Desenhar curva aberta utilizando os pontos de controle escolhidos
        pelo usuário.
  - [ ] Adicionar pontos de controle (pequenos circulos ou quadrados)
        utilizando o mouse.
  - [ ] Permitir movimentação pontos de controle existentes.

- 3º Canvas
  - [ ] Mostrar o resultado em 3D da estrusão das duas curvas, sendo
        a curva fechada a geradora e a curva aberta a de trajetória.
  - [ ] Implementar uma trackball para rotacionar o objeto.
  - [ ] Escalar o objeto de forma adequada, para caber no canvas.
  - [ ] Utilizar uma iluminação local que favoreça o 3D.

- Widget:
	- [ ] Obter o número de subdivisões.
	- [ ] Obter valor do desvio padrão (curvas RaG). 
	- [ ] Obter o grau do polinômio (curvas B-spline).
  - [ ] Opção para limpar os canvas (ex: botão).

Observações
=============

- Como dedicir qual curva usar? Precisamos de um botão ou mudamos 
  automaticamente pelos parâmetros recebidos?
- Quando mudar o tipo de curva, NÃO DEVEMOS apagar os pontos de controle
  existentes - só mudar as curvas e o objeto nos 3 canvas.
