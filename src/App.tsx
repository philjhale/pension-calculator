import { useCallback, useEffect, useState } from 'react';
import { calculatePensionProjection } from './calculator/calculatePensionProjection';
import {
  DEFAULT_ANNUITY_RATE_PERCENTAGE,
  DEFAULT_PENSION_CHARGES_PERCENTAGE,
  MIN_RETIREMENT_AGE,
} from './calculator/constants';
import type { PensionProjectionInputs } from './calculator/types';
import { AnnuityRateField } from './components/AnnuityRateField';
import { AssumptionsSection } from './components/AssumptionsSection';
import { ContributionField } from './components/ContributionField';
import { GrowthRateSlider } from './components/GrowthRateSlider';
import { NumberField } from './components/NumberField';
import { OutputsSummary } from './components/OutputsSummary';
import { PensionChargesField } from './components/PensionChargesField';
import { SnapshotTable } from './components/SnapshotTable';
import { loadInputs, saveInputs } from './config/storage';
import { generatePresetSnapshots } from './snapshot/presets';
import { loadSnapshots, saveSnapshots } from './snapshot/storage';
import type { Snapshot } from './snapshot/types';

const DEFAULT_INPUTS: PensionProjectionInputs = {
  currentAge: 30,
  retirementAge: 68,
  statePensionEnabled: true,
  lumpSumPercentage: 25,
  growthRatePercentage: 5,
  currentPot: 20000,
  yourContributionPercentage: 5,
  employerContributionPercentage: 3,
  salary: 35000,
  inflationRatePercentage: 2.6,
  pensionChargesPercentage: DEFAULT_PENSION_CHARGES_PERCENTAGE,
  annuityRatePercentage: DEFAULT_ANNUITY_RATE_PERCENTAGE,
};

function App() {
  const [inputs, setInputs] = useState<PensionProjectionInputs>(
    () => ({ ...DEFAULT_INPUTS, ...loadInputs() }),
  );
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => loadSnapshots());
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const outputs = calculatePensionProjection(inputs);

  useEffect(() => {
    saveInputs(inputs);
  }, [inputs]);

  useEffect(() => {
    saveSnapshots(snapshots);
  }, [snapshots]);

  function updateInput<Key extends keyof PensionProjectionInputs>(
    key: Key,
    value: PensionProjectionInputs[Key],
  ) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  function saveSnapshot() {
    const label =
      snapshotLabel.trim() || `Snapshot ${String(snapshots.length + 1)}`;
    const snapshot: Snapshot = {
      id: crypto.randomUUID(),
      label,
      inputs,
      outputs,
    };
    setSnapshots((current) => [...current, snapshot]);
    setSnapshotLabel('');
  }

  const removeSnapshot = useCallback((id: string) => {
    setSnapshots((current) => current.filter((snapshot) => snapshot.id !== id));
  }, []);

  function generatePresets() {
    setSnapshots((current) => [...current, ...generatePresetSnapshots(inputs)]);
  }

  return (
    <>
      <main>
        <h1>Pension Calculator</h1>

        <form>
          <NumberField
            id="current-age"
            label="Current Age"
            min={16}
            max={100}
            value={inputs.currentAge}
            onChange={(value) => {
              updateInput('currentAge', value);
            }}
          />

          <NumberField
            id="retirement-age"
            label="Retirement Age"
            min={MIN_RETIREMENT_AGE}
            max={100}
            value={inputs.retirementAge}
            onChange={(value) => {
              updateInput('retirementAge', value);
            }}
          />

          <div className="field field-checkbox">
            <label htmlFor="state-pension">
              <input
                id="state-pension"
                type="checkbox"
                checked={inputs.statePensionEnabled}
                onChange={(event) => {
                  updateInput('statePensionEnabled', event.target.checked);
                }}
              />
              I&apos;ll receive the State Pension
            </label>
          </div>

          <NumberField
            id="lump-sum"
            label="Lump Sum (%, capped at 25)"
            min={0}
            max={25}
            value={inputs.lumpSumPercentage}
            onChange={(value) => {
              updateInput('lumpSumPercentage', value);
            }}
          />

          <GrowthRateSlider
            value={inputs.growthRatePercentage}
            onChange={(value) => {
              updateInput('growthRatePercentage', value);
            }}
          />

          <NumberField
            id="current-pot"
            label="Current Pension Pot (£)"
            min={0}
            value={inputs.currentPot}
            onChange={(value) => {
              updateInput('currentPot', value);
            }}
          />

          <NumberField
            id="salary"
            label="Salary (£/yr)"
            min={0}
            value={inputs.salary}
            onChange={(value) => {
              updateInput('salary', value);
            }}
          />

          <ContributionField
            id="your-contribution"
            label="Your Contribution"
            percentage={inputs.yourContributionPercentage}
            salary={inputs.salary}
            onChange={(value) => {
              updateInput('yourContributionPercentage', value);
            }}
          />

          <ContributionField
            id="employer-contribution"
            label="Employer Contribution"
            percentage={inputs.employerContributionPercentage}
            salary={inputs.salary}
            onChange={(value) => {
              updateInput('employerContributionPercentage', value);
            }}
          />

          <NumberField
            id="inflation-rate"
            label="Inflation Rate (%)"
            min={0}
            step={0.1}
            value={inputs.inflationRatePercentage}
            onChange={(value) => {
              updateInput('inflationRatePercentage', value);
            }}
          />

          <PensionChargesField
            value={inputs.pensionChargesPercentage}
            onChange={(value) => {
              updateInput('pensionChargesPercentage', value);
            }}
          />

          <AnnuityRateField
            value={inputs.annuityRatePercentage}
            onChange={(value) => {
              updateInput('annuityRatePercentage', value);
            }}
          />
        </form>

        <OutputsSummary outputs={outputs} />

        <AssumptionsSection
          annuityRatePercentage={inputs.annuityRatePercentage}
        />
      </main>

      <section className="snapshots">
        <div className="snapshots-header">
          <h2>Snapshots</h2>
          <div className="field snapshot-save">
            <label htmlFor="snapshot-label">Label</label>
            <input
              id="snapshot-label"
              type="text"
              placeholder={`Snapshot ${String(snapshots.length + 1)}`}
              value={snapshotLabel}
              onChange={(event) => {
                setSnapshotLabel(event.target.value);
              }}
            />
            <button type="button" onClick={saveSnapshot}>
              Save Snapshot
            </button>
            <button type="button" onClick={generatePresets}>
              Generate Presets
            </button>
          </div>
        </div>
        <SnapshotTable
          snapshots={snapshots}
          onRemove={removeSnapshot}
          onReorder={setSnapshots}
        />
      </section>
    </>
  );
}

export default App;
