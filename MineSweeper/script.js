let areax = 1
let areay = 1
let minesCount = 1
let area = []
let nick = ""
let main = document.getElementById("mainBlock")
let inputs = document.getElementsByTagName("input")
let labels = document.getElementsByTagName("label")
let startGameBtn = document.getElementById("startGame")
let saperArea = document.getElementById("saperArea")
let gameOver = document.getElementById("gameOver")
let timeShow = document.getElementById("time")
saperArea.style = "filter: brightness(0.5);"
let gamePlaying = false
let flags = 0
let eventClicks = 0
let time = 0
let timeStart = 0
let timeCount = ""
function getMineData()
{
    timeShow.innerText = "0:00.000";
    areax = parseInt(document.getElementById("areax").value)
    areay = parseInt(document.getElementById("areay").value)
    minesCount = parseInt(document.getElementById("minesCount").value)
    nick = document.getElementById("nick").value
    if(nick == "")
    {
        let d = new Date()
        nick = "Jeff" + d.getTime()
    }
    if((isNaN(areax) || isNaN(areay) || isNaN(minesCount)) || (areax<=0 || areay<=0 || minesCount < 0) || (areax > 80 || areay > 80))
    {
        alert("Data entered incorrectly! ( x & y from (0;80> )")
        return;
    }
    if(minesCount > areax*areay)
    {
        alert("Too much bombs")
        return;
    }
    if(minesCount == 0)
    {
        alert("Too easy for you I think")
        return;
    }
    flags = minesCount
    if(flags<10)
    {
        document.getElementById("flags").innerText = "0" + flags
    }
    else
    {
        document.getElementById("flags").innerText = flags
    }
    if(areax>30 || areay>30)
    {
        document.getElementById("game").style = "flex-basis: 100%;"
        document.body.style = "height: auto;"
    }
    else
    {
        document.getElementById("game").style = "flex-basis: unset;"
        document.body.style = "height: 100vh;"
    }
    gamePlaying = true;
    saperArea.style = "filter: brightness(1.0);"
    startGameBtn.innerText = "New Game"
    startGameBtn.onclick = newGame
    saperArea.innerHTML = "<table></table>"
    for(let i=0;i<inputs.length;i++)
    {
        inputs[i].disabled = true;
    }
    for(let i=0;i<labels.length;i++)
    {
        labels[i].style = "filter: brightness(0.1);"
    }
    for(let i=0; i<areax;i++)
    {
        let helpArray = []
        for(let j=0;j<areay;j++)
        {
            helpArray.push(0)
        }
        area.push(helpArray)
    }
    let helpBombLeft = minesCount
    while(helpBombLeft != 0)
    {
        let bombx = Math.round(Math.random() * (areax-1))
        let bomby = Math.round(Math.random() * (areay-1))
        if(area[bombx][bomby] == 0)
        {
            area[bombx][bomby] = 1
            helpBombLeft--
        }
    }


    for(let i=0; i<areay;i++)
    {
        let sapRow = document.createElement("tr")
        for(let j=0;j<areax;j++)
        {
            let sapBlock = document.createElement("td");
            sapBlock.id = `block_${j}_${i}`;
            sapBlock.setAttribute("onclick",`reveal(${j},${i},this)`)
            sapBlock.classList.add("hidden")
            sapBlock.innerHTML = ""
            sapBlock.addEventListener('contextmenu', (event) => {
                flagBlock(event,sapBlock)
            })
            sapRow.appendChild(sapBlock)
        }
        saperArea.appendChild(sapRow)
    }

    getFromCookie(areax,areay,minesCount)
}

function newGame()
{
    try
    {
        clearInterval(timeCount);
    }
    catch
    {
        console.log("timeCount doesn't exist yet")
    }
    for(let i=0;i<inputs.length;i++)
    {
        inputs[i].disabled = false;
    }
    for(let i=0;i<labels.length;i++)
    {
        labels[i].style = "filter: brightness(1.0);"
    }
    startGameBtn.innerText = "Start"
    startGameBtn.onclick = getMineData
    saperArea.style = "filter: brightness(0.5); cursor: auto;"
    gamePlaying = false;
    area = []
    areax = 1
    areay = 1
    minesCount = 1
    eventClicks = 0
    time = 0
    timeStart = 0
}

