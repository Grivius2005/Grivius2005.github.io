<style>
    @import "css/inpstyle.css";
    @import "css/gamestyle.css";
</style>

<script>
import {Sudoku} from "../classes/sudoku-solver"
let gameStart = false;
let files;
let fileName = "..."
let suData;
let isGoodText = ""
let sudokuTable = []
let sudokuMoves = []
let sudokuSolution = []
let leftNumberOrgin = [9,9,9,9,9,9,9,9,9]
let leftNumber = [...leftNumberOrgin]
let indexX = 0
let indexY = 0
let hintString = "off"
let isWin = false


//-----------------Start Game--------------------------------------------------
async function loadJson()
{
    const text = await files[0].text()
    let json = JSON.parse(text)
    suData = json
    fileName = files[0].name;
    isGoodText = ""
    if(fileName.length > 15)
    {
        fileName = fileName.substring(0,5) + "[...]" + ".json"
    }
}


function isGood()
{
    if(suData == null)
    {
        isGoodText = "No file!"
        return
    }
    if(!Object.keys(suData).includes("default") || !Object.keys(suData).includes("moves"))
    {
        isGoodText = "Incorrect data format!"
        return
    }
    else
    {
        if(!Array.isArray(suData.default) || !Array.isArray(suData.default))
        {
            isGoodText = "Incorrect data format!"
            return
        }
        if(suData.default.length != 9 || suData.moves.length != 9)
        {
            isGoodText = "Incorrect data format!"
            return
        }
        for(let elem of suData.default)
        {
            if(!Array.isArray(elem) || !Array.isArray(elem))
            {
                isGoodText = "Incorrect data format!"
                return
            }   
            if(elem.length != 9 || elem.length != 9)
            {
                isGoodText = "Incorrect data format!"
                return
            }
            for(let elemElem of elem)
            {
                if(!Number.isInteger(elemElem) || !Number.isInteger(elemElem))
                {
                    isGoodText = "Incorrect data format!"
                    return
                }   
            }
        }
        for(let elem of suData.moves)
        {
            if(!Array.isArray(elem) || !Array.isArray(elem))
            {
                isGoodText = "Incorrect data format!"
                return
            }   
            if(elem.length != 9 || elem.length != 9)
            {
                isGoodText = "Incorrect data format!"
                return
            }
            for(let elemElem of elem)
            {
                if(!Number.isInteger(elemElem) || !Number.isInteger(elemElem))
                {
                    isGoodText = "Incorrect data format!"
                    return
                }   
            }
        }

    }
    let checkTable = []
    let checkIfSolved = true
    for(let i=0;i<9;i++)
    {
        checkTable.push([])
        for(let j=0;j<9;j++)
        {

            if(suData.default[i][j] == 0 && suData.moves[i][j] == 0)
            {
                checkIfSolved = false
            }
            if(suData.default[i][j] != 0 && suData.moves[i][j] != 0)
            {
                isGoodText = "Moves match with data!"
                return
            }
            if(checkIfSolved)
            {
                if(suData.default[i][j] != 0)
                {
                    checkTable[i].push(suData.default[i][j])
                }
                else if(suData.moves[i][j] != 0)
                {
                    checkTable[i].push(suData.moves[i][j])
                }
            }
        }
    }

    sudokuTable = suData.default
    sudokuMoves = suData.moves
    let sudokuObject = new Sudoku()
    isGoodText = "Solving..."

    setTimeout(()=>{
        sudokuSolution = sudokuObject.solve(sudokuTable)
        if(!sudokuSolution)
        {
            isGoodText = "Sudoku impossible to solve!"
            return
        }

        if(checkIfSolved)
        {
            if(JSON.stringify(checkTable) == JSON.stringify(sudokuSolution))
            {
                isGoodText = "Sudoku already solved!"
                return
            }

        }
        for(let i=0;i<9;i++)
        {
            for(let j=0;j<9;j++)
            {
                if(sudokuTable[i][j] != 0)
                {
                    leftNumberOrgin[sudokuTable[i][j]-1] -= 1
                    leftNumber[sudokuTable[i][j]-1] -= 1
                }
                if(sudokuMoves[i][j] != 0)
                {
                    leftNumber[sudokuMoves[i][j]-1] -= 1
                }
            }
        }


        gameStart = true;
    },10)
   
}

