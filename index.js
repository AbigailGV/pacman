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
  constructor({ position, image }) {
    this.position = position;
    // we want baundaries to be squares
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  draw() {
    // draw a rectangle
    // first style it, then draw it
    // c.fillStyle = "blue";
    // fillRect() draws and paints directly, doesn't need method fill()
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draw image
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Player {
  constructor({ position, direction }) {
    this.position = position;
    this.direction = direction;
    this.radius = 15;
  }

  draw() {
    // begin to draw this specific drawing
    c.beginPath();
    // tells that the path is going to be a circle
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    // first style it, then fill it
    c.fillStyle = "yellow";
    // arc() does need method fill()
    c.fill();
    // end of this specific drawing
    c.closePath();
  }

  // adding direction to position
  update() {
    this.draw();
    this.position.y += this.direction.y;
    this.position.x += this.direction.x;
  }
}

const boundaries = [];
const player = new Player({
  position: {
    // position where there aren't boundaries
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  direction: {
    x: 0,
    y: 0,
  },
});

// to track last key pressed so if we press 'w' + 'd' at the same time, we can go to 'd' direction since is the last key pressed
let lastKey = "";

// track which key is pressed
const keys = {
  a: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
};
// alt + shift to select multiple lines
const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

function createImage(src) {
  // javascript way to create images
  const image = new Image();
  // image property
  image.src = src;
  return image;
}
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
            image: createImage("./img/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorBottom.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeConnectorLeft.png"),
          })
        );
        break;
    }
  });
});

function circleCollidesRectangle({ circle, rectangle }) {
  // add collison detectors
  // first is verify the top, then the right, then the bottom and finally left side of player (circle)
  // we add the "direction" so the pacman doesn't touches the boundary and leaves a margin of space so it wouldn't stop
  return (
    circle.position.y - circle.radius + circle.direction.y <=
      rectangle.position.y + rectangle.height &&
    circle.position.x + circle.radius + circle.direction.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.direction.y >=
      rectangle.position.y &&
    circle.position.x - circle.radius + circle.direction.x <=
      rectangle.position.x + rectangle.width
  );
}

//  function that calls itself to create animation loop
function animate() {
  // calls function again in the next animation frame
  requestAnimationFrame(animate);
  // clears all canvas and reset position
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            // spread operator: take all properties of object "player" and copy them in this new object
            ...player,
            // then overrides the "direction" property
            direction: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        // if there's collision then don´t move
        player.direction.y = 0;
        break;
      } else {
        // otherwise, move it upwards
        player.direction.y = -5;
      }
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            ...player,
            direction: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        player.direction.x = 0;
        break;
      } else {
        player.direction.x = -5;
      }
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            ...player,
            direction: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        player.direction.y = 0;
        break;
      } else {
        player.direction.y = 5;
      }
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            ...player,
            direction: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        player.direction.x = 0;
        break;
      } else {
        player.direction.x = 5;
      }
    }
  }
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      circleCollidesRectangle({
        circle: player,
        rectangle: boundary,
      })
    ) {
      // set to 0 so the pacman stop moving
      player.direction.x = 0;
      player.direction.y = 0;
    }
  });
  player.update();
}

animate();

// it's {key} because we need the key property of the object "event"
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});
addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
