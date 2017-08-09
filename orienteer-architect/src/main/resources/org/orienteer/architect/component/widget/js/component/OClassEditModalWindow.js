/**
 * Modal window for create or edit {@link OArchitectOClass}
 * @param oClass {@link OArchitectOClass} for edit
 * @param containerId id of element which contains modal window
 * @param create true if create new class
 * @constructor
 */
var OClassEditModalWindow = function (oClass, containerId, create) {
    OArchitectModalWindow.apply(this, arguments);
    this.create = create;
};

OClassEditModalWindow.prototype = Object.create(OArchitectModalWindow.prototype);
OClassEditModalWindow.prototype.constructor = OClassEditModalWindow;

OClassEditModalWindow.prototype.createContent = function (panel, head, body) {
    var input = this.createNameInput(this.create);
    this.addValueBlock(body, input);
    this.addButtonBlock(body, input);
    this.addHeadBlock(head);
};

OClassEditModalWindow.prototype.createValueBlock = function () {
    var div = document.createElement('div');
    div.style.margin = '10px';
    return div;
};

OClassEditModalWindow.prototype.createButtonBlock = function () {
    var div = document.createElement('div');
    return div;
};

OClassEditModalWindow.prototype.addValueBlock = function (body, input) {
    var valueBlock = this.createValueBlock();
    valueBlock.appendChild(this.createLabel(localizer.name + ':'));
    valueBlock.appendChild(input);
    body.appendChild(valueBlock);
};

OClassEditModalWindow.prototype.addHeadBlock = function (head, create) {
    head.innerHTML = create ? localizer.createClass : localizer.editClass;
};

OClassEditModalWindow.prototype.addButtonBlock = function (body, input) {
    var buttonBlock = this.createButtonBlock();
    var okBut = this.createOkButton(localizer.ok, input);
    var cancelBut = this.createCancelButton(localizer.cancel);
    buttonBlock.appendChild(cancelBut);
    buttonBlock.appendChild(okBut);
    body.appendChild(buttonBlock);
};

//TODO: validate user input
OClassEditModalWindow.prototype.createNameInput = function (createNewOClass) {
    var input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    if (!createNewOClass) {
        input.value = this.value.name;
    }
    return input;
};

OClassEditModalWindow.prototype.createOkButton = function (label, nameField) {
    var button = this.newButton(label, OArchitectConstants.BUTTON_PRIMARY_CLASS);
    button.addEventListener('click', this.createOkButtonOnClickBehavior(nameField));
    button.style.float = 'right';
    button.style.marginRight = '10px';
    button.style.marginBottom = '10px';
    return button;
};

OClassEditModalWindow.prototype.createCancelButton = function (label) {
    var button = this.newButton(label, OArchitectConstants.BUTTON_DANGER_CLASS);
    var modal = this;
    button.addEventListener('click', function () {
        modal.destroy(modal.CANCEL);
    });
    button.style.float = 'left';
    button.style.marginLeft = '10px';
    button.style.marginBottom = '10px';
    return button;
};

OClassEditModalWindow.prototype.createLabel = function (label) {
    var element = document.createElement('label');
    element.innerHTML = label;
    return element;
};

OClassEditModalWindow.prototype.createOkButtonOnClickBehavior = function (nameField) {
    var modal = this;
    return function () {
        if (nameField.value.length > 0) {
            var newName = nameField.value;
            modal.value.setName(newName, function (oClass, msg) {
                if (oClass.name === newName) {
                    modal.destroy(modal.OK);
                } else console.warn(msg);
            });

        }
    };
};
