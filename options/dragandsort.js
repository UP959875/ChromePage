"use strict";

var dragSrcElement = null,
    draggingId = null;

function dragStartHandler(e) {
    dragSrcElement = this;
    e.dataTransfer.effectAllowed = 'move';
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.setDragImage(this, 45, 45);
    document.getElementById('editBookmarkMenu').style.display = 'none';
}

function dragOverHandler(e) {
    if (e.preventDefault) { e.preventDefault(); } }

function dragEnterHandler(e) {
    if(dragSrcElement !== this && this.tagName !== 'button'){
        var insertOrder;
        var targetId = parseInt(this.id);
        e.dataTransfer.dropEffect = 'move';
        if ((draggingId || dragSrcElement.id) > targetId){
            insertOrder = 'beforebegin';
            draggingId = targetId - 0.5;
        } else {
            insertOrder = 'afterend';
            draggingId = targetId + 0.5;
        }
        this.insertAdjacentElement(insertOrder, dragSrcElement);
    }
    return false;
}

function dragLeaveHandle(e) { return false; }

function dropHandler(e) { if (e.stopPropagation) { e.stopPropagation(); } }

function dragEndHandler(e) {
    dragSrcElement.classList.remove('dragging');
    updateIds();
    draggingId = null;
    saveBookmarks();
}

function addDnDHandlers(elem) {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', dragStartHandler);
    elem.addEventListener('dragenter', dragEnterHandler)
    elem.addEventListener('dragover', dragOverHandler);
    elem.addEventListener('dragleave', dragLeaveHandle);
    elem.addEventListener('drop', dropHandler);
    elem.addEventListener('dragend', dragEndHandler);
}

function makeSortable(elements) {
    if (Array.isArray(elements)) {
        elements.forEach(addDnDHandlers);
    } else {
        addDnDHandlers(elements);
    }
}
