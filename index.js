const canvas = document.querySelector("canvas");
// "context" means having tools to draw on canvas
const c = canvas.getContext("2d");
const scoreEle = document.querySelector("#scoreEle");

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
class Pellet {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}
class PowerUp {
  constructor({ position }) {
    this.position = position;
    this.radius = 8;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}
class Player {
  static speed = 4;
  constructor({ position, direction }) {
    this.position = position;
    this.direction = direction;
    this.radius = 15;
    // this is for open mouth
    this.radians = 0.75;
    this.openrate = 0.12;
    // rotation
    this.rotation = 0;
  }

  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    // begin to draw this specific drawing
    c.beginPath();
    // tells that the path is going to be a circle with the open mouth
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    // tells path to the open mouth
    c.lineTo(this.position.x, this.position.y);
    // first style it, then fill it
    c.fillStyle = "yellow";
    // arc() does need method fill()
    c.fill();
    // end of this specific drawing
    c.closePath();
    c.restore();
  }

  // adding direction to position and animating mouth
  update() {
    this.draw();
    this.position.y += this.direction.y;
    this.position.x += this.direction.x;

    // open and close mouth is it was eating
    if (this.radians < 0 || this.radians > 0.75) {
      this.openrate = -this.openrate;
    }

    this.radians += this.openrate;
  }
}
class Ghost {
  static speed = 2;
  constructor({ position, direction, color = "red" }) {
    this.position = position;
    this.direction = direction;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 2;
    this.isScared = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.isScared ? "blue" : this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.y += this.direction.y;
    this.position.x += this.direction.x;
  }
}

const boundaries = [];
const pellets = [];
const powerUps = [];
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
const ghosts = [
  new Ghost({
    position: {
      // close to player
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    direction: {
      x: Ghost.speed,
      y: 0,
    },
  }),
  new Ghost({
    position: {
      x: Boundary.width * 7 + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height / 2,
    },
    direction: {
      x: Ghost.speed,
      y: 0,
    },
    color: "pink",
  }),
  new Ghost({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height / 2,
    },
    direction: {
      x: Ghost.speed,
      y: 0,
    },
    color: "green",
  }),
  new Ghost({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    direction: {
      x: Ghost.speed,
      y: 0,
    },
    color: "orange",
  }),
];

// to track last key pressed so if we press 'w' + 'd' at the same time, we can go to 'd' direction since is the last key pressed
let lastKey = "";
// track score
let score = 0;

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
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
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
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
      case "p":
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
    }
  });
});

function circleCollidesRectangle({ circle, rectangle }) {
  // add padding so that circle collides correctly. Then substract 1 pixel so circle don't collide by default
  const padding = Boundary.width / 2 - circle.radius - 1;

  // add collison detectors
  // first is verify the top, then the right, then the bottom and finally left side of player (circle)
  // we add the "direction" so the pacman doesn't touches the boundary and leaves a margin of space so it wouldn't stop
  return (
    circle.position.y - circle.radius + circle.direction.y <=
      rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.direction.x >=
      rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.direction.y >=
      rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.direction.x <=
      rectangle.position.x + rectangle.width + padding
  );
}

