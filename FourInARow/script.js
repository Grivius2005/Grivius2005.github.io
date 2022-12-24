class Board
{
    constructor()
    {
        this.boardTable = document.getElementById("board")
        this.cursors = document.getElementById("cursors")
        this.statusP = document.getElementById("pStatus")
        this.winP = document.getElementById("pWin")
        this.boardTable.innerHTML = ""
        this.cursors.innerHTML = ""
        this.board = []
        this.withPlayerMove = "Red"
        this.statusP.innerText = `${this.withPlayerMove} move`
        this.statusP.style.color = "red"
        for(let i=0;i<7;i++)
        {
            const thElem = document.createElement("th")
            thElem.onmouseover = (e) => {
                this.showCursor(e,i)
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
                    this.statusP.innerText = `${this.withPlayerMove} move`
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
                    this.statusP.innerText = `${this.withPlayerMove} move`
                    return 
                }

            }
        }
    }

    checkWin()
    {
        
    }

}

let board1 
document.getElementById("newGame").onclick = (e) => {
    board1 = new Board()
}