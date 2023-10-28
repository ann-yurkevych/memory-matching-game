import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.symbols = ['🍎', '🍌', '🍒', '🍓', '🥥', '🍊', '🍋', '🍇'];
    this.state = {
      cards: [],
      flippedCount: 0,
      firstCard: null,
      secondCard: null,
    };
    this.checkForMatch = this.checkForMatch.bind(this);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  initializeGame() {
    const symbols = this.symbols.concat(this.symbols);
    this.shuffleArray(symbols);
    const cards = symbols.map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false,
    }));
    this.setState({ cards });
  }

  handleCardClick(card) {
    const { flippedCount, firstCard, secondCard } = this.state;
    if (flippedCount === 0) {
      this.setState({
        firstCard: card,
        flippedCount: 1,
        cards: this.flipCard(this.state.cards, card),
      });
    } else if (flippedCount === 1) {
      this.setState({
        secondCard: card,
        flippedCount: 2,
        cards: this.flipCard(this.state.cards, card),
      });
      setTimeout(this.checkForMatch, 1000);
    }
  }

  flipCard(cards, cardToFlip) {
    return cards.map((card) => {
      if (card.id === cardToFlip.id) {
        return { ...card, isFlipped: true };
      }
      return card;
    });
  }

  checkForMatch() {
    const { firstCard, secondCard, cards } = this.state;
    if (firstCard.symbol === secondCard.symbol) {
      cards[firstCard.id].isMatched = true;
      cards[secondCard.id].isMatched = true;
    } else {
      cards[firstCard.id].isFlipped = false;
      cards[secondCard.id].isFlipped = false;
    }

    this.setState({
      cards,
      flippedCount: 0,
      firstCard: null,
      secondCard: null,
    });
  }

  restartGame() {
    this.initializeGame();
    this.setState({
      flippedCount: 0,
      firstCard: null,
      secondCard: null,
    });
  }

  componentDidMount() {
    this.initializeGame();
    this.drawCards();
  }

  drawCards() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    const cardWidth = 80;
    const cardHeight = 100;
    const padding = 10;
    const numRows = 4;
    const numCols = 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.state.cards.forEach((card, index) => {
      const row = Math.floor(index / numCols);
      const col = index % numCols;
      const x = col * (cardWidth + padding);
      const y = row * (cardHeight + padding);

      ctx.fillStyle = card.isFlipped ? '#fff' : '#007bff';
      ctx.fillRect(x, y, cardWidth, cardHeight);
      ctx.fillStyle = '#000';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (card.isFlipped || card.isMatched) {
        ctx.fillText(card.symbol, x + cardWidth / 2, y + cardHeight / 2);
      }
    });
  }

  componentDidUpdate() {
    this.drawCards();
  }

  render() {
    return (
      <div>
        <div>
          <h1>Memory Matching Game</h1>
          <button onClick={() => this.restartGame()}>Restart</button>
          <div style={{height: "30px"}}></div>
        </div>
        <canvas
          ref={this.canvasRef}
          width={350}
          height={430}
          style={{ border: '1px solid #000' }}
          onClick={(e) => this.handleCanvasClick(e)}
        ></canvas>
      </div>
    );
  }

  handleCanvasClick(e) {
    const canvas = this.canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cardWidth = 80;
    const cardHeight = 100;
    const padding = 10;
    const numRows = 4;
    const numCols = 4;

    const col = Math.floor(x / (cardWidth + padding));
    const row = Math.floor(y / (cardHeight + padding));
    const index = row * numCols + col;

    if (index >= 0 && index < this.state.cards.length) {
      const selectedCard = this.state.cards[index];
      if (!selectedCard.isFlipped && this.state.flippedCount < 2) {
        this.handleCardClick(selectedCard);
      }
    }
  }
}

export default App;
