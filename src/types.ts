// Het aantal ogen op één dobbelsteen.
export type Face = 1 | 2 | 3 | 4 | 5 | 6;

// Eén worp met alle dobbelstenen tegelijk.
export interface Roll {
  id: number;
  values: Face[];
  sum: number;
}