function generateSudoku()
{
    sudokuMoves = []
    for(let i=0;i<9;i++)
    {
        sudokuMoves.push([])
        for(let j=0;j<9;j++)
        {
            sudokuMoves[i].push(0)
        }
    }
    let sudokuObject = new Sudoku()
    sudokuTable = sudokuObject.generate(document.getElementById("difficulty").value)
    isGoodText = "Solving..."
    setTimeout(()=>{
        sudokuSolution = sudokuObject.solve(sudokuTable)

        for(let i=0;i<9;i++)
        {
            for(let j=0;j<9;j++)
            {
                if(sudokuTable[i][j] != 0)
                {
                    leftNumberOrgin[sudokuTable[i][j]-1] -= 1
                    leftNumber[sudokuTable[i][j]-1] -= 1
                }
                if(sudokuMoves[i][j] != 0)
                {
                    leftNumber[sudokuMoves[i][j]-1] -= 1
                }
            }
        }

        gameStart = true;
    },10)
}

//---------------------------------------------------------------------------
function saveSudokuData()
{

    const data = {
        default:[],
        moves:[]
    }
    data.default = sudokuTable
    let moveData = []
    for(let i=0;i<9;i++)
    {
        moveData.push([])
        for(let j=0;j<9;j++)
        {
            let inputElem = document.getElementById(`${i}:${j}`)
            if(inputElem != null)
            {
                if(inputElem.value != 0)
                {
                    moveData[i].push(Number(inputElem.value))
                }
                else
                {
                    moveData[i].push(0)
                }
            }
            else
            {
                moveData[i].push(0)
            }
        }
    }
    data.moves = moveData
    const downloadA = document.createElement("a")
    let json = [JSON.stringify(data)]
    let blob = new Blob(json,{ type: "application/json;charset=utf-8", name:"sudoku" })
    downloadA.href = URL.createObjectURL(blob)
    downloadA.download = "sudoku.json"
    
    downloadA.click()
    downloadA.remove()
}



