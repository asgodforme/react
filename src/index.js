import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square"
            onClick={props.onClick} style={props.style}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i, winResult) {
        let isWin = false;
        if (winResult) {
            isWin = winResult[0] === i || winResult[1] === i || winResult[2] === i;
        }
        const style = {
            color: 'red',
        }
        return <Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} style={isWin ? style : null} />;
    }

    render() {
        var items = [];
        let count = 0;
        const winResult = calculateWinnerPoint(this.props.squares);

        for (var i = 0; i < 3; i++) {
            items.push(
                <div className="board-row" key={i}>
                    {this.renderSquare(count++, winResult)}
                    {this.renderSquare(count++, winResult)}
                    {this.renderSquare(count++, winResult)}
                </div>);
        }
        return (
            <div>{items}</div>
            //        <div>
            //        <div className="board-row">
            //            {this.renderSquare(0)}
            //            {this.renderSquare(1)}
            //            {this.renderSquare(2)}
            //        </div>
            //        <div className="board-row">
            //            {this.renderSquare(3)}
            //            {this.renderSquare(4)}
            //            {this.renderSquare(5)}
            //        </div>
            //        <div className="board-row">
            //            {this.renderSquare(6)}
            //            {this.renderSquare(7)}
            //            {this.renderSquare(8)}
            //        </div>
            //    </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: {
                    x: null,
                    y: null,
                }
            }],
            xIsNext: true,
            stepNumber: 0,
            moves: null,
            isDesc: false,
        };
    }

    componentDidUpdate() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        if (!calculateWinner(current.squares) && calculateAllFull(current.squares)) {
            alert("旗鼓相当，再来一局！");
        }
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const position = {};
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        position.x = parseInt(i / 3) + 1;
        position.y = i % 3 + 1;

        const newHistory = history.concat([{
            squares: squares,
            position: position,
        }]);
        this.setState({
            history: newHistory,
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    doAsc() {
        this.setState({
            isDesc: false,
        });
    }

    doDesc() {
        this.setState({
            isDesc: true,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves;

        if (this.state.isDesc) {
            let currentStepNumber;
            currentStepNumber = this.state.history.length - this.state.stepNumber - 1;

            moves = this.state.history.slice().reverse().map((step, move) => {
                const desc = step.position.x && step.position.y ?
                    'Go to move #' + (this.state.history.length - move - 1) + '当前坐标：('
                    + step.position.x + ',' + step.position.y
                    + ')' :
                    'Go to game start';

                if (currentStepNumber === move) {
                    return (
                        <li key={this.state.history.length - move - 1}>
                            <button onClick={() => this.jumpTo(this.state.history.length - move - 1)}><b>{desc}</b></button>
                        </li>
                    )
                } else {
                    return (
                        <li key={this.state.history.length - move - 1}>
                            <button onClick={() => this.jumpTo(this.state.history.length - move - 1)}>{desc}</button>
                        </li>
                    )
                }
            });
        } else {
            moves = history.map((step, move) => {
                const desc = step.position.x && step.position.y ?
                    'Go to move #' + move + '当前坐标：('
                    + step.position.x + ',' + step.position.y
                    + ')' :
                    'Go to game start';

                if (this.state.stepNumber === move) {
                    return (
                        <li key={move}>
                            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                        </li>
                    )
                } else {
                    return (
                        <li key={move}>
                            <button onClick={() => this.jumpTo(move)}>{desc}</button>
                        </li>
                    )
                }

            })
        }


        let status;
        if (winner) {
            status = "Winne: " + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.doAsc()} >升序</button>
                        <button onClick={() => this.doDesc()} >降序</button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );


    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculateWinnerPoint(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

function calculateAllFull(squares) {
    let count = 0;
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            count++;
        }
    }
    if (count === 0) {
        return true;
    }
    return false;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
