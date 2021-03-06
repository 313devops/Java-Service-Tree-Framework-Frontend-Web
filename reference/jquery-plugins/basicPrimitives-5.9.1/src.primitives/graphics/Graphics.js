primitives.common.Graphics = function (element) {
  this.m_element = element;

  this.m_placeholders = {};
  this.m_activePlaceholder = null;

  this.m_cache = new primitives.common.Cache();

  this.graphicsType = null;
  this.hasGraphics = false;
  this.debug = false;
  this.layerNames = {};

  primitives.common.loop(this, primitives.common.Layers, function (key, value) {
    this.layerNames[value] = key;
  });
};

primitives.common.Graphics.prototype.clean = function () {
  var key,
    placeholder,
    layerKey,
    layer;
  this.m_cache.clear();

  this.m_cache = null;

  this.m_element = null;
  for (key in this.m_placeholders) {
    if (this.m_placeholders.hasOwnProperty(key)) {
      placeholder = this.m_placeholders[key];

      for (layerKey in placeholder.layers) {
        if (placeholder.layers.hasOwnProperty(layerKey)) {
          layer = placeholder.layers[layerKey];
          layer.canvas.parentNode.removeChild(layer.canvas);
          layer.canvas = null;
        }
      }
      placeholder.layers.length = 0;
      placeholder.activeLayer = null;

      placeholder.size = null;
      placeholder.rect = null;
      placeholder.div = null;
    }
  }
  this.m_placeholders.length = 0;
  this.m_activePlaceholder = null;
};

primitives.common.Graphics.prototype.resize = function (name, width, height) {
  var placeholder = this.m_placeholders[name];
  if (placeholder != null) {
    this.resizePlaceholder(placeholder, 0, 0, width, height);
  }
};

primitives.common.Graphics.prototype.position = function (name, left, top, width, height) {
  var placeholder = this.m_placeholders[name];
  if (placeholder != null) {
    this.resizePlaceholder(placeholder, left, top, width, height);
  }
};

primitives.common.Graphics.prototype.show = function (name) {
  var placeholder = this.m_placeholders[name];
  if (placeholder != null) {
    primitives.common.JsonML.applyStyles(placeholder.div, {
      display: "inherit",
      visibility: "inherit"
    });
  }
};

primitives.common.Graphics.prototype.hide = function (name) {
  var placeholder = this.m_placeholders[name];
  if (placeholder != null) {
    primitives.common.JsonML.applyStyles(placeholder.div, {
      "display": "none",
      "visibility": "hidden"
    });
  }
};

primitives.common.Graphics.prototype.resizePlaceholder = function (placeholder, left, top, width, height) {
  var layerKey,
    layer;

  placeholder.size = new primitives.common.Size(width, height);
  placeholder.rect = new primitives.common.Rect(left, top, width, height);

  primitives.common.JsonML.applyStyles(placeholder.div, placeholder.rect.getCSS());
  for (layerKey in placeholder.layers) {
    if (placeholder.layers.hasOwnProperty(layerKey)) {
      layer = placeholder.layers[layerKey];
      if (layer.name !== -1) {
        primitives.common.JsonML.applyStyles(layer.canvas, {
          "position": "absolute",
          "width": "0px",
          "height": "0px"
        });
      }
    }
  }
};

primitives.common.Graphics.prototype.begin = function () {
  this.m_cache.begin();
};

primitives.common.Graphics.prototype.end = function () {
  this.m_cache.end();
};


primitives.common.Graphics.prototype.reset = function (arg0, arg1) {
  var placeholderName = "none",
    layerName = -1;
  switch (arguments.length) {
    case 1:
      if (typeof arg0 === "string") {
        placeholderName = arg0;
      }
      else {
        layerName = arg0;
      }
      break;
    case 2:
      placeholderName = arg0;
      layerName = arg1;
      break;
  }
  this.m_cache.reset(placeholderName, layerName);
};

primitives.common.Graphics.prototype.activate = function (arg0, arg1) {
  switch (arguments.length) {
    case 1:
      if (typeof arg0 === "string") {
        this._activatePlaceholder(arg0);
        this._activateLayer(-1);
      }
      else {
        this._activatePlaceholder("none");
        this._activateLayer(arg0);
      }
      break;
    case 2:
      this._activatePlaceholder(arg0);
      this._activateLayer(arg1);
      break;
  }
  return this.m_activePlaceholder;
};

