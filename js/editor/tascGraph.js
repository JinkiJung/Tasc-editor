interact('.dropzone')
    .draggable({
        modifiers: [
            interact.modifiers.snap({
                targets: [
                    interact.createSnapGrid({ x: 20, y: 20 })
                ],
                range: Infinity,
                relativePoints: [ { x: 0, y: 0 } ]
            }),
            interact.modifiers.restrict({
                restriction: 'parent',
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                endOnly: true
            })
        ],
        inertia: true
    })
    .on('dragmove', function (event) {
        var x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

        event.target.style.webkitTransform =
            event.target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)'

        event.target.setAttribute('data-x',x)
        event.target.setAttribute('data-y',y)
    })

// enable draggables to be dropped into this
interact('.terminus')
    .dropzone({
        // only accept elements matching this CSS selector
        accept: '.terminus-item',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.10,

        // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active')
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget
            var dropzoneElement = event.target

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
            var rect = dropzoneElement.getBoundingClientRect();
            draggableElement.setAttribute('parent-width', rect.width);
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            event.relatedTarget.setAttribute('parent-width', 0)
        },
        ondrop: function (event) {
            event.target.textContent = event.relatedTarget.textContent
            event.target.classList.remove('drop-target')
            event.target.classList.add('field-settled')
            event.relatedTarget.classList.remove('can-drop')
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active')
            event.target.classList.remove('drop-target')
        }
    })

// enable draggables to be dropped into this
interact('.condition')
    .dropzone({
        // only accept elements matching this CSS selector
        accept: '.condition-item',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.10,

        // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active')
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget
            var dropzoneElement = event.target

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
            var rect = dropzoneElement.getBoundingClientRect();
            draggableElement.setAttribute('parent-width', rect.width);
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            event.relatedTarget.setAttribute('parent-width', 0)
        },
        ondrop: function (event) {
            event.target.textContent = event.relatedTarget.textContent
            event.target.classList.remove('drop-target')
            event.target.classList.add('field-settled')
            event.relatedTarget.classList.remove('can-drop')
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active')
            event.target.classList.remove('drop-target')
        }
    })

// enable draggables to be dropped into this
interact('.tasc')
    .dropzone({
        // only accept elements matching this CSS selector
        accept: '.tasc-item',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.10,

        // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active')
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget
            var dropzoneElement = event.target

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
            var rect = dropzoneElement.getBoundingClientRect();
            draggableElement.setAttribute('parent-width', rect.width);
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            event.relatedTarget.setAttribute('parent-width', 0)
        },
        ondrop: function (event) {
            event.target.textContent = event.relatedTarget.textContent
            event.target.classList.remove('drop-target')
            event.target.classList.add('field-settled')
            event.relatedTarget.classList.remove('can-drop')
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active')
            event.target.classList.remove('drop-target')
        }
    })

interact('.drag-drop')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        autoScroll: true,
        // dragMoveListener from the dragging demo above
        onmove: dragMoveListener
    })
    .on('dragend', function (event) {  // call this listener on every dragmove
        var target = event.target
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + 0 + 'px, ' + 0 + 'px)';
        target.setAttribute('data-x', 0);
        target.setAttribute('data-y', 0);
        target.style.width = "-webkit-fit-content";
    })

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function addTascItem(){
    var iDiv = document.createElement('div');
    iDiv.className = "dropzone";
    iDiv.textContent = "Sample" + document.getElementsByClassName('dropzone').length;
    iDiv.id = "tasc"+document.getElementsByClassName('dropzone').length;
    var innerDiv1 = document.createElement('div');
    innerDiv1.className = 'condition';
    innerDiv1.textContent = 'Entrance';
    var innerDiv2 = document.createElement('div');
    innerDiv2.className = 'terminus';
    innerDiv2.textContent = 'Actor';
    var innerDiv3 = document.createElement('div');
    innerDiv3.className = 'tasc';
    innerDiv3.textContent = 'Action';
    var innerDiv4 = document.createElement('div');
    innerDiv4.className = 'terminus';
    innerDiv4.textContent = 'Target';
    var innerDiv5 = document.createElement('div');
    innerDiv5.className = 'condition';
    innerDiv5.textContent = 'Exit';
    iDiv.appendChild(innerDiv1);
    iDiv.appendChild(innerDiv2);
    iDiv.appendChild(innerDiv3);
    iDiv.appendChild(innerDiv4);
    iDiv.appendChild(innerDiv5);
    document.getElementsByClassName('tasc-editor')[0].appendChild(iDiv);
}
