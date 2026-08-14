import type { PensionProjectionInputs, PensionProjectionOutputs } from '../calculator/types';

export interface Snapshot {
  id: string;
  label: string;
  inputs: PensionProjectionInputs;
  outputs: PensionProjectionOutputs;
}
