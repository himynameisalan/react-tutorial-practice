import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.highlight ? {backgroundColor: 'yellow'} : {}}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, highlight) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={highlight}
            />
        );
    }

    highlightSquare(key) {
        for (let i = 0; i < 3; i++) {
            if (this.props.winner.line[i] === key) {
                return this.renderSquare(key, true);
            }
        }

        return this.renderSquare(key, false);
    }

    render() {
        let col = [];

        for (let i = 0; i < 3; i++) {
            let row = [];
            let key = 0;

            for (let j = 0; j < 3; j++) {
                key = i * 3 + j;

                if (this.props.winner) {
                    row.push(this.highlightSquare(key));
                } else {
                    row.push(this.renderSquare(key, false));
                }
            }

            col.push(<div key={key}>{row}</div>);
        }

        return <div>{col}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    col: -1,
                    row: -1
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            sort: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    col: parseInt(i / 3),
                    row: i % 3
                }
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }

    sort() {
        this.setState({
            sort: !this.state.sort
        });
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const stepNumber = this.state.stepNumber;
        const sort = this.state.sort;

        if (!sort) {
            history = history.slice(0).reverse();
        }

        const moves = history.map((step, move) => {
            if (!sort) {
                move = history.length - move - 1;
            }

            const desc = move
                ? 'Go to move #' + move + ' (' + step.col + ',' + step.row + ')'
                : 'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={move === stepNumber ? {fontWeight: 'bold'} : {}}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        if (winner) {
            status = 'Winner: ' + winner.sign;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winner={winner}
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div style={{float: 'left'}}>{status}</div>
                    <div className="sort" onClick={() => this.sort()}></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let winner = {
        sign: 'N',
        line: [9, 9, 9]
    };

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            winner.sign = squares[a];
            winner.line = lines[i];
            return winner;
        }
    }
    return null;
}
