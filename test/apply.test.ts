import { apply } from "../src";
import { testData } from "./test-data";

describe("apply", () => {
  testData.forEach(testCase => {
    test(testCase.name, done => {
      const [actualCache, actualStale] = apply(
        testCase.patches,
        testCase.cacheBefore,
        testCase.staleBefore || {}
      );
      expect(actualCache).toEqual(testCase.cacheAfter);
      expect(actualStale).toEqual(testCase.staleAfter || {});
      done();
    });
  });
});
