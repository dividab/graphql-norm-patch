import * as test from "tape";
import { apply } from "../src";
import { testData } from "./test-data";

test("apply", t => {
  testData.forEach(testCase => {
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
