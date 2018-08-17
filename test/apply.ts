import * as test from "tape";
import { apply } from "../src";
import { testData } from "./test-data";

test("apply", t => {
  testData.forEach(testCase => {
    t.test(testCase.name, st => {
      const cache = {};
      const [actualCache, actualStale] = apply(
        testCase.patches,
        cache,
        testCase.staleBefore || {}
      );
      st.deepEqual(actualCache, testCase.cacheAfter);
      st.deepEqual(actualStale, testCase.staleAfter || {});
      st.end();
    });
  });
});
