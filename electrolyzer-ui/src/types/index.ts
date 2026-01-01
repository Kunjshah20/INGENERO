export type ActionType = "repair" | "assemble";

export interface ElementPart {
  position: number;
  id: string;
  status?: ActionType;
  checklistCount?: number;
  disabled?: boolean;
}

export interface PartStatus {
  status: "Ready for Repair" | "Ready for Assemble" | string;
  count?: number;
}
