import { Animation, Move, Rotate, Scale } from "remotion-animated";

function stringToReAnimated(str: string[]) {
  let animationArray: Animation[] = [];

  str.forEach((item) => {
    if (!item) return;

    const x = item.match(/x: *(-*\d+\.?\d?)/)?.[1] || 0;
    const y = item.match(/y: *(-*\d+\.?\d?)/)?.[1] || 0;
    const initialX = item.match(/initialX: *(-*\d+\.?\d?)/)?.[1] || 0;
    const initialY = item.match(/initialY: *(-*\d+\.?\d?)/)?.[1] || 0;
    const by = item.match(/by: *(-*\d+\.?\d?)/)?.[1] || 0;
    const degrees = item.match(/degrees: *(-*\d+\.?\d?)/)?.[1] || 0;
    const initial = item.match(/initial: *(-*\d+\.?\d?)/)?.[1] || 0;

    const start = item.match(/start: *(\d+\.?\d?)/)?.[1] || 0;
    const duration = item.match(/duration: *(\d+\.?\d?)/)?.[1] || 0;
    const mass = item.match(/mass: *(\d+\.?\d?)/)?.[1] || 0;
    const damping = item.match(/damping: *(\d+\.?\d?)/)?.[1] || 0;
    const stiffness = item.match(/stiffness: *(\d+\.?\d?)/)?.[1] || 0;
    const overshootClamping =
      item.match(/overshootClamping: *(true|false)/)?.[1] || false;

    const springOptions = {
      ...(!!mass && { mass: Number(mass) > 1 ? Number(mass) : 1 }),
      ...(!!damping && {
        damping: Number(damping) > 5 ? Number(damping) : 5,
      }),
      ...(!!stiffness && {
        stiffness: Number(stiffness) > 1 ? Number(stiffness) : 1,
      }),
      ...(!!overshootClamping && {
        overshootClamping: overshootClamping === "true" ? true : false,
      }),
    };

    const timingOptions = {
      start: Number(start),
      ...(!!duration && { duration: Number(duration) }),
    };

    if (item.startsWith("Move")) {
      animationArray.push(
        Move({
          x: Number(x),
          y: Number(y),
          initialX: Number(initialX),
          initialY: Number(initialY),
          ...timingOptions,
          ...springOptions,
        })
      );
    } else if (item.startsWith("Scale")) {
      animationArray.push(
        Scale({
          by: Number(by),
          ...(!!initial && { initial: Number(initial) }),
          ...(!!x && { x: Number(x) }),
          ...(!!y && { y: Number(y) }),
          ...(!!initialX && { initialX: Number(initialX) }),
          ...(!!initialY && { initialY: Number(initialY) }),
          ...timingOptions,
          ...springOptions,
        })
      );
    } else if (item.startsWith("Rotate")) {
      animationArray.push(
        Rotate({
          degrees: Number(degrees),
          initial: Number(initial),
          ...timingOptions,
          ...springOptions,
        })
      );
    }
  });

  return animationArray;
}

export default stringToReAnimated;