primitives.common.Graphics.prototype._activatePlaceholder = function (placeholderName) {
  var placeholder = this.m_placeholders[placeholderName],
    div, divs;
  if (placeholder === undefined) {
    div = null;
    if (placeholderName === "none") {
      div = this.m_element;
    }
    else {
      divs = this.m_element.getElementsByClassName(placeholderName);
      div = divs.length > 0 ? divs[0] : this.m_element;
    }

    placeholder = new primitives.common.Placeholder(placeholderName);
    placeholder.div = div;
    placeholder.size = primitives.common.getInnerSize(div);
    placeholder.rect = new primitives.common.Rect(0, 0, placeholder.size.width, placeholder.size.height);

    this.m_placeholders[placeholderName] = placeholder;
  }
  this.m_activePlaceholder = placeholder;
};

primitives.common.Graphics.prototype._activateLayer = function (layerName) {
  var layer = this.m_activePlaceholder.layers[layerName],
    placeholder,
    canvas,
    position,
    maximumLayer,
    layerKey;
  if (layer === undefined) {
    placeholder = this.m_activePlaceholder;
    if (layerName === -1) {
      layer = new primitives.common.Layer(layerName);
      layer.canvas = placeholder.div;
    }
    else {
      canvas = primitives.common.JsonML.toHTML(["div",
        {
          "style": {
            "position": "absolute",
            "width": "0px",
            "height": "0px"
          },
          "class": ["Layer" + layerName, "Layer" + this.layerNames[layerName]]
        }
      ]);

      maximumLayer = null;
      for (layerKey in placeholder.layers) {
        if (placeholder.layers.hasOwnProperty(layerKey)) {
          layer = placeholder.layers[layerKey];
          if (layer.name < layerName) {
            maximumLayer = (maximumLayer !== null) ? Math.max(maximumLayer, layer.name) : layer.name;
          }
        }
      }

      layer = new primitives.common.Layer(layerName);
      layer.canvas = canvas;

      if (maximumLayer === null) {
        this.prepend(placeholder.div, layer.canvas);
      } else {
        this.insertAfter(placeholder.layers[maximumLayer].canvas, layer.canvas);
      }
    }
    placeholder.layers[layerName] = layer;
  }
  this.m_activePlaceholder.activeLayer = layer;
};

primitives.common.Graphics.prototype.prepend = function (parent, newElement) {
  if (parent.firstChild == null) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, parent.firstChild);
  }
};

primitives.common.Graphics.prototype.insertAfter = function (insertAfterElement, newElement) {
  var parent = insertAfterElement.parentNode;
  if (parent.lastChild == insertAfterElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, insertAfterElement.nextSibling);
  }
};

primitives.common.Graphics.prototype.text = function (x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr) {
  var placeholder = this.m_activePlaceholder,
    style = {
      "position": "absolute",
      "padding": 0,
      "margin": 0,
      "textAlign": this._getTextAlign(horizontalAlignment),
      "fontSize": attr.fontSize,
      "fontFamily": attr.fontFamily,
      "fontWeight": attr.fontWeight,
      "fontStyle": attr.fontStyle,
      "color": attr.fontColor,
      "lineHeight": 1
    },
    rotation = "",
    element,
    tdstyle;

  switch (orientation) {
    case primitives.text.TextOrientationType.Horizontal:
    case primitives.text.TextOrientationType.Auto:
      style.left = x + "px";
      style.top = y + "px";
      style.width = width + "px";
      style.height = height + "px";
      break;
    case primitives.text.TextOrientationType.RotateLeft:
      style.left = x + Math.round(width / 2.0 - height / 2.0) + "px";
      style.top = y + Math.round(height / 2.0 - width / 2.0) + "px";
      style.width = height + "px";
      style.height = width + "px";
      rotation = "rotate(-90deg)";
      break;
    case primitives.text.TextOrientationType.RotateRight:
      style.left = x + Math.round(width / 2.0 - height / 2.0) + "px";
      style.top = y + Math.round(height / 2.0 - width / 2.0) + "px";
      style.width = height + "px";
      style.height = width + "px";
      rotation = "rotate(90deg)";
      break;
  }

  style["-webkit-transform-origin"] = "center center";
  style["-moz-transform-origin"] = "center center";
  style["-o-transform-origin"] = "center center";
  style["-ms-transform-origin"] = "center center";


  style["-webkit-transform"] = rotation;
  style["-moz-transform"] = rotation;
  style["-o-transform"] = rotation;
  style["-ms-transform"] = rotation;
  style.transform = rotation;


  style.maxWidth = style.width;
  style.maxHeight = style.height;

  label = label.replace(new RegExp("\n", 'g'), "<br/>");
  switch (verticalAlignment) {
    case primitives.common.VerticalAlignmentType.Top:
      if (this.debug) {
        style.border = "solid 1px black";
      }
      element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "text");
      if (element === null) {
        element = primitives.common.JsonML.toHTML(["div",
          {
            "style": style,
            $: function (element) { element.innerHTML = label; }
          }
        ]);
        placeholder.activeLayer.canvas.appendChild(element);
        this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "text", element);
      }
      else {
        primitives.common.JsonML.applyStyles(element, style);
        element.innerHTML = label;
      }
      break;
    default:
      style.borderCollapse = "collapse";
      tdstyle = {
        "verticalAlign": this._getVerticalAlignment(verticalAlignment),
        "padding": 0
      };
      if (this.debug) {
        tdstyle.border = "solid 1px black";
      }
      element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "textintable");
      if (element === null) {
        element = primitives.common.JsonML.toHTML(["table",
          {
            "style": style
          },
          ["tbody",
            ["tr",
              ["td",
                {
                  "style": tdstyle,
                  $: function (element) { element.innerHTML = label; }
                }
              ]
            ]
          ]
        ]);
        placeholder.activeLayer.canvas.appendChild(element);
        this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "textintable", element);
      }
      else {
        primitives.common.JsonML.applyStyles(element, style);
        var td = element.getElementsByTagName("td")[0];
        primitives.common.JsonML.applyStyles(td, tdstyle);
        td.innerHTML = label;
      }
      break;
  }
};

