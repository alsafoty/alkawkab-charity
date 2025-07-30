"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
const isDevelopment = process.env.NODE_ENV !== "production";

// Store references for print handling
let previewWindow = null;
let printContent = null;

// Handle print operations
ipcMain.handle("print-operation", async (event, { type, content }) => {
  try {
    if (type === "show-preview") {
      if (previewWindow) {
        previewWindow.close();
      }

      printContent = content;
      previewWindow = new BrowserWindow({
        width: 800,
        height: 900,
        parent: win,
        modal: true,
        autoHideMenuBar: true,
        icon: path.join(
          process.env.WEBPACK_DEV_SERVER_URL
            ? __dirname
            : process.resourcesPath,
          "public/images/logo.png"
        ),
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, "preload.js"),
        },
      });

      const previewHtml = `
        <!DOCTYPE html>
        <html dir="rtl">
          <head>
            <title>معاينة الطباعة</title>
            <meta charset="utf-8">
            <style>
              .preview-controls {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 15px;
                background: white;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                text-align: center;
                z-index: 1000;
              }
              .preview-content {
                margin-bottom: 60px;
                padding: 20px;
              }
              .btn {
                padding: 8px 20px;
                margin: 0 5px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: 'Tajawal', Arial, sans-serif;
                font-size: 14px;
              }
              .btn-print {
                background: #198754;
                color: white;
              }
              .btn-cancel {
                background: #6c757d;
                color: white;
              }
              ${content.split("<style>")[1].split("</style>")[0]}
            </style>
          </head>
          <body>
            <div class="preview-content">
              ${content.split("<body>")[1].split("</body>")[0]}
            </div>
            <div class="preview-controls">
              <button id="printBtn" class="btn btn-print">طباعة</button>
              <button id="cancelBtn" class="btn btn-cancel">إلغاء</button>
            </div>
            <script>
              document.getElementById('printBtn').addEventListener('click', () => {
                window.electronAPI.confirmPrint();
              });
              document.getElementById('cancelBtn').addEventListener('click', () => {
                window.electronAPI.cancelPrint();
              });
            </script>
          </body>
        </html>
      `;

      await previewWindow.loadURL(
        `data:text/html;charset=UTF-8,${encodeURIComponent(previewHtml)}`
      );

      previewWindow.on("closed", () => {
        previewWindow = null;
        printContent = null;
      });

      return "preview-shown";
    }

    throw new Error("Unknown print operation");
  } catch (error) {
    console.error("Print operation error:", error);
    throw error;
  }
});

// Handle print confirmation
ipcMain.on("print-confirmed", async () => {
  try {
    if (!previewWindow || !printContent) {
      win.webContents.send("print-result", "error");
      return;
    }

    // Create a temporary window for printing
    const printWindow = new BrowserWindow({
      show: false, // Hide window again now that we've debugged the loading
      width: 800,
      height: 900,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        javascript: true,
        webSecurity: false,
      },
    });

    // Open DevTools for debugging
    printWindow.webContents.openDevTools();

    console.log("Loading content into print window...");

    // Add event listeners for debugging
    printWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("Failed to load content:", errorDescription);
      }
    );

    printWindow.webContents.on("did-finish-load", () => {
      console.log("Content loaded successfully");
    });

    // Load the content into the print window
    try {
      await printWindow.loadURL(
        `data:text/html;charset=UTF-8,${encodeURIComponent(printContent)}`
      );
      console.log("Content URL loaded");
    } catch (loadError) {
      console.error("Error loading URL:", loadError);
      throw loadError;
    }

    // Wait a moment for the content to be properly rendered
    console.log("Waiting for content to render...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      console.log("Attempting to print...");

      // Use the callback-based print method to properly handle user interaction
      const printed = await new Promise((resolve) => {
        printWindow.webContents.print(
          {
            silent: false,
            printBackground: true,
            color: true,
            margins: {
              marginType: "printableArea",
            },
          },
          (success, errorType) => {
            console.log("Print callback received:", { success, errorType });
            // Only resolve after user has made a choice
            if (errorType === "cancelled") {
              resolve("cancelled");
            } else {
              resolve(success ? "success" : "error");
            }
          }
        );
      });

      console.log("Print operation result:", printed);

      // Send the appropriate result based on user action
      if (printed === "cancelled") {
        win.webContents.send("print-result", "cancelled");
      } else {
        win.webContents.send("print-result", printed);
      }
    } catch (printError) {
      console.error("Print error:", printError);
      win.webContents.send("print-result", "error");
    } finally {
      // Always close both windows
      printWindow.close();
      if (previewWindow) {
        previewWindow.close();
      }
    }
  } catch (error) {
    console.error("Setup error:", error);
    win.webContents.send("print-result", "error");
    if (previewWindow) {
      previewWindow.close();
    }
  }
});

// Handle print cancellation
ipcMain.on("print-cancelled", () => {
  win.webContents.send("print-result", "cancelled");
  if (previewWindow) {
    previewWindow.close();
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: "public/images/logo.png",
    webPreferences: {
      // Use nodePath for preload script in production
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
