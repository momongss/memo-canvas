export function enableCanvasZoom(canvas) {
  let scale = 1; // 초기 확대 비율
  const scaleFactor = 0.05; // 확대/축소 비율 조정 (감도 감소)

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault(); // 기본 스크롤 동작 방지

    // 현재 마우스 위치에서 캔버스의 비율을 계산
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // 캔버스 내부에서의 마우스 X 좌표
    const mouseY = e.clientY - rect.top; // 캔버스 내부에서의 마우스 Y 좌표

    // 줌 방향 결정
    if (e.deltaY < 0) {
      // 스크롤 업 (확대)
      scale += scaleFactor;
    } else {
      // 스크롤 다운 (축소)
      scale = Math.max(0.1, scale - scaleFactor); // 최소 비율 설정
    }

    // 새로운 스케일 적용
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = `${mouseX}px ${mouseY}px`; // 마우스 위치를 기준으로 확대/축소
  });
}
