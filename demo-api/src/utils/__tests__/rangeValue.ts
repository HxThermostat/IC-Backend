import { fitInDualRange, fitInRange } from "../rangeValue";

describe("fitInRange", () => {
  describe("whole number steps", () => {
    const range = {
      max: 100,
      min: 0,
      step: 5,
    };

    test("it does nothing when the value is within the range", () => {
      const adjusted = fitInRange({ ...range, value: 45 });

      expect(adjusted).toEqual(45);
    });

    test("it brings a value up to the minimum", () => {
      const adjusted = fitInRange({ ...range, value: -10 });

      expect(adjusted).toEqual(range.min);
    });

    test("it brings a value down to the maximum", () => {
      const adjusted = fitInRange({ ...range, value: 110 });

      expect(adjusted).toEqual(range.max);
    });

    test("it adjusts a value to match the step", () => {
      const adjusted = fitInRange({ ...range, value: 52 });

      expect(adjusted).toEqual(50);
    });
  });

  describe("fractional steps", () => {
    const range = {
      max: 98.6,
      min: 54.5,
      step: 0.9,
    };

    test("it does nothing when the value is within the range", () => {
      const adjusted = fitInRange({ ...range, value: 68 });

      expect(adjusted).toEqual(68);
    });

    test("it adjusts a value to match the step", () => {
      const adjusted = fitInRange({ ...range, value: 68.5 });

      expect(adjusted).toEqual(68.9);
    });
  });
});

describe("fitInDualRange", () => {
  const range = {
    max: 100,
    min: 0,
    step: 5,
  };

  const minInterval = 10;

  test("it brings the upper value above the lower", () => {
    const [min, max] = fitInDualRange({
      lower: { ...range, value: 80 },
      upper: { ...range, value: 40 },
      minInterval,
    });

    expect(min).toEqual(80);
    expect(max).toEqual(90);
  });

  test("it brings the lower value within range", () => {
    const [min, max] = fitInDualRange({
      lower: { ...range, value: -10 },
      upper: { ...range, value: 40 },
      minInterval,
    });

    expect(min).toEqual(0);
    expect(max).toEqual(40);
  });

  test("it brings the upper value within range", () => {
    const [min, max] = fitInDualRange({
      lower: { ...range, value: 20 },
      upper: { ...range, value: 110 },
      minInterval,
    });

    expect(min).toEqual(20);
    expect(max).toEqual(100);
  });

  test("it adjusts the upper value when the lower is too close", () => {
    const [min, max] = fitInDualRange({
      lower: { ...range, value: 20 },
      upper: { ...range, value: 20 },
      minInterval,
    });

    expect(min).toEqual(20);
    expect(max).toEqual(30);
  });

  test("it doesn't push the upper value out of range", () => {
    const [min, max] = fitInDualRange({
      lower: { ...range, value: 100 },
      upper: { ...range, value: 100 },
      minInterval,
    });

    expect(min).toEqual(90);
    expect(max).toEqual(100);
  });
});
