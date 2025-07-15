import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

// Configure AlertifyJS globally
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const AlertifyPlugin = {
  install(app) {
    // Make alertify available globally
    app.config.globalProperties.$alertify = alertify;
    
    // Provide for injection
    app.provide('alertify', alertify);
    
    // Also make it available on window for debugging
    window.alertify = alertify;
  }
};

export default AlertifyPlugin;
