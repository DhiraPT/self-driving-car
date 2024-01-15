class Layer {
  private inputLength: number;
  private outputLength: number;
  private weights: number[][];

  constructor(inputLength: number, outputLength: number) {
    this.inputLength = inputLength;
    this.outputLength = outputLength;
    this.weights = Array.from({ length: outputLength }, () =>
      Array.from({ length: inputLength }, () => Math.random()),
    );
  }

  feedForward(inputs: number[]) {
    const output = Array(this.outputLength).fill(0);
    for (let i = 0; i < this.outputLength; i++) {
      for (let j = 0; j < this.inputLength; j++) {
        output[i] += this.weights[i][j] * inputs[j];
      }
      // output[i] += this.bias[i];
      output[i] = this.sigmoid(output[i]);
    }
    return output;
  }

  sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
}

export default Layer;
