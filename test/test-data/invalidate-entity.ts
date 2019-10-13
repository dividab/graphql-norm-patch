import { OneTest } from "./one-test";
import { invalidateEntity } from "../../src";

const testObj2 = { id: "obj2", names: ["foo", "bar"] };

export const invalidateEntityTestData: ReadonlyArray<OneTest> = [
  {
    name: "invalidateEntity recursive=false with shallow data",
    patches: [invalidateEntity("obj2", false)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: new Set(["id", "names"]) }
  },
  {
    name: "invalidateEntity recursive=true with shallow data",
    patches: [invalidateEntity("obj2", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: new Set(["id", "names"]) }
  },
  {
    name: "invalidateEntity recursive=false with deep data",
    patches: [invalidateEntity("myid", false)],
    cacheBefore: {
      myid: { id: "myid", prop: "obj:1" },
      "obj:1": { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      "NewsItemType:1": { id: 1, header: "olle" },
      "NewsItemType:2": { id: 2, header: "olle2" }
    },
    cacheAfter: {
      myid: { id: "myid", prop: "obj:1" },
      "obj:1": { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      "NewsItemType:1": { id: 1, header: "olle" },
      "NewsItemType:2": { id: 2, header: "olle2" }
    },
    staleBefore: {},
    staleAfter: { myid: new Set(["id", "prop"]) }
  },
  {
    name: "invalidateEntity recursive=true with deep data",
    patches: [invalidateEntity("myid", true)],
    cacheBefore: {
      myid: { id: "myid", prop: "obj:1" },
      "obj:1": { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      "NewsItemType:1": { id: 1, header: "olle" },
      "NewsItemType:2": { id: 2, header: "olle2" }
    },
    cacheAfter: {
      myid: { id: "myid", prop: "obj:1" },
      "obj:1": { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      "NewsItemType:1": { id: 1, header: "olle" },
      "NewsItemType:2": { id: 2, header: "olle2" }
    },
    staleBefore: {},
    staleAfter: {
      myid: new Set(["id", "prop"]),
      "obj:1": new Set(["id", "news"]),
      "NewsItemType:1": new Set(["id", "header"]),
      "NewsItemType:2": new Set(["id", "header"])
    }
  }
];
