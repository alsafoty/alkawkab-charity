try {
  const { contextBridge, ipcRenderer } = require("electron");
  console.log("Preload script is running");

  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  contextBridge.exposeInMainWorld("electronAPI", {
    printOperation: async (options) => {
      console.log("Print operation called:", options.type);
      try {
        const result = await ipcRenderer.invoke("print-operation", options);
        console.log("Print operation result:", result);
        return result;
      } catch (error) {
        console.error("Print operation error:", error);
        throw error;
      }
    },
    confirmPrint: () => ipcRenderer.send("print-confirmed"),
    cancelPrint: () => ipcRenderer.send("print-cancelled"),
    onPrintResult: (callback) =>
      ipcRenderer.on("print-result", (_, result) => callback(result)),
  });

  console.log("electronAPI exposed successfully");
} catch (error) {
  console.error("Error in preload script:", error);
}