function validInput(e)
{
    let i = e.target.id[0]
    let j = e.target.id[2]
    if(hintString == "off")
    {
        let orginal = ""
        if(e.target.value.length == 2)
        {
            orginal = e.target.value[0]
        }
        if(isNaN(e.data) || e.target.value == "")
        {
            e.target.value = orginal
            sudokuMoves[i][j] = 0
            updateInfo()
            return
        }
        else
        {
            const numValue = Number(e.data)
            if(numValue < 1 || numValue > 9)
            {
                e.target.value = orginal
                updateInfo()
                return
            }

        }

        e.target.value = e.data
        sudokuMoves[i][j] = Number(e.data)
        if(e.target.value == sudokuSolution[i][j])
        {
            e.target.style.color = "limegreen"
        } 
        else
        {
            e.target.style.color = "red"
        }
        changeFocus("ArrowRight")
        updateInfo()
    }
    else
    {
        if(e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward")
        {
            e.target.value = sudokuMoves[i][j]
            return
        }
        let value
        if(e.target.value.length == 2)
        {   
            value = e.target.value[1]
            e.target.value = e.target.value[0]

        }
        else
        {
            value = e.target.value[0]
            e.target.value = ""
        }

        hintInput(e,value)
    }
    checkWin()
}

function hintInput(e,value)
{
    let afterValue = e.target.parentElement.dataset.after
    if(isNaN(value))
    {
        return
    }
    else
    {
        const numValue = Number(value)
        if(numValue < 1 || numValue > 9)
        {
            return
        }
        if(afterValue.length != 12 )
        {
            e.target.parentElement.setAttribute('data-after', afterValue + ` ${value} `);
        }

    }

}

function afterDelete(e)
{

    if(hintString == "on" && e.key == "Backspace" )
    {
        let afterValue = e.target.parentElement.dataset.after

        if(afterValue.length > 3)
        {
            afterValue = afterValue.substring(0,afterValue.length - 3)
        }
        else
        {
            afterValue = ""
        }
        e.target.parentElement.setAttribute('data-after', afterValue);
    }
}


function changeFocus(e)
{
    let eve = ""
    if(e.key == undefined)
    {
        eve = e
    }
    else
    {
        eve = e.key
    }
    switch(eve)
    {
        case "ArrowLeft":
            while(1==1)
            {
                indexY-=1
                if(indexY < 0)
                {
                    indexY = 8
                    indexX -=1
                    if(indexX < 0)
                    {
                        indexX = 8
                    }
                }

                const focusElem = document.getElementById(`${indexX}:${indexY}`)

                if(focusElem)
                {
                    let end = focusElem.value.length
                    setTimeout(function(){focusElem.selectionStart = focusElem.selectionEnd = end},5)
                    focusElem.focus()
                    break
                }
            }
            break
        case "ArrowRight":
            while(1==1)
            {
                indexY+=1
                if(indexY > 8)
                {
                    indexY = 0
                    indexX +=1
                    if(indexX > 8)
                    {
                        indexX = 0
                    }
                }
                const focusElem = document.getElementById(`${indexX}:${indexY}`)
                if(focusElem)
                {
                    let end = focusElem.value.length
                    setTimeout(function(){focusElem.selectionStart = focusElem.selectionEnd = end},5)
                    focusElem.focus()
                    break
                }
            }
            break
        case "ArrowUp":
            while(1==1)
            {
                indexX-=1
                if(indexX < 0)
                {
                    indexX = 8
                }
                const focusElem = document.getElementById(`${indexX}:${indexY}`)
                if(focusElem)
                {
                    let end = focusElem.value.length
                    setTimeout(function(){focusElem.selectionStart = focusElem.selectionEnd = end},5)
                    focusElem.focus()
                    break
                }
            }
            break
        case "ArrowDown":
            while(1==1)
            {
                indexX+=1
                if(indexX > 8)
                {
                    indexX = 0
                }
                const focusElem = document.getElementById(`${indexX}:${indexY}`)
                if(focusElem)
                {
                    let end = focusElem.value.length
                    setTimeout(function(){focusElem.selectionStart = focusElem.selectionEnd = end},5)
                    focusElem.focus()
                    break
                }
            }
            break
    }
}

window.onkeydown = changeFocus

function focusOn(i,j)
{
    indexY = j
    indexX = i
}

function updateInfo()
{
    leftNumber = [...leftNumberOrgin]
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            let elem = document.getElementById(`${i}:${j}`)
            if(elem)
            {
                if(elem.value != "")
                {
                    leftNumber[Number(elem.value)-1] -= 1 
                }
            }
        }
    }
}



function solveSudoku()
{
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            let elem = document.getElementById(`${i}:${j}`)
            if(elem)
            {
                elem.value = sudokuSolution[i][j]
                sudokuMoves[i][j] = Number(sudokuSolution[i][j])
                elem.style.color = "limegreen" 
            }
        }
    }
    updateInfo()
    checkWin()
}

function clearValue()
{
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            let elem = document.getElementById(`${i}:${j}`)
            if(elem)
            {
                elem.value = ""
            }
        }
    }
    updateInfo()
    checkWin()
}


function hintSwitch(e)
{
    e.target.classList.toggle("switch_on")
    if(hintString == "off")
    {
        hintString = "on"
    }
    else
    {
        hintString = "off"
    }
}

function deleteHints()
{
    const allDivs = document.getElementsByClassName("afters")
    for(let i=0;i<allDivs.length;i++)
    {
        allDivs[i].setAttribute("data-after","")
    }
}


function getInputStyle(i,j)
{
    if(sudokuMoves[i][j] == sudokuSolution[i][j])
    {
        return "limegreen"

    }
    else
    {
        return "red"
    }
}

function getStartValue(i,j)
{

    if(sudokuMoves[i][j]== 0)
    {
        return ""

    }
    else
    {
        return sudokuMoves[i][j]
    }
}


