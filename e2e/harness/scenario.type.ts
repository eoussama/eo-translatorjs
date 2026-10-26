export type TScenarioContext = {
  readonly el: HTMLElement;
  readonly log: (msg: string) => void;
  readonly setStatus: (value: string) => void;
};

export type TScenario = {
  readonly id: string;
  readonly run: (ctx: TScenarioContext) => Promise<void>;
};
