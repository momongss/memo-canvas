const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let memos = []; // 메모 데이터를 저장할 배열

function loadMemos() {
  const dirPath = path.join(
    "C:",
    "Users",
    "rkrp1",
    "Desktop",
    "Project",
    "keep-memo",
    "memo"
  );
  const filePath = path.join(dirPath, "memos.json");

  // 디렉토리와 파일이 존재하는지 확인
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      memos = JSON.parse(fileContent); // 파일 내용을 배열로 파싱
      console.log("Memos loaded successfully.");
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  } else {
    console.log("No memos found, initializing empty array.");
    memos = []; // 파일이 없을 경우 빈 배열로 초기화
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  win.loadFile("src/index.html");

  // F12로 개발자 도구 열기
  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      win.webContents.openDevTools();
    }
  });

  // 렌더러 프로세스에서 메모 데이터를 요청할 때 처리
  ipcMain.handle("load-memos", async () => {
    return memos; // 현재 메모 배열을 반환
  });
}

app.whenReady().then(() => {
  loadMemos(); // 앱 시작 시 메모 데이터를 로드
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC 핸들러 - 메모 데이터를 저장하는 처리
ipcMain.handle("save-data", async (event, { memoData }) => {
  try {
    const dirPath = path.join(
      "C:",
      "Users",
      "rkrp1",
      "Desktop",
      "Project",
      "keep-memo",
      "memo"
    );
    const filePath = path.join(dirPath, "memos.json");

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 기존 메모 목록에 추가하거나 수정
    const memoIndex = memos.findIndex((m) => m.id === memoData.id);
    if (memoIndex !== -1) {
      memos[memoIndex] = memoData; // 기존 메모 업데이트
    } else {
      memos.push(memoData); // 새 메모 추가
    }

    // 파일에 메모 목록 저장
    fs.writeFileSync(filePath, JSON.stringify(memos, null, 2)); // JSON 파일로 저장
    return { success: true };
  } catch (error) {
    console.error("Error saving memo:", error);
    return { success: false, message: error.message };
  }
});
