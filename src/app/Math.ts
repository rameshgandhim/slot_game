export interface ReelBand {
  name: string
  readonly Band: string[]
}

export interface ComboList {
  SymbolList: string[]
  win: number
  Group: number
}

export interface PayLine {
  ReelIndex: number
  SymolIndex: number
}

export interface PayLineList {
  PayLineId: string
  PayLines: PayLine[]
}

export interface Config {
  ReelHeight: number
}
export interface SlotMath {
  SymbolList: string[]
  Config: Config
  readonly ReelBands: ReelBand[]
  ComboList: ComboList[]
  PayLineList: PayLineList[]
}
