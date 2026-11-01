export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  setKeys?: (codes: string[]) => void;
  getX?: () => number;
  getY?: () => number;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}
