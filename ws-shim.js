// WebSocket shim for React Native - uses native WebSocket
module.exports = global.WebSocket || require('react-native').WebSocket || WebSocket;
module.exports.WebSocket = module.exports;
module.exports.default = module.exports;
