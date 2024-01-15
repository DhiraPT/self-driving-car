import Layer from "./layer";

class Brain {
  private inputLength: number;
  private outputLength: number;
  private layers: Layer[] = [];

  constructor(inputLength: number, outputLength: number) {
    this.inputLength = inputLength;
    this.outputLength = outputLength;
    this.layers.push(new Layer(this.inputLength, 6));
    this.layers.push(new Layer(6, this.outputLength));
  }

  feedForward(inputs: number[]): number[] {
    for (const layer of this.layers) {
      inputs = layer.feedForward(inputs);
    }
    return inputs;
  }
}

export default Brain;
