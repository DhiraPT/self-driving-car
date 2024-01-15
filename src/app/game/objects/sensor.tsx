import { Bodies, Body } from "matter-js";

class Sensor {
  body: Body;
  private colorA: string = "#FFFF00";
  private colorB: string = "#FFFFFF";
  depth: number = 0;

  constructor(
    x: number,
    y: number,
    width: number,
    length: number,
    angle: number,
  ) {
    this.body = Bodies.rectangle(x, y, width, length, {
      isSensor: true,
      angle: angle,
      render: { fillStyle: this.colorA },
    });
  }

  switchColorA() {
    this.body.render.fillStyle = this.colorA;
  }

  switchColorB() {
    this.body.render.fillStyle = this.colorB;
  }

  setDepth(depth: number) {
    this.depth = depth;
  }
}

export default Sensor;
