import { createEntityTestData } from "./test-data/create-entity";
import { updateEntityTestData } from "./test-data/update-entity";
import { deleteEntityTestData } from "./test-data/delete-entity";
import { updateFieldTestData } from "./test-data/update-field";
import { insertElementTestData } from "./test-data/insert-element";
import { removeElementTestData } from "./test-data/remove-element";
import { removeEntityElementTestData } from "./test-data/remove-entity-element";

import { OneTest } from "./test-data/one-test";

export const testData: ReadonlyArray<OneTest> = [
  ...createEntityTestData,
  ...updateEntityTestData,
  ...deleteEntityTestData,
  ...updateFieldTestData,
  ...insertElementTestData,
  ...removeElementTestData,
  ...removeEntityElementTestData
];
