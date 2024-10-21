// 저장된 메모 데이터를 불러오는 함수
export function loadMemoDatas() {
  return window.fileSystem
    .loadMemos() // preload.js를 통해 노출된 loadMemos 호출
    .then((memos) => {
      console.log("Memos loaded:", memos);
      return memos; // 로드된 메모 데이터를 반환
    })
    .catch((err) => {
      console.error("Error loading memos:", err);
      return []; // 오류 발생 시 빈 배열 반환
    });
}

export function saveData(filePath, memoData) {
  // preload.js를 통해 노출된 saveData 호출
  window.fileSystem
    .saveData(filePath, memoData)
    .then((result) => {
      if (result.success) {
        console.log("Memo saved successfully.");
      } else {
        console.error("Error saving memo:", result.message);
      }
    })
    .catch((err) => {
      console.error("IPC communication error:", err);
    });
}
