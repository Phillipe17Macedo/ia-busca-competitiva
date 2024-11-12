
# Connect 4 com IA - Algoritmos Minimax e Poda Alfa-Beta

Este projeto é uma implementação do jogo **Connect 4** utilizando Inteligência Artificial com algoritmos de **Minimax** e **Poda Alfa-Beta**. O objetivo é demonstrar o uso de algoritmos de busca competitiva em um ambiente de jogo de tabuleiro, onde dois agentes competem para otimizar seus próprios resultados.

## Descrição do Projeto

O jogo Connect 4 foi desenvolvido para permitir partidas entre **homem vs. máquina**, onde a máquina utiliza IA para decidir suas jogadas, aplicando diferentes níveis de profundidade de busca (conhecidos como *ply*). Através da interface, o usuário pode escolher o nível de dificuldade e o algoritmo que a IA usará para buscar a melhor jogada.

### Regras do Jogo

- O tabuleiro é uma matriz de 7 linhas por 8 colunas.
- Os jogadores alternam turnos para inserir peças na coluna desejada.
- O objetivo é alinhar 4 peças consecutivas em qualquer direção (horizontal, vertical ou diagonal).
- O jogo termina quando um dos jogadores vence ou o tabuleiro fica cheio, resultando em empate.

## Algoritmos Utilizados

### Minimax

O **Minimax** é um algoritmo de busca que explora todas as possibilidades de jogadas, assumindo que o oponente também jogará da melhor forma. Esse algoritmo constrói uma árvore de busca e, através de uma função de avaliação, determina a melhor sequência de jogadas para maximizar o resultado para o jogador.

- **Profundidade de busca (ply)**: A profundidade determina quantos movimentos à frente o algoritmo considerará.
- **Função de avaliação**: Avalia a qualidade de um estado do jogo para ajudar o algoritmo a escolher as melhores jogadas.
  
### Poda Alfa-Beta

A **Poda Alfa-Beta** é uma otimização do Minimax que evita explorar ramos desnecessários da árvore de busca, poupando tempo de processamento sem afetar a decisão final.

- **Poda de ramos**: A poda ocorre sempre que uma subárvore é considerada irrelevante para o resultado, permitindo ao algoritmo ignorá-la.
- **Limites Alfa e Beta**: Usados para controlar a poda durante a busca, acelerando o processo.

## Funcionalidades

- **Interface gráfica** intuitiva para o jogo Connect 4.
- Escolha do nível de dificuldade (*ply* entre 1 e 4).
- Opção para selecionar o algoritmo de busca:
  - Minimax
  - Poda Alfa-Beta
- **Medição de tempo de execução** dos algoritmos para cada jogada.
- **Contadores de vitória** para ambos os jogadores, com reinício automático ao alcançar 3 vitórias.

## Estrutura do Projeto

- `index.html`: Tela inicial e configuração do jogo.
- `tabuleiro.html`: Tabuleiro e interface de jogo.
- `style.css`: Estilos e layout.
- `script.js`: Lógica do jogo e implementação dos algoritmos de IA.
- `assets`: Sons e outros recursos visuais.

## Como Executar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/Phillipe17Macedo/ia-busca-competitiva.git
   cd ia-busca-competitiva
   ```

2. Abra o arquivo `index.html` em um navegador para iniciar o jogo.

3. Escolha o algoritmo e a dificuldade desejada, e comece a jogar!

## Resultados Esperados

Ao comparar os algoritmos, espera-se que:

- **Minimax** apresente aumento exponencial no tempo de execução com o aumento da profundidade (*ply*).
- **Poda Alfa-Beta** apresente tempos de execução menores em profundidades maiores, devido à poda de ramos desnecessários.

Esses resultados devem mostrar a eficiência da Poda Alfa-Beta em relação ao Minimax, especialmente em profundidades de busca maiores.

## Avaliação

### Critérios de Avaliação

1. **Interface gráfica e usabilidade** (5 pontos)
2. **Implementação do Minimax** (9 pontos)
3. **Implementação da Poda Alfa-Beta** (9 pontos)
4. **Discussão e análise dos algoritmos** (7 pontos)

## Conclusão

Este projeto explora a aplicação de algoritmos de busca competitiva em jogos. Ele fornece uma visão prática sobre o uso de IA em jogos e a importância de otimizações como a Poda Alfa-Beta para lidar com grandes espaços de busca.

## Autor

**Phillipe17Macedo** - [GitHub](https://github.com/Phillipe17Macedo)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

*Este projeto foi desenvolvido como parte de um trabalho acadêmico sobre algoritmos de busca competitiva no jogo Connect 4.*