primitives.common.Graphics.prototype._getTextAlign = function (alignment) {
  var result = null;
  switch (alignment) {
    case primitives.common.HorizontalAlignmentType.Center:
      result = "center";
      break;
    case primitives.common.HorizontalAlignmentType.Left:
      result = "left";
      break;
    case primitives.common.HorizontalAlignmentType.Right:
      result = "right";
      break;
  }
  return result;
};

primitives.common.Graphics.prototype._getVerticalAlignment = function (alignment) {
  var result = null;
  switch (alignment) {
    case primitives.common.VerticalAlignmentType.Middle:
      result = "middle";
      break;
    case primitives.common.VerticalAlignmentType.Top:
      result = "top";
      break;
    case primitives.common.VerticalAlignmentType.Bottom:
      result = "bottom";
      break;
  }
  return result;
};

primitives.common.Graphics.prototype.polylinesBuffer = function (buffer) {
  buffer.loop(this, function (polyline) {
    if (polyline.length() > 0) {
      this.polyline(polyline);
    }
  });
};

primitives.common.Graphics.prototype.polyline = function (polylineData) {
  var fromX = null,
    fromY = null,
    attr = polylineData.paletteItem.toAttr();

  polylineData.loop(this, function (segment) {
    switch (segment.segmentType) {
      case primitives.common.SegmentType.Move:
        fromX = Math.round(segment.x) + 0.5;
        fromY = Math.round(segment.y) + 0.5;
        break;
      case primitives.common.SegmentType.Line:
        this.rightAngleLine(fromX, fromY, Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5, attr);
        fromX = Math.round(segment.x) + 0.5;
        fromY = Math.round(segment.y) + 0.5;
        break;
      case primitives.common.SegmentType.Dot:
        this.dot(segment.x, segment.y, segment.width, segment.height, segment.cornerRadius, attr);
        break;
    }
  });
};

primitives.common.Graphics.prototype.dot = function (cx, cy, width, height, cornerRadius, attr) {
  var placeholder = this.m_activePlaceholder,
    element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "dot"),
    hasBorder = (attr.lineWidth !== undefined && attr.borderColor !== undefined),
    style = {
      "position": "absolute",
      "width": (width - (hasBorder ? 1 : 0)),
      "top": Math.round(cy),
      "left": Math.round(cx),
      "padding": 0,
      "margin": 0,
      "lineHeight": "0px",
      "overflow": "hidden",
      "height": (height - (hasBorder ? 1 : 0)),
      "background": attr.fillColor,
      "MozBorderRadius": cornerRadius,
      "WebkitBorderRadius": cornerRadius,
      "-khtml-border-radius": cornerRadius,
      "borderRadius": cornerRadius,
      "fontSize": "0px",
      "borderStyle": (hasBorder ? "Solid" : "None"),
      "borderWidth": (hasBorder ? "1px" : "0px"),
      "borderColor": (hasBorder ? attr.borderColor : "")
    };

  if (element === null) {
    element = primitives.common.JsonML.toHTML(["div",
      {
        "style": style
      }
    ]);
    placeholder.activeLayer.canvas.appendChild(element);
    this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "dot", element);
  } else {
    primitives.common.JsonML.applyStyles(element, style);
  }
};

