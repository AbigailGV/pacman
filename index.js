const canvas = document.querySelector("canvas");
// context game in 2d
const c = canvas.getContext("2d");

// customize width and height
canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundaries {
  // pass an object so we don't have to memorize order or variables
  constructor({ position }) {
    this.position = position;
    // we want baundaries to be squares
    this.width = 40;
    this.height = 40;
  }
}
