export const memoStyle = `
  .note {
  width: 250px;
  min-height: 180px;
  background-color: #1c1c1c;
  color: #eee;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  border: 2px solid #c0c0c0;
  transition: box-shadow 0.2s ease;
  resize: none;
}
.note h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  padding: 5px;
  color: #eee;
  border-bottom: 1px solid #444;

  border-radius: 5px;
}
.note p {
  font-size: 14px;
  margin: 10px 0 0 0;
  padding: 5px;
  flex-grow: 1;
  color: #ccc;
  overflow-y: hidden;
  white-space: pre-wrap;

  border-radius: 5px;
}
.note:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.note h3:focus,
.note p:focus {
  outline: 2px solid #c8c8c8; /* 외곽선 색상을 흰색으로 설정 */
}
.resizer {
  width: 10px;
  height: 10px;
  background-color: #444;
  position: absolute;
  z-index: 10;
}
.resizer-right {
  right: 0;
  top: 50%;
  cursor: ew-resize;
}
.resizer-bottom {
  bottom: 0;
  left: 50%;
  cursor: ns-resize;
}
.resizer-corner {
  right: 0;
  bottom: 0;
  cursor: nwse-resize;
}
`;
