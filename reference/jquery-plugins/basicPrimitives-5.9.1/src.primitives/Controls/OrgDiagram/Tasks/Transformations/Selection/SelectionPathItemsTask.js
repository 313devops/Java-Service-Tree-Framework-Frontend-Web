primitives.orgdiagram.SelectionPathItemsTask = function (navigationFamilyTask, cursorItemTask, selectedItemsTask, cursorSelectionPathModeOptionTask) {
  var _data = {
    items: []
  };

  function process() {
    var selectionPathMode = cursorSelectionPathModeOptionTask.getSelectionPathMode(),
      navigationFamily = navigationFamilyTask.getLogicalFamily(),
      cursorTreeItemId = cursorItemTask.getCursorTreeItem(),
      selectedItems = selectedItemsTask.getItems().slice(0);

    selectedItems.push(cursorTreeItemId);

    _data.items = getSelectionPathItems(selectedItems, navigationFamily, selectionPathMode);

    return true;
  }

  function getSelectionPathItems(selectedItems, navigationFamily, selectionPathMode) {
    var result = [],
      processed = {},
      selectedItem,
      index, len;

    for (index = 0, len = selectedItems.length; index < len; index += 1) {
      selectedItem = selectedItems[index];
      /* show cursor full stack */
      switch (selectionPathMode) {
        case primitives.common.SelectionPathMode.None:
          break;
        case primitives.common.SelectionPathMode.FullStack:
          /* select all parents up to the root */
          navigationFamily.loopParents(this, selectedItem, function (parentItemId, parentItem) {
            if (processed[parentItemId] != null) {
              return navigationFamily.SKIP;
            }
            if (parentItem.visibility != primitives.common.Visibility.Invisible) {
              result.push(parentItemId);
            }
            processed[parentItemId] = true;
          });
          break;
      }
    }
    return result;
  }

  function getItems() {
    return _data.items;
  }

  return {
    process: process,
    getItems: getItems
  };
};