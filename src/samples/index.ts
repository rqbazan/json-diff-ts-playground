import { createListCollection } from "@chakra-ui/react";
import type { createSample } from "./create-sample";
import { simpleSample } from "./simple";
import { withObjectArraySample } from "./with-object-array";
import { withPrimitiveArraySample } from "./with-primitive-array";

type Sample = ReturnType<typeof createSample>;

export const SAMPLE_ID = {
  SIMPLE: "simple" as const,
  WITH_PRIMITIVE_ARRAY: "with_primitive_array" as const,
  WITH_OBJECT_ARRAY: "with_object_array" as const,
};

export type SampleId = (typeof SAMPLE_ID)[keyof typeof SAMPLE_ID];

export const samples: Record<SampleId, Sample> = {
  [SAMPLE_ID.SIMPLE]: simpleSample,
  [SAMPLE_ID.WITH_PRIMITIVE_ARRAY]: withPrimitiveArraySample,
  [SAMPLE_ID.WITH_OBJECT_ARRAY]: withObjectArraySample,
};

export const sampleCollection = createListCollection({
  items: [
    { label: "Simple Sample", value: SAMPLE_ID.SIMPLE },
    { label: "With Primitive Array", value: SAMPLE_ID.WITH_PRIMITIVE_ARRAY },
    { label: "With Object Array", value: SAMPLE_ID.WITH_OBJECT_ARRAY },
  ],
});
