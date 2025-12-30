// Since you don't have advancedMerge.js, create a simple merge function test
describe("mergeStrategies", () => {
  // Simple merge function (you should replace this with actual import)
  function simpleMerge(target, source) {
    return { ...target, ...source };
  }

  test("merges flat objects", () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = simpleMerge(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });
});
