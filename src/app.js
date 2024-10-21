import { createMemo, showMemo } from "./components/memo.js";
import { enableCanvasDrag } from "./canvasDrag.js";
import { loadMemoDatas } from "./utils/fileUtils.js";

const canvas = document.getElementById("canvas");

document.addEventListener("DOMContentLoaded", () => {
  loadMemoDatas().then((memos) => {
    // 로드한 메모를 이용하여 메모 UI를 초기화
    memos.forEach((memo) => {
      console.log(memo);
      showMemo(memo);
      // 각 메모를 화면에 표시하는 로직 작성
    });
  });
});

document.getElementById("addMemoButton").addEventListener("click", () => {
  const rect = canvas.getBoundingClientRect();
  const centerX = window.innerWidth / 2 - rect.left; // 현재 화면 중앙 x
  const centerY = window.innerHeight / 2 - rect.top; // 현재 화면 중앙 y
  createMemo(centerX, centerY); // 현재 화면의 중앙에 메모 생성
});

// 캔버스 드래그 및 확대/축소 기능 활성화
enableCanvasDrag(canvas);
