export function enableCanvasDrag(canvas) {
  let isDraggingCanvas = false;
  let startX, startY;
  let initialCanvasX, initialCanvasY;
  let scale = 1; // 초기 스케일

  // 드래그 기능
  document.addEventListener("mousedown", (e) => {
    if (e.target === canvas) {
      isDraggingCanvas = true;

      startX = e.pageX;
      startY = e.pageY;

      const canvasRect = canvas.getBoundingClientRect();
      initialCanvasX = canvasRect.left;
      initialCanvasY = canvasRect.top;
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDraggingCanvas) return;

    canvas.style.transformOrigin = `0 0`;

    const moveX = e.pageX - startX;
    const moveY = e.pageY - startY;

    // 드래그 시 캔버스 위치 조정
    canvas.style.left = `${initialCanvasX + moveX}px`;
    canvas.style.top = `${initialCanvasY + moveY}px`;

    console.log(canvas.style.left);
    console.log(canvas.style.top);
  });

  document.addEventListener("mouseup", () => {
    isDraggingCanvas = false;
  });

  document.addEventListener("mouseleave", () => {
    isDraggingCanvas = false;
  });
}
