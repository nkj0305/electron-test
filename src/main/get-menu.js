import os from 'os';
import path from 'path';
import { app, shell, Menu, dialog } from 'electron';

const appName = app.name;
const settings = require('electron-settings');
const packageJson = require('../../package.json');

const getMenu = () => {
  const fileAnIssueTemplate = `
  <!-- Please succinctly describe your issue and steps to reproduce it. -->

  -

  ${app.name} ${app.getVersion()}
  Electron ${process.versions.electron}
  ${process.platform} ${process.arch} ${os.release()}
  `;

  const MenuTpl = [
    {
      label: 'File',
      submenu: [
        ...(process.platform === 'darwin' ? [{ role: 'about' }] : []),
        { role: 'quit',
          accelerator: 'CommandOrControl+Q'
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { label: 'Togge sidebar', 
          accelerator: 'CmdOrCtrl+Shift+h',
          click: (menuItem, currentWindow) => currentWindow.webContents.send('toggleSidebar')
        }
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: `${appName} Website`,
          click: () => shell.openExternal(packageJson.homepage),
        },
        {
          label: `${appName} Source Code`,
          click: () => shell.openExternal(packageJson.repository.url),
        },
        {
          label: 'Report an issue',
          click: () => shell.openExternal(`${packageJson.repository.url}/issues/new?body=${encodeURIComponent(fileAnIssueTemplate)}`)
        },
        { type: 'separator' },
        {
          type: 'checkbox',
          label: 'Always on Top',
          accelerator: 'Ctrl+Shift+T',
          checked: settings.getSync('alwaysOnTop'),
          click(item, focusedWindow) {
            settings.setSync('alwaysOnTop', item.checked);
            focusedWindow.setAlwaysOnTop(item.checked);
          },
        },
        ...(process.platform === 'darwin' ? [] : [
          { type: 'separator' },
          {
            label: `About ${appName}`,
            click() {
              dialog.showMessageBox({
                title: `About ${appName}`,
                message: `${appName} ${app.getVersion()}`,
                detail: 'Unofficial Protonmail desktop app, created by Matthew Core <BeatPlus> and Hayden Suarez-Davis <HaydenSD>.',
                icon: path.join(__dirname, 'images', process.platform === 'linux' ? 'Icon-linux-about.png' : 'IconTray.png'),
                buttons: ['Close']
              });
            },
          },
        ]),
      ],
    }
  ];

  return Menu.buildFromTemplate(MenuTpl);
};

export default getMenu;
