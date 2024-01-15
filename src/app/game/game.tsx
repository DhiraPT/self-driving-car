"use client";

import Matter, { Composite, Engine, Events, Render, Runner } from "matter-js";
import { useEffect, useRef } from "react";
import Car from "./objects/car";
import RaceTrack from "./objects/race-track";

const GameComponent: React.FC = () => {
  const canvasRef = useRef(null);
  const width = 800;
  const height = 600;
  let keys = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  // Create a track
  const track = new RaceTrack(width, height);

  // Create a car
  const car = new Car(width / 2 - 20, 100, 24, 40, 0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create an engine
    const engine = Engine.create();
    engine.gravity.y = 0;

    // Create a renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        //showAngleIndicator: true,
      },
    });
    Render.run(render);

    // Create a runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add objects to the world
    track.addToWorld(engine.world);
    car.addToWorld(engine.world);

    Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;

      // change object colours to show those starting a collision
      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        if (track.containsPart(pair.bodyA) && pair.bodyB === car.mainBody) {
          console.log("Car collided with the track!");
          car.damaged = true;
          Composite.remove(engine.world, car.body);
        } else if (
          track.containsPart(pair.bodyA) &&
          car.containsSensor(pair.bodyB)
        ) {
          car.getSensor(pair.bodyB)!.switchColorB();
          console.log("Sensor collided with the track!");
        }
      }
    });

    Events.on(engine, "collisionEnd", (event) => {
      let pairs = event.pairs;

      // change object colours to show those starting a collision
      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        if (track.containsPart(pair.bodyA) && pair.bodyB === car.mainBody) {
          console.log("Car collided with the track!");
          car.damaged = true;
        } else if (
          track.containsPart(pair.bodyA) &&
          car.containsSensor(pair.bodyB)
        ) {
          const sensor = car.getSensor(pair.bodyB)!;
          sensor.switchColorA();
          console.log("Sensor collided with the track!");
          sensor.setDepth(pair.collision.depth);
        }
      }
    });

    const update = () => {
      if (!car.damaged) {
        // Add your car update logic here
        car.update();
        // Schedule the next update
        requestAnimationFrame(update);
      }
    };

    update();

    // Events.on(engine, 'collisionEnd', (event) => {
    //     let pairs = event.pairs;

    //     for (let i = 0; i < pairs.length; i++) {
    //         let pair = pairs[i];
    //         if (pair.bodyA === this.body) {
    //             pair.bodyB.render.strokeStyle = this.colorB;
    //         }
    //     }
    // });

    // add mouse control
    // const mouse = Mouse.create(render.canvas),
    //   mouseConstraint = MouseConstraint.create(engine, {
    //     mouse: mouse,
    //     constraint: {
    //       stiffness: 0.2,
    //       render: {
    //         visible: false
    //       }
    //     }
    //   });

    // Composite.add(engine.world, mouseConstraint);
    // render.mouse = mouse;

    // Add keyboard controls
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup on component unmount
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      // Remove event listeners
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // Empty dependency array to ensure useEffect runs once

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
        keys.up = true;
        break;
      case "ArrowDown":
        keys.down = true;
        break;
      case "ArrowLeft":
        keys.left = true;
        break;
      case "ArrowRight":
        keys.right = true;
        break;
      default:
        break;
    }
    if (keys.up) {
      car.moveForward();
    } else if (keys.down) {
      car.moveBackwards();
    }
    if (keys.left) {
      car.steerLeft();
    } else if (keys.right) {
      car.steerRight();
    } else {
      car.steerStraight();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
        keys.up = false;
        break;
      case "ArrowDown":
        keys.down = false;
        break;
      case "ArrowLeft":
        keys.left = false;
        break;
      case "ArrowRight":
        keys.right = false;
        break;
      default:
        break;
    }
  };

  return <canvas ref={canvasRef}></canvas>;
};

export default GameComponent;
