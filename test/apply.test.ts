import { apply } from "../src";
import { testData } from "./test-data";

describe("apply", () => {
  testData.forEach(testCase => {
    test(testCase.name, done => {
      const actualCache = apply(testCase.patches, testCase.cacheBefore);
      expect(actualCache).toEqual(testCase.cacheAfter);
      done();
    });
  });
});
