class Board
{
    constructor()
    {
        this.boardTable = document.getElementById("board")
        this.cursors = document.getElementById("cursors")
        this.statusP = document.getElementById("pStatus")
        this.boardTable.innerHTML = ""
        this.cursors.innerHTML = ""
        this.board = []
        this.withPlayerMove = "Red"
        this.statusP.innerText = `${this.withPlayerMove}'s move`
        this.statusP.style.color = "red"
        for(let i=0;i<7;i++)
        {
            const thElem = document.createElement("th")
            thElem.onmouseover = (e) => {
                this.showCursor(e,i)
            }
            thElem.onclick = () =>
            {
                this.addCoin(i)
            }
            this.cursors.appendChild(thElem)
        }
        for(let i=0;i<7;i++)
        {
            this.board.push([])
            this.boardTable.appendChild(document.createElement("tr"))
            for(let j=0;j<7;j++)
            {
                const tdElem = document.createElement("td")
                tdElem.onmouseover = (e) => {
                    this.showCursor(e,j)
                }
                tdElem.onclick = () =>
                {
                    this.addCoin(j)
                }
                this.board[i].push(0)
                this.boardTable.children[i].appendChild(tdElem)
            }
        }
    }

    showCursor(e, column)
    {
        for(let i=0;i<7;i++)
        {
            this.cursors.children[i].innerHTML = ""
        }
        const cursorDiv = document.createElement("div")
        cursorDiv.classList.add("cursor")
        this.cursors.children[column].appendChild(cursorDiv)
        e.target.onmouseout = (e) =>
        {
            for(let i=0;i<7;i++)
            {
                this.cursors.children[i].innerHTML = ""
            }
            e.target.onmouseover = (e) => {
                this.showCursor(e,column)
            }
        }
    }

    addCoin(column)
    {
        for(let i=6;i>=0;i--)
        {
            if(this.board[i][column] == 0)
            {
                if(this.withPlayerMove == "Red")
                {
                    this.board[i][column] = 1
                    const coin = document.createElement("div")
                    coin.classList.add("coin")
                    coin.style.backgroundColor = "red"
                    this.boardTable.children[i].children[column].appendChild(coin)
                    this.withPlayerMove = "Yellow"
                    this.statusP.style.color = "yellow"
                    this.statusP.innerText = `${this.withPlayerMove}'s move`
                    this.checkWin()
                    return
                }
                else
                {
                    this.board[i][column] = 2
                    const coin = document.createElement("div")
                    coin.classList.add("coin")
                    coin.style.backgroundColor = "yellow"
                    this.boardTable.children[i].children[column].appendChild(coin)
                    this.withPlayerMove = "Red"
                    this.statusP.style.color = "red"
                    this.statusP.innerText = `${this.withPlayerMove}'s move`
                    this.checkWin()
                    return 
                }

            }
        }
    }

    checkWin()
    {
        for(let i=3;i>=0;i--)
        {
            for(let j=6;j>=0;j--)
            {
                if(this.board[i][j] == this.board[i+1][j] && this.board[i+1][j] == this.board[i+2][j] && this.board[i+2][j] == this.board[i+3][j] && this.board[i][j] != 0)
                {
                    this.endGame(this.board[i][j])
                }
                if(this.board[j][i] == this.board[j][i+1] && this.board[j][i+1] == this.board[j][i+2] && this.board[j][i+2] == this.board[j][i+3] && this.board[j][i] != 0)
                {
                    this.endGame(this.board[j][i])
                }
            }
            for(let j=3;j>=0;j--)
            {
                if(this.board[i][j] == this.board[i+1][j+1] && this.board[i+1][j+1] == this.board[i+2][j+2] && this.board[i+2][j+2] == this.board[i+3][j+3] && this.board[i][j] != 0)
                {
                    this.endGame(this.board[i][j])
                }
                if(this.board[i][6-j] == this.board[i+1][5-j] && this.board[i+1][5-j] == this.board[i+2][4-j] && this.board[i+2][4-j] == this.board[i+3][3-j] && this.board[i][6-j] != 0)
                {
                    this.endGame(this.board[i][6-j])
                }
            }
        }
        for(let i=6;i>=0;i--)
        {
            for(let j=6;j>=0;j--)
            {
                if(this.board[i][j] == 0)
                {
                    return
                }
            }
        }
        this.endGame("Draw")
    }

    endGame(color)
    {
        if(color == "Draw")
        {
            this.statusP.innerText = "Draw!"
            this.statusP.style.color = "orange"
        }
        else
        {
            this.statusP.innerText = `${(color == 1 ? "Red" : "Yellow")} wins!`
            this.statusP.style.color = (color == 1 ? "red" : "yellow")
        }

        for(let i=0;i<7;i++)
        {
            this.cursors.children[i].onclick = null
            this.cursors.children[i].innerHTML = ""
            this.cursors.children[i].onclick = null
            this.cursors.children[i].onmouseover = null
            this.cursors.children[i].onmouseout = null
            for(let j=0;j<7;j++)
            {
                this.boardTable.children[i].children[j].onclick = null
                this.boardTable.children[i].children[j].onmouseover = null
                this.boardTable.children[i].children[j].onmouseout = null
            }
        }
    }

}

let board1 
document.getElementById("newGame").onclick = (e) => {
    board1 = new Board()
}