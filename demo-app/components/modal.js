// components/modal.js

export function showModal(message, options = {}) {
  // Nếu đã có modal, không tạo thêm
  if (document.getElementById("app-modal")) return;

  const modal = document.createElement("div");
  modal.id = "app-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.right = "0";
  modal.style.bottom = "0";
  modal.style.background = "rgba(0,0,0,0.18)";
  modal.style.zIndex = 9999;
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";

  modal.innerHTML = `
    <div style="
      background: #fff; padding: 32px 26px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.09); 
      min-width: 320px; text-align: center; position: relative;">
      <div style="margin-bottom: 18px; font-size: 16px;">${message}</div>
      <button id="modal-ok-btn" style="
        padding: 8px 22px; border: none; border-radius: 7px; background: var(--color-primary, #0d6efd); 
        color: #fff; font-size: 15px; cursor: pointer;">${
          options.okText || "OK"
        }</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("modal-ok-btn").onclick = function () {
    modal.remove();
    if (typeof options.onOk === "function") options.onOk();
  };
}
