const canvas = document.querySelector("canvas");
// "context" means having tools to draw on canvas
const c = canvas.getContext("2d");

// customize width and height
canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
  static width = 40;
  static height = 40;
  // pass an object so we don't have to memorize order or variables
  constructor({ position }) {
    this.position = position;
    // we want baundaries to be squares
    this.width = 40;
    this.height = 40;
  }

  draw() {
    // draw a rectangle
    // first style it, then draw
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// let's do the mapping
const map = [
  ["-", "-", "-", "-", "-", "-"],
  ["-", " ", " ", " ", " ", "-"],
  ["-", " ", "-", "-", " ", "-"],
  ["-", " ", " ", " ", " ", "-"],
  ["-", "-", "-", "-", "-", "-"],
];
const boundaries = [];

// i = row index
// j = symbol index
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        // multiply the indexes to set coordinates
        boundaries.push(
          new Boundary({
            position: {
              // symbol index with width
              x: Boundary.width * j,
              // row index with height
              y: Boundary.height * i,
            },
          })
        );
        break;
    }
  });
});

boundaries.forEach((boundary) => {
  boundary.draw();
});
