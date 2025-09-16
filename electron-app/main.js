const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'd6_128x128.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            sandbox: false
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.maximize();
    
    // Create application menu
    createMenu();

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Workspace',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'new-workspace');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Workspace',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const result = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile'],
                            filters: [
                                { name: 'Rogue Trader Workspace', extensions: ['rtw'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });
                        
                        if (!result.canceled) {
                            mainWindow.webContents.send('menu-action', 'open-workspace', result.filePaths[0]);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'save');
                    }
                },
                {
                    label: 'Save As',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: async () => {
                        const result = await dialog.showSaveDialog(mainWindow, {
                            filters: [
                                { name: 'Rogue Trader Workspace', extensions: ['rtw'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });
                        
                        if (!result.canceled) {
                            mainWindow.webContents.send('menu-action', 'save-as', result.filePath);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Print',
                    accelerator: 'CmdOrCtrl+P',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'print');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Export',
            submenu: [
                {
                    label: 'Rich Text Format (RTF)',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'export-rtf');
                    }
                },
                {
                    label: 'Adobe Reader (PDF)',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'export-pdf');
                    }
                }
            ]
        },
        {
            label: 'Generate',
            submenu: [
                {
                    label: 'New System',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'generate-system');
                    }
                },
                {
                    label: 'New Starship',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'generate-starship');
                    }
                },
                {
                    label: 'New Primitive Species',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'generate-primitive-species');
                    }
                },
                {
                    label: 'New Xenos',
                    submenu: [
                        { label: 'Random World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'random') },
                        { label: 'Temperate World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'temperate') },
                        { label: 'Death World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'death') },
                        { label: 'Desert World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'desert') },
                        { label: 'Ice World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'ice') },
                        { label: 'Jungle World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'jungle') },
                        { label: 'Ocean World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'ocean') },
                        { label: 'Volcanic World', click: () => mainWindow.webContents.send('menu-action', 'generate-xenos', 'volcanic') }
                    ]
                },
                {
                    label: 'New Treasure',
                    submenu: [
                        { label: 'Random', click: () => mainWindow.webContents.send('menu-action', 'generate-treasure', 'random') },
                        { label: 'Finely Wrought (Skilled Craftsmanship)', click: () => mainWindow.webContents.send('menu-action', 'generate-treasure', 'finely-wrought') },
                        { label: 'Ancient Miracle (Archeotech)', click: () => mainWindow.webContents.send('menu-action', 'generate-treasure', 'ancient-miracle') },
                        { label: 'Alien Technology (Xenotech)', click: () => mainWindow.webContents.send('menu-action', 'generate-treasure', 'alien-technology') },
                        { label: 'Cursed Artefact (Twisted Omens)', click: () => mainWindow.webContents.send('menu-action', 'generate-treasure', 'cursed-artefact') }
                    ]
                }
            ]
        },
        {
            label: 'Settings',
            submenu: [
                {
                    label: 'Edit Settings',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'edit-settings');
                    }
                },
                {
                    label: 'Allow free node movement',
                    type: 'checkbox',
                    checked: true,
                    click: (menuItem) => {
                        mainWindow.webContents.send('menu-action', 'toggle-free-movement', menuItem.checked);
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About Rogue Trader System Generator',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'about');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers for file operations
ipcMain.handle('save-file', async (event, filePath, content) => {
    try {
        fs.writeFileSync(filePath, content);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('load-file', async (event, filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return { success: true, content };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
});