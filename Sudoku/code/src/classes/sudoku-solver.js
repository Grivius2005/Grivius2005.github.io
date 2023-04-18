import SudokuToolCollection from "sudokutoolcollection";


export class Sudoku {
    constructor() {}
        //-------solve stufff------
    solve(board) {
        if (this.solved(board)) {
            return board
        } else {
            const possibilities = this.nextBoards(board);
            const validBoard = this.keepOnlyValid(possibilities)
            return this.searchForSolution(validBoard)
        }
    }

    searchForSolution(boards) {
        if (boards.length < 1) {
            return false
        } else {
            let first = boards.shift()
            const tryPath = this.solve(first)
            if (tryPath != false) {
                return tryPath
            } else {
                return this.searchForSolution(boards)
            }
        }
    }

    solved(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    return false
                }
            }
        }
        return true
    }

    nextBoards(board) {
        let res = []
        const firstEmpty = this.findEmptySquare(board)
        if (firstEmpty != undefined) {
            const y = firstEmpty[0]
            const x = firstEmpty[1]
            for (let i = 1; i <= 9; i++) {
                let newBoard = [...board]
                let row = [...newBoard[y]]
                row[x] = i
                newBoard[y] = row
                res.push(newBoard)
            }
        }
        return res
    }

    findEmptySquare(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    return [i, j]
                }
            }
        }
    }

    keepOnlyValid(boards) {
        return boards.filter((b) => this.validBoard(b))
    }

    validBoard(board) {
        return this.rowGood(board) && this.columnGood(board) && this.boxesGood(board)
    }

    rowGood(board) {
        for (let i = 0; i < 9; i++) {
            let cur = []
            for (let j = 0; j < 9; j++) {
                if (cur.includes(board[i][j])) {
                    return false
                } else if (board[i][j] != 0) {
                    cur.push(board[i][j])
                }
            }
        }
        return true
    }

    columnGood(board) {
        for (let i = 0; i < 9; i++) {
            let cur = []
            for (let j = 0; j < 9; j++) {
                if (cur.includes(board[j][i])) {
                    return false
                } else if (board[j][i] != 0) {
                    cur.push(board[j][i])
                }
            }
        }
        return true
    }

    boxesGood(board) {
            const boxCordinates = [
                [0, 0],
                [0, 1],
                [0, 2],
                [1, 0],
                [1, 1],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
            ]
            for (let y = 0; y < 9; y += 3) {
                for (let x = 0; x < 9; x += 3) {
                    let cur = []
                    for (let i = 0; i < 9; i++) {
                        let cordinates = [...boxCordinates[i]]
                        cordinates[0] += y
                        cordinates[1] += x
                        if (cur.includes(board[cordinates[0]][cordinates[1]])) {
                            return false
                        } else if (board[cordinates[0]][cordinates[1]] != 0) {
                            cur.push(board[cordinates[0]][cordinates[1]])
                        }
                    }
                }
            }
            return true


        }
        //---------------------------------
        //------------generate stuff------------
    generate(difficulty) {
        const sudokuString = SudokuToolCollection().generator.generate(difficulty)
        let dataToSend = []
        for (let i = 0; i < 9; i++) {
            dataToSend.push([])
            for (let j = 0; j < 9; j++) {
                if (sudokuString[j + 9 * i] == ".") {
                    dataToSend[i].push(0)
                } else {
                    dataToSend[i].push(Number(sudokuString[j + 9 * i]))
                }

            }
        }
        return dataToSend
    }
}