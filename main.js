const { app, BrowserWindow } = require("electron")
const path = require('path')

let win

function createWindow(){

    win = new BrowserWindow({
        width: 420,
        height: 540,

        frame: false,
        transparent: true,
        resizable: false,
        type: "desktop",
        skipTaskbar: true,

        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile("index.html")
    win.setIgnoreMouseEvents(false)

    // Prevent minimization (handles Win+D and other minimize events)
    win.on('minimize', (event) => {
        event.preventDefault()
        // Instead of minimizing, just blur the window
        // It will remain visible on the desktop
    })

    // Keep window visible on desktop
    win.on('show', () => {
        win.focus()
    })

}

app.whenReady().then(createWindow)

// Ensure app doesn't close when all windows closed (desktop widget behavior)
app.on('window-all-closed', (event) => {
    // Prevent app from closing - keep it running in background
    event.preventDefault()
})