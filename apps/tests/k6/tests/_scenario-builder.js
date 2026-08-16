/**
 * Shared `k6 scenarios` builders — load.js, stress.js and spike.js all
 * need "run these exec names as ramping-vus with these stages", just
 * with different stage shapes; soak.js needs the constant-vus
 * equivalent. One place for the executor wiring instead of four.
 */

export function rampingScenarios(execNames, stages) {
  const scenarios = {};
  for (const name of execNames) {
    scenarios[name] = {
      executor: 'ramping-vus',
      exec: name,
      startVUs: 0,
      stages,
      tags: { domain: name },
    };
  }
  return scenarios;
}

export function constantScenarios(execNames, { vus, duration }) {
  const scenarios = {};
  for (const name of execNames) {
    scenarios[name] = {
      executor: 'constant-vus',
      exec: name,
      vus,
      duration,
      tags: { domain: name },
    };
  }
  return scenarios;
}