primitives.common.Graphics.prototype.rightAngleLine = function (fromX, fromY, toX, toY, attr) {
  var placeholder = this.m_activePlaceholder,
    isVertical = Math.abs(toY - fromY) > Math.abs(toX - fromX),
    lineWidth = attr.lineWidth,
    style = {
      "position": "absolute",
      "top": Math.round(Math.min(fromY, toY) - ((isVertical) ? 0 : lineWidth / 2.0)),
      "left": Math.round(Math.min(fromX, toX) - ((isVertical) ? lineWidth / 2.0 : 0)),
      "padding": 0,
      "margin": 0,
      "opacity": 0.5,
      "lineHeight": "0px",
      "overflow": "hidden",
      "background": attr.borderColor,
      "fontSize": "0px"
    },
    element;

  if (isVertical) {
    style.width = lineWidth;
    style.height = Math.abs(Math.round(toY - fromY));
  } else {
    style.width = Math.abs(Math.round(toX - fromX));
    style.height = lineWidth;
  }

  element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "rect");
  if (element === null) {
    element = primitives.common.JsonML.toHTML(["div",
      {
        "style": style
      }
    ]);
    placeholder.activeLayer.canvas.appendChild(element);
    this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "rect", element);
  } else {
    primitives.common.JsonML.applyStyles(element, style);
  }
};

primitives.common.Graphics.prototype.template = function (x, y, width, height, contentx, contenty, contentWidth, contentHeight, template, hashCode, onRenderTemplate, uiHash, attr) { //ignore jslint
  var placeholder = this.m_activePlaceholder,
    element,
    templateKey = "template" + ((hashCode !== null) ? hashCode : primitives.common.hashCode(template)),
    gap = 0,
    style;

  element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, templateKey);

  if (attr !== null) {
    if (attr.borderWidth !== undefined) {
      gap = this.getPxSize(attr.borderWidth);
    }
  }

  style = {
    "width": (contentWidth - gap) + "px",
    "height": (contentHeight - gap) + "px",
    "top": (y + contenty) + "px",
    "left": (x + contentx) + "px"
  };

  primitives.common.mergeObjects(style, attr);

  if (uiHash == null) {
    uiHash = new primitives.common.RenderEventArgs();
  }

  uiHash.x = x + contentx;
  uiHash.y = y + contenty;
  uiHash.width = contentWidth - gap;
  uiHash.height = contentHeight - gap;

  if (element == null) {
    element = this.getElementByTemplate(template);
    style = primitives.common.mergeObjects(style, {
      "position": "absolute",
      "padding": "0px",
      "margin": "0px"
    }, attr);
    primitives.common.JsonML.applyStyles(element, style);

    uiHash.element = element;
    uiHash.renderingMode = primitives.common.RenderingMode.Create;

    if (onRenderTemplate !== null) {
      onRenderTemplate(null, uiHash);
    }
    placeholder.activeLayer.canvas.appendChild(element);
    this.m_cache.put(placeholder.name, placeholder.activeLayer.name, templateKey, element);
  } else {
    uiHash.element = element;
    uiHash.renderingMode = primitives.common.RenderingMode.Update;
    primitives.common.JsonML.applyStyles(element, style);
    if (onRenderTemplate !== null) {
      onRenderTemplate(null, uiHash);
    }
  }
  return element;
};

primitives.common.Graphics.prototype.getElementByTemplate = function (template) {
  var result = null;
  if (primitives.common.isArray(template)) {
    result = primitives.common.JsonML.toHTML(template);
  } else {
    var parent = document.createElement('div');
    parent.innerHTML = template;
    result = parent.firstChild;
  }
  return result;
};

primitives.common.Graphics.prototype.getPxSize = function (value, base) {
  var result = value;
  if (typeof value === "string") {
    if (value.indexOf("pt") > 0) {
      result = parseInt(value, 10) * 96 / 72;
    }
    else if (value.indexOf("%") > 0) {
      result = parseFloat(value) / 100.0 * base;
    }
    else {
      result = parseInt(value, 10);
    }
  }
  return result;
};