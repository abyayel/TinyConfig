const { mergeConfigs, mergeWithStrategy } = require("../src/index");

describe("Merging Logic", () => {
  test("mergeConfigs merges with correct priority", () => {
    const sources = {
      env: { port: 3001 },
      yaml: { port: 3002, name: "YAML" },
      json: { port: 3003, host: "localhost" },
    };

    const result = mergeConfigs(sources, ["env", "yaml", "json"]);
    expect(result.port).toBe(3001); // env should win
    expect(result.name).toBe("YAML");
    expect(result.host).toBe("localhost");
  });

  test("mergeWithStrategy with shallow-merge", () => {
    const target = { a: 1, b: { x: 1 } };
    const source = { a: 2, b: { y: 2 } };

    const result = mergeWithStrategy(target, source, "shallow-merge");
    expect(result.a).toBe(2);
    expect(result.b).toEqual({ y: 2 }); // Should replace, not merge
  });

  test("mergeWithStrategy with merge-deep", () => {
    const target = { a: 1, b: { x: 1, y: 1 } };
    const source = { b: { y: 2, z: 2 } };

    const result = mergeWithStrategy(target, source, "merge-deep");
    expect(result.b.x).toBe(1); // From target
    expect(result.b.y).toBe(2); // Overridden by source
    expect(result.b.z).toBe(2); // From source
  });
});
