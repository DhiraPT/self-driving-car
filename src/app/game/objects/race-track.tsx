import Matter, { Bodies, Body, Composite, Vertices } from "matter-js";

class RaceTrack {
  barrier: Body;

  constructor(width: number, height: number) {
    this.barrier = this.createBarriers(width, height);
  }

  private createBarriers(width: number, height: number): Body {
    const inset = 180;
    const barrierWidth = 10;
    const outerBarriers = [
      Bodies.rectangle(width / 2, 0, width, barrierWidth, {
        isStatic: true,
      }), // Top
      Bodies.rectangle(width / 2, height, width, barrierWidth, {
        isStatic: true,
      }), // Bottom
      Bodies.rectangle(0, height / 2, barrierWidth, height, {
        isStatic: true,
      }), // Left
      Bodies.rectangle(width, height / 2, barrierWidth, height, {
        isStatic: true,
      }), // Right
    ];

    const innerBarriers = [
      Bodies.rectangle(width / 2, inset, width - 2 * inset, barrierWidth, {
        isStatic: true,
      }), // Top
      Bodies.rectangle(
        width / 2,
        height - inset,
        width - 2 * inset,
        barrierWidth,
        {
          isStatic: true,
        },
      ), // Bottom
      Bodies.rectangle(inset, height / 2, barrierWidth, height - 2 * inset, {
        isStatic: true,
      }), // Left
      Bodies.rectangle(
        width - inset,
        height / 2,
        barrierWidth,
        height - 2 * inset,
        {
          isStatic: true,
        },
      ), // Right
    ];

    return Body.create({
      parts: [...outerBarriers, ...innerBarriers],
      isStatic: true,
    });
  }

  addToWorld(world: Matter.World) {
    Composite.add(world, this.barrier);
  }

  containsPart(body: Body): boolean {
    return this.barrier.parts.includes(body);
  }
}

export default RaceTrack;
