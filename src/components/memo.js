import { memoStyle } from "./memoStyle.js";
import { saveData } from "../utils/fileUtils.js";

function generateID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

class MemoComponent extends HTMLElement {
  id = 0;
  x = 0;
  y = 0;
  $container = null;

  constructor() {
    super();
    this.memoId = generateID(); // Unique ID for each memo
  }

  Init(x, y, title, content, id = null) {
    if (id) this.memoId = id; // ID가 주어졌다면, 기존 ID 사용

    const shadow = this.attachShadow({ mode: "open" });

    const $container = document.createElement("div");
    this.$container = $container;

    $container.classList.add("note");
    $container.style.position = "absolute";

    // 기본 크기 설정
    $container.style.width = "200px";
    $container.style.height = "150px";

    const style = document.createElement("style");
    style.textContent = memoStyle; // 새 스타일 적용
    shadow.appendChild(style);
    shadow.appendChild($container);

    $container.style.left = `${x - 200 / 2}px`;
    $container.style.top = `${y - 150 / 2}px`;

    const $noteTitle = document.createElement("h3");
    this.$noteTitle = $noteTitle;

    $noteTitle.setAttribute("contenteditable", "true");
    $noteTitle.classList.add("note-title");
    $noteTitle.innerText = title;

    const $noteContent = document.createElement("p");
    this.$noteContent = $noteContent;

    $noteContent.setAttribute("contenteditable", "true");
    $noteContent.classList.add("note-content");
    $noteContent.innerHTML = content;

    $container.appendChild($noteTitle);
    $container.appendChild($noteContent);

    let isDragging = false;
    let offsetX, offsetY;
    let canvasOffsetX = 0,
      canvasOffsetY = 0;

    $container.addEventListener("mousedown", (e) => {
      isDragging = true;

      const canvas = document.getElementById("canvas");
      const canvasRect = canvas.getBoundingClientRect();

      offsetX = e.clientX - $container.getBoundingClientRect().left;
      offsetY = e.clientY - $container.getBoundingClientRect().top;
      canvasOffsetX = canvasRect.left;
      canvasOffsetY = canvasRect.top;
      $container.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        $container.style.left = `${e.clientX - offsetX - canvasOffsetX}px`;
        $container.style.top = `${e.clientY - offsetY - canvasOffsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        this.saveMemo();
      }
    });

    const adjustContentHeight = () => {
      $noteContent.style.height = "auto";
      $noteContent.style.height = `${$noteContent.scrollHeight}px`;
    };

    $noteContent.addEventListener("input", adjustContentHeight);
    adjustContentHeight();

    $container.addEventListener("mousedown", () => {
      $container.style.zIndex = `${++MemoComponent.zIndexCounter}`;
    });

    // 타이핑 후 3초 동안 변경이 없으면 자동 저장
    let saveTimeout;
    const triggerSaveWithDelay = () => {
      clearTimeout(saveTimeout); // 기존 타이머 취소
      saveTimeout = setTimeout(this.saveMemo, 3000); // 3초 후 저장
    };

    $noteTitle.addEventListener("input", triggerSaveWithDelay);
    $noteContent.addEventListener("input", triggerSaveWithDelay);

    // 리사이저 추가
    const resizerSize = 15;
    const rightResizer = document.createElement("div");
    rightResizer.classList.add("resizer", "resizer-right");
    rightResizer.style.width = `${resizerSize}px`;
    rightResizer.style.height = "100%";
    rightResizer.style.opacity = "0";

    const bottomResizer = document.createElement("div");
    bottomResizer.classList.add("resizer", "resizer-bottom");
    bottomResizer.style.height = `${resizerSize}px`;
    bottomResizer.style.width = "100%";
    bottomResizer.style.opacity = "0";

    const cornerResizer = document.createElement("div");
    cornerResizer.classList.add("resizer", "resizer-corner");
    cornerResizer.style.width = `${resizerSize}px`;
    cornerResizer.style.height = `${resizerSize}px`;
    cornerResizer.style.opacity = "0";

    $container.appendChild(rightResizer);
    $container.appendChild(bottomResizer);
    $container.appendChild(cornerResizer);

    const initResize = (e, resizer) => {
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);

      resize = (e) => {
        if (resizer === rightResizer) {
          $container.style.width = `${
            e.clientX - $container.getBoundingClientRect().left
          }px`;
        } else if (resizer === bottomResizer) {
          $container.style.height = `${
            e.clientY - $container.getBoundingClientRect().top
          }px`;
        } else if (resizer === cornerResizer) {
          $container.style.width = `${
            e.clientX - $container.getBoundingClientRect().left
          }px`;
          $container.style.height = `${
            e.clientY - $container.getBoundingClientRect().top
          }px`;
        }
        adjustContentHeight();
      };

      stopResize = () => {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
        this.saveMemo(); // 저장
      };
    };

    rightResizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      initResize(e, rightResizer);
    });
    bottomResizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      initResize(e, bottomResizer);
    });
    cornerResizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      initResize(e, cornerResizer);
    });
  }

  saveMemo = () => {
    const memoData = {
      id: this.memoId,
      title: this.$noteTitle.innerText,
      content: this.$noteContent.innerHTML,
      x: parseInt(this.$container.style.left),
      y: parseInt(this.$container.style.top),
      width: parseInt(this.$container.style.width),
      height: parseInt(this.$container.style.height),
      zIndex: this.$container.style.zIndex,
    };
    saveData(`memo/memos.json`, memoData); // Call the save function from the utility
  };

  static zIndexCounter = 1;
}

// 특정 메모를 보여주는 함수
export function showMemo(memoData) {
  const memo = document.createElement("memo-component");
  memo.Init(
    memoData.x,
    memoData.y,
    memoData.title,
    memoData.content,
    memoData.id
  );
  document.getElementById("canvas").appendChild(memo);
}

// Memo 생성 함수 export
export function createMemo(
  x,
  y,
  title = "제목 없음",
  content = "내용을 입력하세요"
) {
  const memo = document.createElement("memo-component");
  memo.Init(x, y, title, content, generateID());
  document.getElementById("canvas").appendChild(memo);

  memo.saveMemo();
}

customElements.define("memo-component", MemoComponent);
