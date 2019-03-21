class AudioController {
  constructor() {
    this.backgroundMusic = new Audio("Audio/bg.mp3");
    this.flipSound = new Audio("Audio/flip.wav");
    this.gameOverSound = new Audio("Audio/gameOver.wav");
    this.matchSound = new Audio("Audio/match.wav");
    this.victorySound = new Audio("Audio/victory.wav");
    this.backgroundMusic.loop = true;
  }
  BGMusic() {
    this.backgroundMusic.play();
  }
  stopMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0; //sets the background music to play from beginning
  }
  flip() {
    this.flipSound.play();
  }
  gameOver() {
    this.gameOverSound.play();
    this.stopMusic();
  }
  match() {
    this.matchSound.play();
  }
  win() {
    this.victorySound.play();
  }
}

class MatchTheCards {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.remainingTime = totalTime;
    this.timer = document.getElementById("time");
    this.flips = document.getElementById("flips");
    this.audioController = new AudioController();
  }

  startGame() {
    this.cardsToCheck = null;
    this.totalClicks = 0;
    this.remainingTime = this.totalTime;
    this.matchCards = [];
    this.busy = true;

    //starts every processing after 0.5 secs
    setTimeout(() => {
      this.shuffleCards();
      this.audioController.BGMusic();
      this.countDown = this.startCount();
      this.busy = false;
    }, 500);

    this.hideCards();
    this.timer.innerText = this.remainingTime;
    this.flips.innerText = this.totalClicks;
  }

  hideCards() {
    this.cardsArray.forEach(cardItem => {
      cardItem.classList.remove("visible");
      cardItem.classList.remove("matched");
    });
  }

  //decreases the timer from 100 sec to 0 sec by 1 sec
  startCount() {
    return setInterval(() => {
      this.remainingTime--;
      this.timer.innerText = this.remainingTime;

      if (this.remainingTime == 0) {
        this.gameOver();
      }
    }, 1000);
  }

  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById("game-over-text").classList.add("visible");
  }

  win() {
    clearInterval(this.countDown);
    this.audioController.win();
    document.getElementById("won-text").classList.add("visible");
    this.audioController.stopMusic();
    this.hideCards();
  }

  flipCard(cardItem) {
    if (this.isFlipCardAllowed(cardItem)) {
      this.audioController.flip();
      this.totalClicks++; //increase the totalClicks made
      cardItem.classList.add("visible");
      this.flips.innerText = this.totalClicks; //display the clicks made

      //check for the cards matching when they are flipped
      if (this.cardsToCheck) {
        this.cardMatchCheck(cardItem);
      } else {
        this.cardsToCheck = cardItem;
      }
    }
  }

  cardMatchCheck(cardItem) {
    if (this.getType(cardItem) === this.getType(this.cardsToCheck)) {
      this.cardMatch(cardItem, this.cardsToCheck);
    } else {
      this.cardMisMatch(cardItem, this.cardsToCheck);
    }

    this.cardsToCheck = null;
  }

  cardMatch(card1, card2) {
    this.matchCards.push(card1);
    this.matchCards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.audioController.match();

    //check for victory
    if (this.cardsArray.length === this.matchCards.length) {
      this.win();
    }
  }

  cardMisMatch(card1, card2) {
    this.busy = true;
    setInterval(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }

  //get the images name of two cards for matching
  getType(cardItem) {
    return cardItem.getElementsByClassName("card-value")[0].src;
  }

  shuffleCards() {
    for (var i = this.cardsArray.length - 1; i > 0; i--) {
      var randomNumber = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randomNumber].style.order = i;
      this.cardsArray[i].style.order = randomNumber;
    }
  }

  isFlipCardAllowed(cardItem) {
    return (
      !this.busy &&
      !this.matchCards.includes(cardItem) &&
      cardItem !== this.cardsToCheck
    );
  }
}

function ready() {
  var overlays = Array.from(document.getElementsByClassName("start-text"));
  var cards = Array.from(document.getElementsByClassName("card"));

  var game = new MatchTheCards(100, cards);

  //removing starting overlay text
  overlays.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.remove("visible");
      game.startGame();
    });
  });

  cards.forEach(cardItem => {
    cardItem.addEventListener("click", () => {
      game.flipCard(cardItem);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready());
} else {
  ready();
}
