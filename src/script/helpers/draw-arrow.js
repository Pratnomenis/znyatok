// https://github.com/frogcat/canvas-arrow

export const arrowType = {
  0: [0, 5, -16, 5, -20, 10],
  1: [0, 1, -10, 1, -10, 5],
  2: [0, 3, -20, 3, -20, 8],
  3: [0, 5, -20, 5, -20, 15],
  4: [-15, 5, -20, 16],
  5: [0, 1, -15, 1, -15, 8, -Number.MIN_VALUE, 8],
  6: [20, 15, 20, 5, -20, 5, -20, 15]
};

export const drawArrow = (ctx, startX, startY, endX, endY, controlPoints) => {
  const dx = endX - startX;
  const dy = endY - startY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const sin = dy / len;
  const cos = dx / len;
  const a = [];
  a.push(0, 0);
  for (let i = 0; i < controlPoints.length; i += 2) {
    const x = controlPoints[i];
    const y = controlPoints[i + 1];
    a.push(x < 0 ? len + x : x, y);
  }
  a.push(len, 0);
  for (let i = controlPoints.length; i > 0; i -= 2) {
    const x = controlPoints[i - 2];
    const y = controlPoints[i - 1];
    a.push(x < 0 ? len + x : x, -y);
  }
  a.push(0, 0);
  for (let i = 0; i < a.length; i += 2) {
    const x = a[i] * cos - a[i + 1] * sin + startX;
    const y = a[i] * sin + a[i + 1] * cos + startY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}