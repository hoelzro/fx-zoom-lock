const LOCKED_ICON = 'icons/locked.svg';
const UNLOCKED_ICON = 'icons/unlocked.svg';
const DEFAULT_ZOOM = 0;

let unlockedTabs = new Set(); // XXX persist between restarts?

function lockTab(tab) {
    unlockedTabs.delete(tab.id);

    browser.pageAction.setIcon({
        path: LOCKED_ICON,
        tabId: tab.id,
    });
}

function unlockTab(tab) {
    unlockedTabs.add(tab.id);

    browser.pageAction.setIcon({
        path: UNLOCKED_ICON,
        tabId: tab.id,
    });
}

function isLocked(tab) {
    return !unlockedTabs.has(tab);
}

function toggleTab(tab) {
    if(isLocked(tab.id)) {
        return unlockTab(tab);
    } else {
        return lockTab(tab);
    }
}

function handleZoomChange(zoomInfo) {
    if(!isLocked(zoomInfo.tabId)) {
        return;
    }

    // XXX yell at the user, directing them to unlock the tab
    //     maybe include some intelligence to detect a deliberate zoom
    browser.tabs.setZoom(zoomInfo.tabId, DEFAULT_ZOOM);
}

function handleTabRemoved(tabId, removeInfo) {
    unlockedTabs.delete(tabId);
}

browser.tabs.onZoomChange.addListener(handleZoomChange);
browser.tabs.onRemoved.addListener(handleTabRemoved);

browser.pageAction.onClicked.addListener(function(tab) {
    toggleTab(tab);
});
