import { ipcRenderer, shell } from 'electron';
import { updateIconBadge } from '../../containers/App/actions';
import { UPDATE_UNREAD_EMAILS } from '../../containers/App/types';
import getUnreadEmailCountFromTitle from './get-unread-email-count-from-title';
import { WEBVIEW_ERROR } from './types';

export const monitorWebview = (webview, name) => {
  return dispatch => {
    webview.addEventListener('page-title-updated', ({ title }) => {
      const unreadEmails = getUnreadEmailCountFromTitle(title);

      if (unreadEmails === null) return;

      dispatch({
        type: UPDATE_UNREAD_EMAILS,
        username: name,
        unreadEmails,
      });

      dispatch(updateIconBadge());
    });

    webview.addEventListener('new-window', event => {
      event.preventDefault();
      shell.openExternal(event.url);
    });

    /**
     * TODO: Add context menu to webview?
     */

    webview.addEventListener('did-fail-load', error => {
      dispatch({
        type: WEBVIEW_ERROR,
        error,
        name,
      });
    });

    webview.addEventListener('crashed', () => {
      const error = new Error();
      error.errorDescription = 'CRASHED';

      dispatch({
        type: WEBVIEW_ERROR,
        error,
        name,
      });
    });

    webview.addEventListener('gpu-crashed', () => {
      const error = new Error();
      error.errorDescription = 'GPU_CRASHED';

      dispatch({
        type: WEBVIEW_ERROR,
        error,
        name,
      });
    });
  };
};

export const updateBadgeCount = count => {
  ipcRenderer.send('set-badge', count);
};
