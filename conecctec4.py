import pygame
import numpy as np
import sys
import math

# Configurações do jogo
ROWS, COLS = 7, 8
SQUARESIZE = 100
RADIUS = SQUARESIZE // 2 - 5
plyDepth = 2
aiAlgorithm = "minimax"
stateCache = {}

# Cores
BLUE = (0, 0, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)

# Inicializa o Pygame
pygame.init()

# Tamanho da janela
width = COLS * SQUARESIZE
height = (ROWS + 1) * SQUARESIZE
size = (width, height)
screen = pygame.display.set_mode(size)
pygame.display.set_caption("Connect 4 com IA")

# Funções de lógica do jogo

def create_board():
    return np.zeros((ROWS, COLS))

def is_valid_location(board, col):
    return board[ROWS - 1][col] == 0

def get_next_open_row(board, col):
    for r in range(ROWS):
        if board[r][col] == 0:
            return r

def drop_piece(board, row, col, piece):
    board[row][col] = piece

def check_victory(board, piece):
    # Verificar todas as condições de vitória (horizontal, vertical, diagonal)
    for c in range(COLS - 3):
        for r in range(ROWS):
            if board[r][c] == piece and board[r][c+1] == piece and board[r][c+2] == piece and board[r][c+3] == piece:
                return True
    for c in range(COLS):
        for r in range(ROWS - 3):
            if board[r][c] == piece and board[r+1][c] == piece and board[r+2][c] == piece and board[r+3][c] == piece:
                return True
    for c in range(COLS - 3):
        for r in range(ROWS - 3):
            if board[r][c] == piece and board[r+1][c+1] == piece and board[r+2][c+2] == piece and board[r+3][c+3] == piece:
                return True
    for c in range(COLS - 3):
        for r in range(3, ROWS):
            if board[r][c] == piece and board[r-1][c+1] == piece and board[r-2][c+2] == piece and board[r-3][c+3] == piece:
                return True
    return False

def evaluate_board(board):
    # Avaliar o tabuleiro para pontuar peças em sequência
    score = 0
    # Avaliação aqui pode ser detalhada com pesos específicos para configurações
    return score

def is_terminal_node(board):
    return check_victory(board, 1) or check_victory(board, -1) or len(get_valid_locations(board)) == 0

def minimax(board, depth, maximizingPlayer):
    valid_locations = get_valid_locations(board)
    is_terminal = is_terminal_node(board)
    if depth == 0 or is_terminal:
        if is_terminal:
            if check_victory(board, -1):
                return (None, 100000000000000)
            elif check_victory(board, 1):
                return (None, -10000000000000)
            else:
                return (None, 0)
        else:
            return (None, evaluate_board(board))
    if maximizingPlayer:
        value = -math.inf
        column = np.random.choice(valid_locations)
        for col in valid_locations:
            row = get_next_open_row(board, col)
            temp_board = board.copy()
            drop_piece(temp_board, row, col, -1)
            new_score = minimax(temp_board, depth-1, False)[1]
            if new_score > value:
                value = new_score
                column = col
        return column, value
    else:
        value = math.inf
        column = np.random.choice(valid_locations)
        for col in valid_locations:
            row = get_next_open_row(board, col)
            temp_board = board.copy()
            drop_piece(temp_board, row, col, 1)
            new_score = minimax(temp_board, depth-1, True)[1]
            if new_score < value:
                value = new_score
                column = col
        return column, value

def get_valid_locations(board):
    valid_locations = []
    for col in range(COLS):
        if is_valid_location(board, col):
            valid_locations.append(col)
    return valid_locations

# Funções de exibição do jogo

def draw_board(board):
    for c in range(COLS):
        for r in range(ROWS):
            pygame.draw.rect(screen, BLUE, (c*SQUARESIZE, (r+1)*SQUARESIZE, SQUARESIZE, SQUARESIZE))
            pygame.draw.circle(screen, BLACK, (c*SQUARESIZE + SQUARESIZE//2, (r+1)*SQUARESIZE + SQUARESIZE//2), RADIUS)
    for c in range(COLS):
        for r in range(ROWS):
            if board[r][c] == 1:
                pygame.draw.circle(screen, RED, (c*SQUARESIZE + SQUARESIZE//2, height - (r+1)*SQUARESIZE + SQUARESIZE//2), RADIUS)
            elif board[r][c] == -1:
                pygame.draw.circle(screen, YELLOW, (c*SQUARESIZE + SQUARESIZE//2, height - (r+1)*SQUARESIZE + SQUARESIZE//2), RADIUS)
    pygame.display.update()

# Função principal do jogo

def play_game():
    board = create_board()
    game_over = False
    turn = 0

    draw_board(board)
    pygame.display.update()

    while not game_over:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()

            if event.type == pygame.MOUSEMOTION:
                pygame.draw.rect(screen, BLACK, (0, 0, width, SQUARESIZE))
                posx = event.pos[0]
                if turn == 0:
                    pygame.draw.circle(screen, RED, (posx, SQUARESIZE//2), RADIUS)
                pygame.display.update()

            if event.type == pygame.MOUSEBUTTONDOWN:
                pygame.draw.rect(screen, BLACK, (0, 0, width, SQUARESIZE))

                # Jogada do jogador 1
                if turn == 0:
                    posx = event.pos[0]
                    col = posx // SQUARESIZE

                    if is_valid_location(board, col):
                        row = get_next_open_row(board, col)
                        drop_piece(board, row, col, 1)

                        if check_victory(board, 1):
                            print("Jogador Vermelho Vence!")
                            game_over = True

                # Jogada do jogador 2 (IA)
                else:
                    col, minimax_score = minimax(board, plyDepth, True)
                    if is_valid_location(board, col):
                        row = get_next_open_row(board, col)
                        drop_piece(board, row, col, -1)

                        if check_victory(board, -1):
                            print("IA Amarelo Vence!")
                            game_over = True

                draw_board(board)
                turn += 1
                turn %= 2

                if game_over:
                    pygame.time.wait(3000)

play_game()