function reveal(x,y,thisBlock)
{

    if(gamePlaying && area[x][y]!=2 && thisBlock.innerHTML == "")
    {
        eventClicks++;
        if(area[x][y] == 1)
        {
            thisBlock.classList.remove("hidden")
            thisBlock.classList.add("reveald")
            thisBlock.innerHTML = '<img src="resource/bomb.png" alt="bomb">'
            thisBlock.style = "background: red;"
            gameOver.style = "display: flex;"
            main.style = "filter: brightness(0.1);"
            clearInterval(timeCount);
            document.getElementById("timeEnd").innerText = timeShow.innerText;
            document.getElementById("actionClikcs").innerText = eventClicks;
            document.getElementById("gameOverMessage").innerText = "You lost!"
            revealBombs()
            newGame()
        }
        else
        {
            autoReveal(x,y)

            let muchLeft = 0
            for(let i=0; i<areax;i++)
            {
                for(let j=0;j<areay;j++)
                {
                    if(area[i][j] == 0)
                    {
                        muchLeft++
                    }
                }
            }
            if(muchLeft == 0)
            {
                gameOver.style = "display: flex;"
                main.style = "filter: brightness(0.1);"
                clearInterval(timeCount);
                document.getElementById("timeEnd").innerText = timeShow.innerText;
                document.getElementById("actionClikcs").innerText = eventClicks;
                document.getElementById("gameOverMessage").innerText = "You won!"
                let d = new Date()
                d.setTime(d.getTime() + (10 * 12 * 31 * 24 * 60 * 60 * 1000));
                document.cookie = `${encodeURIComponent(nameCode(nick))}-${areax}/${areay}/${minesCount} = ${timeShow.innerText}; expires=${d.toUTCString()}; SameSite=None; Secure`
                getFromCookie(areax,areay,minesCount)
                revealBombs()
                newGame()
            }
        }
        if(eventClicks ==1)
        {
            let d = new Date()
            timeStart = d.getTime()
            timeCount = setInterval(timeSpan,1)
        }
    }

}

function revealBombs()
{
    for(let i=0; i<areax;i++)
    {
        for(let j=0;j<areay;j++)
        {
            if(area[i][j] == 1)
            {
                let bombBlock = document.getElementById(`block_${i}_${j}`)
                bombBlock.classList.remove("hidden")
                bombBlock.classList.add("reveald")
                bombBlock.innerHTML = '<img src="resource/bomb.png" alt="bomb">' 
            }
        }
    }
}

function gameOverAccept()
{
    gameOver.style = "display: none;"
    main.style = "filter: brightness(1.0);"
}

function autoReveal(x,y)
{
    let thatBlock = document.getElementById(`block_${x}_${y}`)
    thatBlock.classList.remove("hidden")
    thatBlock.classList.add("reveald")
    area[x][y] = 2
    let bombCount = 0
    for(let i=-1;i<=1;i++)
    {
        for(let j=-1;j<=1;j++)
        {
            if((x+i)>=0 && (y+j)>=0 && (x+i)<areax && (y+j)<areay)
            {
                if(area[x+i][y+j] == 1)
                {

                    bombCount++
                }
            }
        }
    }

    if(bombCount != 0)
    {
        thatBlock.innerText = bombCount
        return;
    }
    else
    {
        for(let i=-1;i<=1;i++)
        {
            for(let j=-1;j<=1;j++)
            {
                if((x+i)>=0 && (y+j)>=0 && (x+i)<areax && (y+j)<areay)
                {
                    if(area[x+i][y+j] != 2 && area[x+i][y+j] != 1 && document.getElementById(`block_${x+i}_${y+j}`).innerHTML == "")
                    {
                        autoReveal(x+i,y+j)   
                    }
 
                }
            }
        }
        return;
    }
}

