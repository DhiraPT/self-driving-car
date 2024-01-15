import {
  Bodies,
  Body,
  Collision,
  Composite,
  Constraint,
  Engine,
  Events,
  Vector,
} from "matter-js";
import Sensor from "./sensor";
import Brain from "../neural-network/brain";

class Car {
  body: Body;
  mainBody: Body;
  private forceMagnitude: number = 0.01;
  private angularSpeed: number = 0.01;
  private maxSpeed: number = 10;
  private sensors: Sensor[] = [];
  private brain: Brain;
  damaged: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    restitution: number,
  ) {
    this.mainBody = Bodies.rectangle(x, y, width, height, {
      restitution,
      angle: Math.PI / 2,
    });

    for (let i = -2; i <= 2; i++) {
      const sensorX = x + 40 * Math.cos((i * Math.PI) / 6);
      const sensorY = y + 40 * Math.sin((i * Math.PI) / 6);
      this.sensors.push(
        new Sensor(sensorX, sensorY, 2, 80, Math.PI / 2 + (i * Math.PI) / 6),
      );
    }

    this.body = Body.create({
      parts: [this.mainBody, ...this.sensors.map((s) => s.body)],
    });
    Body.setMass(this.body, 20);
    this.body.frictionAir = 0.01;

    this.brain = new Brain(5, 4);
  }

  addToWorld(world: Matter.World) {
    Composite.add(world, this.body);
  }

  containsSensor(body: Body): boolean {
    return this.sensors.map((s) => s.body).includes(body);
  }

  getSensor(body: Body): Sensor | undefined {
    return this.sensors.find((s) => s.body === body);
  }

  calculateForce(): Vector {
    return Vector.create(
      Math.cos(this.body.angle) * this.forceMagnitude,
      Math.sin(this.body.angle) * this.forceMagnitude,
    );
  }

  moveForward() {
    Body.applyForce(this.body, this.body.position, this.calculateForce());
    if (this.body.speed > this.maxSpeed) {
      Body.setVelocity(
        this.body,
        Vector.mult(Vector.normalise(this.body.velocity), this.maxSpeed),
      );
    }
  }

  moveBackwards() {
    Body.applyForce(
      this.body,
      this.body.position,
      Vector.neg(this.calculateForce()),
    );
    if (this.body.speed > this.maxSpeed) {
      Body.setVelocity(
        this.body,
        Vector.mult(Vector.normalise(this.body.velocity), this.maxSpeed),
      );
    }
  }

  steerLeft() {
    const flip =
      Vector.dot(
        this.body.velocity,
        Vector.create(Math.cos(this.body.angle), Math.sin(this.body.angle)),
      ) > 0
        ? -1
        : 1;
    Body.setAngularVelocity(this.body, flip * this.angularSpeed);
  }

  steerRight() {
    const flip =
      Vector.dot(
        this.body.velocity,
        Vector.create(Math.cos(this.body.angle), Math.sin(this.body.angle)),
      ) > 0
        ? 1
        : -1;
    Body.setAngularVelocity(this.body, flip * this.angularSpeed);
  }

  steerStraight() {
    Body.setAngularVelocity(this.body, 0);
  }

  update() {
    const inputs = this.sensors.map((s) => 2 * (0.5 - s.depth));
    const outputs = this.brain.feedForward(inputs);
    if (outputs[0] > 0.5 && outputs[0] > outputs[1]) {
      this.moveForward();
    } else if (outputs[1] > 0.5) {
      this.moveBackwards();
    }
    if (outputs[2] > 0.5 && outputs[2] > outputs[3]) {
      this.steerLeft();
    } else if (outputs[3] > 0.5) {
      this.steerRight();
    } else {
      this.steerStraight();
    }
  }
}

export default Car;
