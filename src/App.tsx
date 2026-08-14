import { useEffect, useState } from 'react';
import { calculatePensionProjection } from './calculator/calculatePensionProjection';
import type { PensionProjectionInputs } from './calculator/types';
import { AssumptionsSection } from './components/AssumptionsSection';
import { ContributionField } from './components/ContributionField';
import { GrowthRateSlider } from './components/GrowthRateSlider';
import { OutputsSummary } from './components/OutputsSummary';
import { SnapshotTable } from './components/SnapshotTable';
import { parseNumberInput } from './format';
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
};

function App() {
  const [inputs, setInputs] = useState<PensionProjectionInputs>(DEFAULT_INPUTS);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => loadSnapshots());
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const outputs = calculatePensionProjection(inputs);

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
    const label = snapshotLabel.trim() || `Scenario ${String(snapshots.length + 1)}`;
    const snapshot: Snapshot = {
      id: crypto.randomUUID(),
      label,
      inputs,
      outputs,
    };
    setSnapshots((current) => [...current, snapshot]);
    setSnapshotLabel('');
  }

  function removeSnapshot(id: string) {
    setSnapshots((current) => current.filter((snapshot) => snapshot.id !== id));
  }

  return (
    <main>
      <h1>Pension Calculator</h1>

      <form>
        <div className="field">
          <label htmlFor="current-age">Current Age</label>
          <input
            id="current-age"
            type="number"
            min={16}
            max={100}
            value={inputs.currentAge}
            onChange={(event) => {
              updateInput('currentAge', parseNumberInput(event.target.value));
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="retirement-age">Retirement Age</label>
          <input
            id="retirement-age"
            type="number"
            min={16}
            max={100}
            value={inputs.retirementAge}
            onChange={(event) => {
              updateInput('retirementAge', parseNumberInput(event.target.value));
            }}
          />
        </div>

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

        <div className="field">
          <label htmlFor="lump-sum">Lump Sum (%, capped at 25)</label>
          <input
            id="lump-sum"
            type="number"
            min={0}
            max={25}
            value={inputs.lumpSumPercentage}
            onChange={(event) => {
              updateInput('lumpSumPercentage', parseNumberInput(event.target.value));
            }}
          />
        </div>

        <GrowthRateSlider
          value={inputs.growthRatePercentage}
          onChange={(value) => {
            updateInput('growthRatePercentage', value);
          }}
        />

        <div className="field">
          <label htmlFor="current-pot">Current Pension Pot (£)</label>
          <input
            id="current-pot"
            type="number"
            min={0}
            value={inputs.currentPot}
            onChange={(event) => {
              updateInput('currentPot', parseNumberInput(event.target.value));
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="salary">Salary (£/yr)</label>
          <input
            id="salary"
            type="number"
            min={0}
            value={inputs.salary}
            onChange={(event) => {
              updateInput('salary', parseNumberInput(event.target.value));
            }}
          />
        </div>

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

        <div className="field">
          <label htmlFor="inflation-rate">Inflation Rate (%)</label>
          <input
            id="inflation-rate"
            type="number"
            min={0}
            step={0.1}
            value={inputs.inflationRatePercentage}
            onChange={(event) => {
              updateInput('inflationRatePercentage', parseNumberInput(event.target.value));
            }}
          />
        </div>
      </form>

      <OutputsSummary outputs={outputs} />

      <AssumptionsSection />

      <section className="snapshots">
        <h2>Snapshots</h2>
        <div className="field snapshot-save">
          <label htmlFor="snapshot-label">Label</label>
          <input
            id="snapshot-label"
            type="text"
            placeholder={`Scenario ${String(snapshots.length + 1)}`}
            value={snapshotLabel}
            onChange={(event) => {
              setSnapshotLabel(event.target.value);
            }}
          />
          <button type="button" onClick={saveSnapshot}>
            Save Snapshot
          </button>
        </div>
        <SnapshotTable snapshots={snapshots} onRemove={removeSnapshot} />
      </section>
    </main>
  );
}

export default App;