let animationId;
//  function that calls itself to create animation loop
function animate() {
  // calls function again in the next animation frame
  // this method returns the id of the frame we are currenly on
  animationId = requestAnimationFrame(animate);
  // clears all canvas and reset position
  c.clearRect(0, 0, canvas.width, canvas.height);

  // player moves
  if (keys.w.pressed && lastKey === "w") {
    // we used for loops instead of forEach because we wanted to use "break"
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            // spread operator: take all properties of object "player" and copy them in this new object
            ...player,
            // then overrides the "direction" property
            direction: {
              x: 0,
              y: -Player.speed,
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
        player.direction.y = -Player.speed;
      }
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            ...player,
            direction: {
              x: -Player.speed,
              y: 0,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        player.direction.x = 0;
        break;
      } else {
        player.direction.x = -Player.speed;
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
              y: Player.speed,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        player.direction.y = 0;
        break;
      } else {
        player.direction.y = Player.speed;
      }
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      if (
        circleCollidesRectangle({
          circle: {
            ...player,
            direction: {
              x: Player.speed,
              y: 0,
            },
          },
          rectangle: boundaries[i],
        })
      ) {
        player.direction.x = 0;
        break;
      } else {
        player.direction.x = Player.speed;
      }
    }
  }
  // --------------RENDERING---------------

  // looping backwards to avoid awkward flashing on animation pellets
  for (let i = pellets.length - 1; i >= 0; i--) {
    const pellet = pellets[i];
    pellet.draw();
    if (
      // collision between circles (touching pellets)
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      // args: start deleting and how many
      pellets.splice(i, 1);
      // increase score
      score += 10;
      // innerHTML is a property
      scoreEle.innerHTML = score;
    }
  }

  // detect collision between ghost and player, and if the ghost is scared
  for (let i = ghosts.length - 1; i >= 0; i--) {
    const ghost = ghosts[i];
    if (
      // collision between circles (touching ghosts)
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      // if ghost is scared, then remove it from screen
      if (ghost.isScared) {
        ghosts.splice(i, 1);
      } else {
        // if it collides while ghost isn't scared then stop the frame
        cancelAnimationFrame(animationId);
        console.log("you lose");
      }
    }
  }

  // powerUps
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();
    if (
      // collision between circles (touching powerUps)
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(i, 1);

      // make ghosts scared
      ghosts.forEach((ghost) => {
        ghost.isScared = true;
        // so it lasts for 5 secs
        setTimeout(() => {
          ghost.isScared = false;
        }, 5000);
      });
    }
  }
  // boundaries
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      circleCollidesRectangle({
        circle: player,
        rectangle: boundary,
      })
    ) {
      // set to 0 so the pacman stop moving if it collides with boundary
      player.direction.x = 0;
      player.direction.y = 0;
    }
  });

  // update so the player can move
  player.update();

  // ghosts
  ghosts.forEach((ghost) => {
    // update so the ghosts can move
    ghost.update();

    // store actual collisions
    const collisions = [];
    // this is to track all the collisions the ghosts are making
    boundaries.forEach((boundary) => {
      // if there isn't the collision "right" already tracked and it's colliding, then add to track
      if (
        !collisions.includes("right") &&
        circleCollidesRectangle({
          circle: {
            ...ghost,
            direction: {
              x: ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }
      if (
        !collisions.includes("left") &&
        circleCollidesRectangle({
          circle: {
            ...ghost,
            direction: {
              x: -ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }
      if (
        !collisions.includes("up") &&
        circleCollidesRectangle({
          circle: {
            ...ghost,
            direction: {
              x: 0,
              y: -ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("up");
      }
      if (
        !collisions.includes("down") &&
        circleCollidesRectangle({
          circle: {
            ...ghost,
            direction: {
              x: 0,
              y: ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("down");
      }
    });
    // if "collisions" array has more collisions means that has less paths to follow as options
    // this is to update previous collisons
    if (collisions.length > ghost.prevCollisions) {
      ghost.prevCollisions = collisions;
    }
    // compare arrays by converting them to json
    // if they aren't the same, means that actual collisions has more collisions (because of the update we did before)
    // and we can compare so we can choose path to follow
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      // now we have to fill in the prevCollisions array with the directions available so we can set a path
      if (ghost.direction.x > 0) {
        ghost.prevCollisions.push("right");
      } else if (ghost.direction.x < 0) {
        ghost.prevCollisions.push("left");
      } else if (ghost.direction.y < 0) {
        ghost.prevCollisions.push("up");
      } else if (ghost.direction.y > 0) {
        ghost.prevCollisions.push("down");
      }
      // filter to get all collision that were there before but that they aren't there anymore
      // so we can know if there was a collision (and now isn't) so the ghost can go through that direction
      const pathways = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });
      // choose a randow way
      // we use Math.floor so it can round from 0 - #  and instead of getting a 0.5, we can get a 0
      const way = pathways[Math.floor(Math.random() * pathways.length)];

      // make the ghost move in the selected way
      switch (way) {
        case "right":
          ghost.direction.x = ghost.speed;
          ghost.direction.y = 0;
          break;
        case "left":
          ghost.direction.x = -ghost.speed;
          ghost.direction.y = 0;
          break;
        case "up":
          ghost.direction.x = 0;
          ghost.direction.y = -ghost.speed;
          break;
        case "down":
          ghost.direction.x = 0;
          ghost.direction.y = ghost.speed;
          break;
      }
      // reset collisions because we have a new way
      ghost.prevCollisions = [];
    }
  });
  // player rotation while going to specific direction
  if (player.direction.x > 0) {
    player.rotation = 0;
  } else if (player.direction.x < 0) {
    player.rotation = Math.PI;
  } else if (player.direction.y > 0) {
    player.rotation = Math.PI / 2;
  } else if (player.direction.y < 0) {
    player.rotation = Math.PI * 1.5;
  }
} // end of animate()

// call function to make everything work
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
