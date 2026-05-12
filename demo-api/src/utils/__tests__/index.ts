import { findHalf, fToC, toFixed, toHalf } from "../";

describe("toHalf", () => {
  it("rounds up", () => {
    expect(toHalf(0.01)).toEqual(0.5);
    expect(toHalf(0.51)).toEqual(1);
    expect(toHalf(1.01)).toEqual(1.5);
  });

  it("doesn't adjust values already on the 0.5 boundary", () => {
    expect(toHalf(0)).toEqual(0);
    expect(toHalf(0.5)).toEqual(0.5);
    expect(toHalf(1)).toEqual(1);
  });
});

describe("findHalf", () => {
  it("matches the values set on the thermostat", () => {
    expect(toFixed(fToC(findHalf(99, "max")))).toEqual(37);
    expect(toFixed(fToC(findHalf(54, "min")))).toEqual(12.5);
    expect(toFixed(fToC(findHalf(90, "max")))).toEqual(32);
    expect(toFixed(fToC(findHalf(40, "min")))).toEqual(4.5);
    expect(toFixed(fToC(findHalf(2, "max", false), false))).toEqual(1);
  });
});
