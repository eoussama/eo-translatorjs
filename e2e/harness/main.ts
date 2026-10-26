import type { TScenarioContext } from "./scenario.type";

import { SCENARIOS } from "./scenarios/index";



const outputEl = document.getElementById("output") as HTMLElement;
const statusEl = document.getElementById("status") as HTMLElement;
const logEl = document.getElementById("log") as HTMLElement;
const errorEl = document.getElementById("error") as HTMLElement;
const doneEl = document.getElementById("done") as HTMLElement;

function log(msg: string): void {
  const li = document.createElement("li");

  li.textContent = msg;
  logEl.appendChild(li);
}

function setStatus(value: string): void {
  statusEl.textContent = value;
}

async function run(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const scenarioId = params.get("scenario");

  if (!scenarioId) {
    errorEl.textContent = "No scenario specified. Use ?scenario=<id>";
    doneEl.textContent = "error";

    return;
  }

  const scenario = SCENARIOS.find(s => s.id === scenarioId);

  if (!scenario) {
    errorEl.textContent = `Unknown scenario: ${scenarioId}`;
    doneEl.textContent = "error";

    return;
  }

  const ctx: TScenarioContext = { el: outputEl, log, setStatus };

  try {
    await scenario.run(ctx);
    doneEl.textContent = "true";
  }
  catch (err) {
    errorEl.textContent = String(err);
    doneEl.textContent = "error";
  }
}

run();
