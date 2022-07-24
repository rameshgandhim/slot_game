// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkArg(instance: any, arg: string, argType: string) {
  return instance && instance[arg] && typeof (instance[arg]) === argType;
}

export interface ITick {
  tick(delta?: number): void;
}

export interface IResizable {
  resize(width: number, height: number): void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTickable(arg: unknown): arg is ITick {
  return checkArg(arg, 'tick', 'function');
}
