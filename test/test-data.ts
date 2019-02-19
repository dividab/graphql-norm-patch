import { createEntityTestData } from "./test-data/create-entity";
import { deleteEntityTestData } from "./test-data/delete-entity";
import { updateFieldTestData } from "./test-data/update-field";
import { insertElementTestData } from "./test-data/insert-element";
import { removeElementTestData } from "./test-data/remove-element";
import { removeEntityElementTestData } from "./test-data/remove-entity-element";
import { invalidateEntityTestData } from "./test-data/invalidate-entity";
import { invalidateFieldTestData } from "./test-data/invalidate-field";

import { OneTest } from "./test-data/one-test";

export const testData: ReadonlyArray<OneTest> = [
  ...createEntityTestData,
  ...deleteEntityTestData,
  ...updateFieldTestData,
  ...insertElementTestData,
  ...removeElementTestData,
  ...removeEntityElementTestData,
  ...invalidateEntityTestData,
  ...invalidateFieldTestData
];
