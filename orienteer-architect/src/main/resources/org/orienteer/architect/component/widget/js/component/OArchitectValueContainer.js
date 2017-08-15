
var OArchitectValueContainer = function (value, editor) {
    this.value = value;
    this.editor = editor;
};

OArchitectValueContainer.prototype.createElement = function (maxLength, iconCss) {
    return this.createContainer(this.createLabel(maxLength), this.createIcon(iconCss));
};

OArchitectValueContainer.prototype.createContainer = function (label, icon) {
    var div = document.createElement('div');
    if (icon !== null) div.appendChild(icon);
    div.appendChild(label);
    return div;
};

OArchitectValueContainer.prototype.createLabel = function (maxLength) {
    var label = this.value;
    if (label.length > maxLength) {
        label = label.slice(0, maxLength - 5) + '...';
    }
    var span = document.createElement('span');
    span.innerHTML = mxUtils.htmlEntities(label);
    return span;
};

OArchitectValueContainer.prototype.createIcon = function (cssClass) {
    var icon = document.createElement('i');
    icon.setAttribute('class', cssClass);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
};

OArchitectValueContainer.prototype.createExternalLink = function (existsInDb) {
    var a = document.createElement('a');
    a.classList.add('editor-icon');
    a.appendChild(this.createIcon(OArchitectConstants.FA_EXTERNAL_LINK));
    if (existsInDb) {
        var url = this.value.pageUrl;
        if (url != null && url.length > 0) {
            a.setAttribute('target', '_blank');
            a.setAttribute('href', url);
        }
    }
    return a;
};

OArchitectValueContainer.prototype.addClickListenerForAction = function (element, action) {
    var editor = this.editor;
    var cell = this.cell;
    element.addEventListener('click', function (event) {
        editor.execute(action, cell, event);
    });
};

var OClassContainer = function (oClass, editor, cell) {
    OArchitectValueContainer.apply(this, arguments);
    this.cell = cell;
};

OClassContainer.prototype = Object.create(OArchitectValueContainer.prototype);
OClassContainer.prototype.constructor = OClassContainer;

OClassContainer.prototype.createElement = function (maxLength) {
    return this.createContainer(this.createLabel(maxLength), this.createEditIcon());
};

OClassContainer.prototype.createContainer = function (label, editElement) {
    var container = OArchitectValueContainer.prototype.createContainer.apply(this, arguments);
    if (editElement != null) {
        container.addEventListener('mouseover', function () {
            editElement.style.visibility = 'visible';
            editElement.style.cursor = 'pointer';
        });
        container.addEventListener('mouseout', function () {
            editElement.style.visibility = 'hidden';
            editElement.style.cursor = 'default';
        });
    }
    return container;
};

OClassContainer.prototype.createEditIcon = function () {
    var element = null;
    if (this.value.existsInDb) {
        element = this.createExternalLink(this.value.existsInDb);
        element.setAttribute('title', localizer.goToOClassPage);
    } else {
        element = this.createIcon(OArchitectConstants.FA_EDIT);
        this.addClickListenerForAction(element, OArchitectActionNames.EDIT_OCLASS_ACTION);
    }
    element.style.visibility = 'hidden';
    element.style.marginRight = '5px';
    return element;
};


var OPropertyContainer = function (property, editor, cell) {
    OArchitectValueContainer.apply(this, arguments);
    this.cell = cell;
};

OPropertyContainer.prototype = Object.create(OArchitectValueContainer.prototype);
OPropertyContainer.prototype.constructor = OPropertyContainer;

OPropertyContainer.prototype.createElement = function (maxLength) {
    var editProperty = !this.value.isSubClassProperty() ? this.createEditOPropertyElement() : null;
    var deleteProperty = !this.value.isSubClassProperty() ? this.createDeleteOPropertyElement() : null;
    var label = this.createLabel(maxLength);
    return this.createContainer(label, editProperty, deleteProperty);
};

OPropertyContainer.prototype.createContainer = function (label, editProperty, deleteProperty) {
    var container = document.createElement('div');

    container.addEventListener('mouseover', function () {
        if (editProperty != null) {
            editProperty.style.visibility = 'visible';
            editProperty.style.cursor = 'pointer';
        }
        if (deleteProperty != null) {
            deleteProperty.style.visibility = 'visible';
            deleteProperty.style.cursor = 'pointer';
        }
    });
    container.addEventListener('mouseout', function () {
        if (editProperty != null) {
            editProperty.style.visibility = 'hidden';
            editProperty.style.cursor = 'default';
        }
        if (deleteProperty != null) {
            deleteProperty.style.visibility = 'hidden';
            deleteProperty.style.cursor = 'default';
        }
    });

    if (editProperty !== null) container.appendChild(editProperty);
    container.appendChild(label);
    if (deleteProperty !== null) container.appendChild(deleteProperty);
    return container;
};

OPropertyContainer.prototype.createLabel = function (maxLength) {
    var name = this.value.name;
    var type = this.value.type;
    var typeLength = type.length;
    var nameLength = name.length;
    if (typeLength + nameLength > maxLength) {
        name = name.slice(0, maxLength - typeLength - 5) + '...';
    }
    var span = document.createElement('span');
    span.innerHTML = mxUtils.htmlEntities(name + ' (', false) + mxUtils.htmlEntities(type + ')', false);
    return span;
};

OPropertyContainer.prototype.createEditOPropertyElement = function () {
    var element = null;
    if (this.value.ownerClass.existsInDb) {
        element = this.createExternalLink(this.value.ownerClass.existsInDb);
        element.setAttribute('title', localizer.goToOPropertyPage);
    } else {
        element = this.createIcon(OArchitectConstants.FA_EDIT);
        this.addClickListenerForAction(element, OArchitectActionNames.EDIT_OPROPERTY_ACTION);
    }
    element.style.visibility = 'hidden';
    element.style.marginRight = '5px';
    return element;
};

OPropertyContainer.prototype.createDeleteOPropertyElement = function () {
    var deleteElement = null;
    if (!this.value.ownerClass.existsInDb) {
        deleteElement = this.createIcon(OArchitectConstants.FA_DELETE);
        deleteElement.style.visibility = 'hidden';
        deleteElement.style.marginLeft = '5px';
        this.addClickListenerForAction(deleteElement, OArchitectActionNames.DELETE_OPROPERTY_ACTION);
    }
    return deleteElement;
};