function checkWin()
{
    let checkWinTable = []
    for(let i = 0;i<9;i++)
    {
        checkWinTable.push([])
        for(let j=0;j<9;j++)
        {
            checkWinTable[i].push(sudokuTable[i][j])
            if(checkWinTable[i][j] == 0)
            {
                const valueCheck = document.getElementById(`${i}:${j}`).value
                if(valueCheck == "")
                {
                    checkWinTable[i][j] = 0
                }
                else
                {
                    checkWinTable[i][j] = Number(valueCheck)
                }

            }
        }
    }
    if(JSON.stringify(checkWinTable) == JSON.stringify(sudokuSolution))
    {
        let inputs = document.getElementsByTagName("input")
        for(let i=0;i<inputs.length;i++)
        {
            inputs[i].disabled = true;
        }
        let buttons = document.getElementById("menu").getElementsByTagName("button")
        for(let i=0;i<buttons.length;i++)
        {
            buttons[i].disabled = true;
        }
        document.getElementById("data_div").style.display = "none"
        isWin = true
    }
}





</script>

{#if gameStart}
    <nav>
        <button type="button" on:click={()=>{location.reload()}}><img src="./assets/previous.png" alt="back"></button>
        <button type="button" on:click={()=>{print()}}><img src="./assets/print.png" alt="print"></button>
        <button type="button" on:click={saveSudokuData}><img src="./assets/save.png" alt="save"></button>
    </nav>
    <main>
        {#if isWin}
        <h2 id="winHeader">You have won!</h2>
        {/if}
        <div id="menu">
            <button type="button" id="solve_sudoku" on:click={solveSudoku}>Solve sudoku</button>
            <button type="button" id="clear_sudoku" on:click={clearValue}>Clear</button>
            <div id="show_left">
                <img src="./assets/information.png" alt="info">
                <div id="data_div">
                    <table>
                        <tr>
                            <th>Number</th>
                            <th>Left</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>{leftNumber[0]}</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>{leftNumber[1]}</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>{leftNumber[2]}</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>{leftNumber[3]}</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>{leftNumber[4]}</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>{leftNumber[5]}</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>{leftNumber[6]}</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>{leftNumber[7]}</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>{leftNumber[8]}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <button type="button" id="hints_switch" on:click={hintSwitch}>Hints: {hintString}</button>
            <button type="button" id="delete_hints" on:click={deleteHints}>Delete all hints</button>
        </div>
        <table id="gameArea">
            {#each sudokuTable as row, i}
                <tr>
                {#each row as cell, j}
                    {#if cell == 0}
                        <td class="empty_cell">
                            <div class="afters" data-after="">
                                <input type="text" style="color:{getInputStyle(i,j)}" id="{i}:{j}" value={getStartValue(i,j)} on:input={validInput} on:click={()=>{focusOn(i,j)}} on:keydown={afterDelete}  maxlength="2">
                            </div>
                        </td>
                    {:else}
                    <td class="filled_cell"><div>{cell}</div></td>
                    {/if}
                {/each}
                </tr>
            {/each}
        </table>
    </main>
{:else}
    <div id="file">
        <h2>Upload file</h2>
        <div id="file-input">
            <label for="sudokuInp" class="file-upload">
                {fileName}
            </label>
            <input type="file" name="sudoku" id="sudokuInp" multiple={false} accept="application/json" bind:files on:change={loadJson}>
        </div>
        {#if isGoodText != ""}
            <div id="isGood" style="background-color: {isGoodText == "Solving..." ? "rgb(0, 68, 255)":"red"};">
                <p>{isGoodText}</p>
            </div>
        {/if}
        <button type="button" id="startGame" on:click={isGood}>Start from file</button>
        <h2>Set difficulty</h2>
        <div id="select-input">
            <select id="difficulty">
                <option value="easy" selected>Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="very-hard">Very hard</option>
                <option value="insane">Insane</option>
                <option value="inhuman">Inhuman</option>
            </select>
        </div>
        <button type="button" id="generateSudoku" on:click={generateSudoku}>Generate sudoku</button>

    </div>
{/if}

