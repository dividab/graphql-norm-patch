import * as test from "tape";
import { apply } from "../src";
import { testData } from "./test-data";

test("apply", t => {
  const tests = testData.some(t3 => !!t3.only)
    ? testData.filter(t2 => t2.only)
    : testData;
  tests.forEach(testCase => {
    t.test(testCase.name, st => {
      const [actualCache, actualStale] = apply(
        testCase.patches,
        testCase.cacheBefore,
        testCase.staleBefore || {}
      );
      st.deepEqual(actualCache, testCase.cacheAfter);
      st.deepEqual(actualStale, testCase.staleAfter || {});
      st.end();
    });
  });
});
