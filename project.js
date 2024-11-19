// Slot Machine Simulation
// Tech with Tim
// Date: 19/11/2024

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    'Cherry': 2,
    'Lemon': 4,
    'Orange': 6,
    'Plum': 8,
    'Bell': 10,
    'Bar': 8,
    '7': 6
}

const SYMBOL_VALUES = {
    'Cherry': 2,
    'Lemon': 3,
    'Orange': 4,
    'Plum': 5,
    'Bell': 6,
    'Bar': 7,
    '7': 10
}

const deposit = () =>
{
    while (true)
    {
        const depositAmount = prompt('Enter the amount want to deposit: ');
        const numberDepositAmount = parseFloat(depositAmount);
    
        if (isNaN(numberDepositAmount) || numberDepositAmount < 0)
        {
            console.log('Invalid deposit amount, try again!');
            continue;
        }
        return numberDepositAmount;
    }
}

const getNumberOfLines = () =>
    {
        while (true)
        {
            const lines = prompt('Enter the number of lines want to bet (1-3): ');
            const numberOfLines = parseFloat(lines);
        
            if (isNaN(numberOfLines) || numberOfLines < 0 || numberOfLines > 3)
            {
                console.log('Invalid lines of bet, try again!');
                continue;
            }
            return numberOfLines;
        }
    }

const getBet = (balance, lines) =>
    {
        while (true)
        {
            const bet = prompt('Enter the bet per line: ');
            const betPerLine = parseFloat(bet);
        
            if (isNaN(betPerLine) || betPerLine < 0 || betPerLine > balance / lines)
            {
                console.log('Invalid total bet, try again!');
                continue;
            }
            return betPerLine;
        }
    }

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT))
    {
        for (let i = 0; i < count; ++i)
            symbols.push(symbol);
    }

    const reels = [[], [], []]
    for (let i = 0; i < COLS; ++i)
    {
        // shallow copy, copy the reference like a pointer
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; ++j)
        {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) =>
{
    const rows = [];
    for (let i = 0; i < ROWS; i++)
    {
        rows.push([]);
        for (let j = 0; j < COLS; j++)
        {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const print = (rows) =>
{
    for (const row of rows)
    {
        let rowString = "";
        for (const [i, symbol] of rows.entries())
        {
            rowString += symbol;
            if (i != rows.length - 1)
            {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) =>
{
    let winnings = 0;
    for (let row = 0; row < lines; row++)
    {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols)
            if (symbol != symbols[0])
            {
                allSame = false;
                break;
            }
        if (allSame)
            winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
    return winnings;
}

const startGame = () =>
{
    let balance = deposit();
    while (true)
    {
        console.log(`You have a balance of ${balance}!`);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        print(rows);
        
        const winnings = getWinnings(rows, bet, numberOfLines);
        console.log(`You have won: ${winnings} dollars!`);
        balance += winnings;
        if (balance <= 0)
        {
            console.log(`You ran out of money!`);
            break;
        }
        const playAgain = prompt(`Do you want to play again (y/n): `);
        if (playAgain != 'y')
        {
            console.log(`You have left the game!`);
            break;
        }
    }
}

startGame();
