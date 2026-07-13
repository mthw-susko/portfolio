// Tiny external store connecting the project list (which knows the hovered
// project's color) to the fluid background canvas, which lives in the root
// layout and can't receive props from the page.

type Listener = () => void;

let hoverColor: string | null = null;
const listeners = new Set<Listener>();

export function setFluidHoverColor(color: string | null) {
  hoverColor = color;
  listeners.forEach((listener) => listener());
}

export function getFluidHoverColor() {
  return hoverColor;
}

export function subscribeFluidHoverColor(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