function flagBlock(event,blockToFlag)
{
    if(event.button == 2 && gamePlaying)
    {
        if(blockToFlag.classList.contains("hidden"))
        {
            if(blockToFlag.innerHTML == "" && flags !=0)
            {
                blockToFlag.innerHTML = '<img src="resource/flag.png" alt="flag">'
                flags--
                if(flags<10)
                {
                    document.getElementById("flags").innerText = "0" + flags
                }
                else
                {
                    document.getElementById("flags").innerText = flags
                }
                eventClicks++;
            }
            else if(blockToFlag.innerHTML == '<img src="resource/flag.png" alt="flag">')
            {
                blockToFlag.innerHTML = '<img src="resource/question_mark.png" alt="question_mark">'
                flags++
                if(flags<10)
                {
                    document.getElementById("flags").innerText = "0" + flags
                }
                else
                {
                    document.getElementById("flags").innerText = flags
                }
                eventClicks++;
            }
            else if(blockToFlag.innerHTML == "" && flags == 0)
            {
                blockToFlag.innerHTML = '<img src="resource/question_mark.png" alt="question_mark">'
                eventClicks++;
            }
            else if(blockToFlag.innerHTML == '<img src="resource/question_mark.png" alt="question_mark">')
            {
                blockToFlag.innerHTML = ""
                eventClicks++;
            }
        }

    }
    event.preventDefault()
    if(eventClicks ==1)
    {   let d = new Date()
        timeStart = d.getTime()
        timeCount = setInterval(timeSpan,1)
    }
}

function timeSpan()
{
    let d = new Date()
    time = d.getTime() - timeStart
    let milisecounds = time
    let secounds = 0
    let minutes = 0
    if(time>=1000)
    {
        secounds = Math.floor(milisecounds/1000)
        milisecounds -= secounds*1000
    }
    if(secounds>=60)
    {
        minutes= Math.floor(secounds/60)
        secounds -= minutes*60
    }
    let mili =  Math.round(milisecounds)
    if(mili == 0 || mili == 1000)
    {
        mili = "000"
    }
    else if(mili < 10)
    {
        mili =  "00" + mili
    }
    else if(mili >= 10 && mili < 100)
    {
        mili = "0" + mili
    }
    timeShow.innerText = `${minutes}:${(secounds < 10) ? `0${secounds}` : secounds}.${mili}`;
}

function getFromCookie(x,y,bomb)
{
    let tabela = document.getElementById("recordsTable")
    tabela.innerHTML = "<tr><th>Nick</th><th>Czas</th></tr>"
    let rekordy = document.cookie.split("; ")
    for(let i=0;i<rekordy.length;i++)
    {
        rekordy[i] = rekordy[i].split("=").join("-").split("-")
    }

    let tryb = `${x}/${y}/${bomb}`
    let daneRekordy = []
    for(let i=0;i<rekordy.length;i++)
    {
        if(rekordy[i][1] == tryb)
        {
            daneRekordy.push(rekordy[i])
        }
    }
    daneRekordy.sort(sortByTime)
    document.getElementById("recordsText").innerText = `Top 10 for ${tryb}`
    if(daneRekordy.length >= 10)
    {
        for(let i=0;i<10;i++)
        {
            let wiersz = document.createElement("tr")
            let nick = document.createElement("td")
            nick.innerText = decodeURIComponent(daneRekordy[i][0])
            let czas = document.createElement("td")
            czas.innerText = daneRekordy[i][2]
            wiersz.appendChild(nick)
            wiersz.appendChild(czas)
            tabela.appendChild(wiersz)
        }
    }
    else
    {
        for(let i=0;i<daneRekordy.length;i++)
        {
            let wiersz = document.createElement("tr")
            let nick = document.createElement("td")
            nick.innerText = decodeURIComponent(daneRekordy[i][0])
            let czas = document.createElement("td")
            czas.innerText = daneRekordy[i][2]
            wiersz.appendChild(nick)
            wiersz.appendChild(czas)
            tabela.appendChild(wiersz)
        }
    }

}

function nameCode(name)
{
    let newName = name.split('')
    for(let i=0;i<newName.length;i++)
    {
        if(newName[i] == "-")
        {
            newName[i] = "="
        }
    }
    return newName.join('')
}


function sortByTime(a,b)
{
    let dane1 = a[2]
    let dane2 = b[2]

    if (dane1 < dane2) 
    {
        return -1
    }
    if (dane1 > dane2) 
    {
        return 1
    }
    if(dane1 == dane2)
    {
        return 0
    }
}