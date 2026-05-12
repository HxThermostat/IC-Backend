import {
  colorForBackground,
  displayableDecimalValueOfNumber,
  hasDecimalPlace,
} from "./display";

describe("colorForBackground", () => {
  const palette = {
    black: "#000",
    dark: "#181718",
    light: "#F1F1F1",
    tint: "#007AFF",
    white: "#FFF",
  };

  it("selects the lighter color for a dark background", () => {
    expect(colorForBackground("black", ["dark", "light"], palette)).toEqual(
      "light"
    );
    expect(colorForBackground("tint", ["dark", "light"], palette)).toEqual(
      "light"
    );
  });
  it("selects the darker color for a light background", () => {
    expect(colorForBackground("white", ["dark", "light"], palette)).toEqual(
      "dark"
    );
  });
});

describe("displayableDecimalValueOfNumber", () => {
  it("grabs the first, rounded decimal value of a number if present, and is used for displaying the actual decimal value in the UI", () => {
    const result = displayableDecimalValueOfNumber(54);
    const result2 = displayableDecimalValueOfNumber(54.0);
    const result3 = displayableDecimalValueOfNumber(54.1);
    const result4 = displayableDecimalValueOfNumber(54.24);
    const result5 = displayableDecimalValueOfNumber(54.58);
    const result6 = displayableDecimalValueOfNumber(54.99);
    const result7 = displayableDecimalValueOfNumber(0.42);
    const result8 = displayableDecimalValueOfNumber(0.02);
    const result9 = displayableDecimalValueOfNumber(0.08);
    const result10 = displayableDecimalValueOfNumber(-2.14);
    const result11 = displayableDecimalValueOfNumber(-14.84);
    const result12 = displayableDecimalValueOfNumber(undefined);

    expect(result).toBe(0);
    expect(result2).toBe(0);
    expect(result3).toBe(1);
    expect(result4).toBe(2);
    expect(result5).toBe(6);
    expect(result6).toBe(9);
    expect(result7).toBe(4);
    expect(result8).toBe(0);
    expect(result9).toBe(1);
    expect(result10).toBe(1);
    expect(result11).toBe(8);
    expect(result12).toBe(undefined);
  });
});

describe("hasDecimalPlace", () => {
  it("determines if there is a decimal value to display instead of the ° symbol", () => {
    const result = hasDecimalPlace(1);
    const result2 = hasDecimalPlace(0);
    const result3 = hasDecimalPlace(undefined);
    const result4 = hasDecimalPlace(5.0);

    const result5 = hasDecimalPlace(1.2);
    const result6 = hasDecimalPlace(1.2142);
    const result7 = hasDecimalPlace(0.24);
    const result8 = hasDecimalPlace(-2.24);

    expect(result).toEqual(false);
    expect(result2).toEqual(false);
    expect(result3).toEqual(false);
    expect(result4).toEqual(false);

    expect(result5).toEqual(true);
    expect(result6).toEqual(true);
    expect(result7).toEqual(true);
    expect(result8).toEqual(true);
  });
});
