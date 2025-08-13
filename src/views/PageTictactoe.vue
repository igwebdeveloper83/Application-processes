<template>
  <div class="page-wrapper">
    <div class="game-box">
      <h2>Tic Tac Toe</h2>

      <div class="opponent-select">
        Gegner wählen:
        <Dropdown
          v-model="opponent"
          :options="opponents"
          optionLabel="label"
          optionValue="value"
          placeholder="Bitte wählen"
          @change="resetGame"
          class="w-50 m-2"
        />
      </div>

      <div class="error">{{ errorMessage }}</div>

      <div class="board">
        <div v-for="(cell, i) in board" :key="i" class="cell" @click="makeMove(i)">
          {{ cell }}
        </div>
      </div>

      <div class="buttons">
        <Button
          icon="pi pi-undo"
          label="Zurück"
          @click="undo"
          :disabled="!history.length"
          class="p-button-warning"
        />
        <Button icon="pi pi-refresh" label="Neustart" @click="resetGame" class="p-button-success" />
      </div>

      <div v-if="gameResult" class="info">
        Spiel beendet! Gewinner: {{ gameResult || '\u00A0' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

const opponent = ref('')
const board = ref(Array(9).fill(''))
const currentPlayer = ref('X')
const gameOver = ref(false)
const winner = ref('')
const errorMessage = ref('')
const history = ref([])

const opponents = [
  { label: 'Mensch', value: 'human' },
  { label: 'Computer', value: 'computer' }
]

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const gameResult = computed(() => {
  if (!gameOver.value) return ''
  return winner.value === '' ? 'Unentschieden' : winner.value
})

function checkWinner(bd) {
  for (const [a, b, c] of wins) {
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a]
  }
  return bd.includes('') ? '' : 'draw'
}

function saveHistory() {
  history.value.push([...board.value])
}

function makeMove(i) {
  if (!opponent.value) {
    errorMessage.value = 'Bitte Gegner auswählen!'
    return
  }
  if (gameOver.value || board.value[i]) return

  errorMessage.value = ''
  saveHistory()
  board.value[i] = currentPlayer.value

  const res = checkWinner(board.value)
  if (res) {
    gameOver.value = true
    winner.value = res === 'draw' ? '' : res
    return
  }

  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

  if (opponent.value === 'computer' && currentPlayer.value === 'O') {
    setTimeout(computerMove, 300)
  }
}

function findWinningMove(player) {
  for (const [a, b, c] of wins) {
    const line = [board.value[a], board.value[b], board.value[c]]
    if (line.filter((v) => v === player).length === 2 && line.includes('')) {
      return [a, b, c][line.indexOf('')]
    }
  }
  return -1
}

function computerMove() {
  if (gameOver.value) return
  saveHistory()

  let move = -1

  if (Math.random() < 0.1) {
    const empties = board.value.map((v, i) => (v === '' ? i : -1)).filter((i) => i !== -1)
    move = empties[Math.floor(Math.random() * empties.length)]
  } else {
    move = findWinningMove('O')
    if (move === -1) move = findWinningMove('X')
    if (move === -1) {
      const empties = board.value.map((v, i) => (v === '' ? i : -1)).filter((i) => i !== -1)
      move = empties[Math.floor(Math.random() * empties.length)]
    }
  }

  board.value[move] = 'O'

  const res = checkWinner(board.value)
  if (res) {
    gameOver.value = true
    winner.value = res === 'draw' ? '' : res
    return
  }

  currentPlayer.value = 'X'
}

function undo() {
  if (!history.value.length) return

  gameOver.value = false
  winner.value = ''
  board.value = history.value.pop()
  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
  errorMessage.value = ''
}

function resetGame() {
  board.value.fill('')
  currentPlayer.value = 'X'
  gameOver.value = false
  winner.value = ''
  errorMessage.value = ''
  history.value = []
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  padding: 20px;
}

.game-box {
  min-height: 560px;
  background-color: #001f4d;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
  width: 320px;
}

.opponent-select {
  margin-bottom: 15px;
  font-weight: bold;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.cell {
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 2.5rem;
  font-weight: bold;
  background-color: #003366;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  color: white;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s ease;
}

.cell:hover {
  background-color: #00509e;
}

.error {
  height: 1.5em;
  color: #ff6b6b;
  margin-bottom: 15px;
  font-weight: bold;
}

.info {
  height: 1.5em;
  margin-top: 15px;
  font-weight: bold;
  font-size: 1.2rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.opponent-select .p-dropdown {
  min-width: 150px;
}
</style>
