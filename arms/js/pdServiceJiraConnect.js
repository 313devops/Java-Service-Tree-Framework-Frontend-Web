$(function () {
    setSideMenu();
    jsTreeBuild();
});

function setSideMenu() {
    setTimeout(function(){
        $('#sidebar_menu_product').attr("class","accordion-toggle active");
        $('#sidebar_menu_product').attr("aria-expanded","true");
        $('#sidebar_menu_product').css({'color':'lightblue'});
        $('#sidebar_menu_product').css({'font-weight':'900'});

        $('#product-elements-collapse').attr("class","panel-collapse collapse in");
        $('#product-elements-collapse').attr("aria-expanded","true");

        $('#sidebar_menu_product_jira_connect').addClass("active");
        $('#sidebar_menu_product_jira_connect').css({'color':'lightblue'});
        $('#sidebar_menu_product_jira_connect').css({'font-weight':'900'});
    },1000);
}

/* -------------------------------- jstree 설정 ------------------------------- */
function jsTreeBuild(){

    console.log("href: "+$(location).attr('href'));
    console.log("protocol: "+$(location).attr('protocol'));
    console.log("host: "+$(location).attr('host'));
    console.log("pathname: "+$(location).attr('pathname'));
    console.log("search: "+$(location).attr('search'));
    console.log("hostname: "+$(location).attr('hostname'));
    console.log("port: "+$(location).attr('port'));
    var isDevelopingToRoute = "/auth-user";

    $("#demo").bind(
        "before.jstree",
        function(e, data) {
            $("#alog").append(data.func + "<br />");
            $("li:not([rel='drive']).jstree-open > a > .jstree-icon").css('background-image',
                'url(http://www.a-rms.net/313devgrp/reference/jquery-plugins/jstree-v.pre1.0/themes/toolbar_open.png)');
            $("li:not([rel='drive']).jstree-closed > a > .jstree-icon").css('background-image',
                'url(http://www.a-rms.net/313devgrp/reference/jquery-plugins/jstree-v.pre1.0/themes/ic_explorer.png)');
        }).jstree({
        // List of active plugins
        "plugins": ["themes", "json_data", "ui", "crrm", "cookies", "dnd", "search", "types", "hotkeys", "contextmenu", "checkbox"],
        "themes": { "theme": [ "lightblue4" ] },
        //contextmenu
        "contextmenu": {
            items: { // Could be a function that should return an object like this one
                "create": {
                    "separator_before": true,
                    "separator_after": true,
                    "label": "Create",
                    "action": false,
                    "submenu": {
                        "create_file": {
                            "seperator_before": false,
                            "seperator_after": false,
                            "label": "File",
                            action: function(obj) {
                                this.create(obj, "last", {
                                    "attr": {
                                        "rel": "default"
                                    }
                                });
                            }
                        },
                        "create_folder": {
                            "seperator_before": false,
                            "seperator_after": false,
                            "label": "Folder",
                            action: function(obj) {
                                this.create(obj, "last", {
                                    "attr": {
                                        "rel": "folder"
                                    }
                                });
                            }
                        }

                    }
                },
                "ccp": {
                    "separator_before": false,
                    "separator_after": true,
                    "label": "Edit",
                    "action": false,
                    "submenu": {
                        "cut": {
                            "seperator_before": false,
                            "seperator_after": false,
                            "label": "Cut",
                            action: function(obj) {
                                this.cut(obj, "last", {
                                    "attr": {
                                        "rel": "default"
                                    }
                                });
                            }
                        },
                        "paste": {
                            "seperator_before": false,
                            "seperator_after": false,
                            "label": "Paste",
                            action: function(obj) {
                                this.paste(obj, "last", {
                                    "attr": {
                                        "rel": "folder"
                                    }
                                });
                            }
                        },

                        "changeType": {
                            "seperator_before": false,
                            "seperator_after": false,
                            "label": "Change Type",
                            "submenu": {
                                "toFile": {
                                    "seperator_before": false,
                                    "seperator_after": false,
                                    "label": "toFile",
                                    action: function(obj) {
                                        this.set_type("default");
                                    }
                                },
                                "toFolder": {
                                    "seperator_before": false,
                                    "seperator_after": false,
                                    "label": "toFolder",
                                    action: function(obj) {
                                        this.set_type("folder");
                                    }
                                }
                            }
                        }

                    }
                }

            }
        },

        // I usually configure the plugin that handles the data first
        // This example uses JSON as it is most common
        "json_data": {
            // This tree is ajax enabled - as this is most common, and maybe a bit more complex
            // All the options are almost the same as jQuery's AJAX (read the docs)
            "ajax": {
                // the URL to fetch the data
                "url": isDevelopingToRoute + "/api/arms/pdService/getChildNode.do",
                // the `data` function is executed in the instance's scope
                // the parameter is the node being loaded
                // (may be -1, 0, or undefined when loading the root nodes)
                "data": function(n) {
                    // the result is fed to the AJAX request `data` option
                    console.log(n);
                    return {
                        "c_id": n.attr ? n.attr("id").replace("node_", "").replace("copy_", "") : 1
                    };
                },
                "success": function(n) {
                    jSuccess('Product(service) Data Load Complete');
                }
            }
        },
        // Configuring the search plugin
        "search": {
            // As this has been a common question - async search
            // Same as above - the `ajax` config option is actually jQuery's AJAX object
            "ajax": {
                "url": isDevelopingToRoute + "/api/arms/pdService/searchNode.do",
                // You get the search string as a parameter
                "data": function(str) {
                    return {
                        "searchString": str
                    };
                },
                "success": function(n) {
                    jSuccess('search data complete');
                }
            }
        },
        // Using types - most of the time this is an overkill
        // read the docs carefully to decide whether you need types
        "types": {
            // I set both options to -2, as I do not need depth and children count checking
            // Those two checks may slow jstree a lot, so use only when needed
            "max_depth": -2,
            "max_children": -2,
            // I want only `drive` nodes to be root nodes
            // This will prevent moving or creating any other type as a root node
            "valid_children": ["drive"],
            "types": {
                // The default type
                "default": {
                    // I want this type to have no children (so only leaf nodes)
                    // In my case - those are files
                    "valid_children": "none",
                    // If we specify an icon for the default type it WILL OVERRIDE the theme icons
                    "icon": {
                        "image": "../dist/js/jstree-v.pre1.0/themes/attibutes.png"
                    }
                },
                // The `folder` type
                "folder": {
                    // can have files and other folders inside of it, but NOT `drive` nodes
                    "valid_children": ["default", "folder"],
                    "icon": {
                        "image": "../dist/js/jstree-v.pre1.0/themes/ic_explorer.png"
                    }
                },
                // The `drive` nodes
                "drive": {
                    // can have files and folders inside, but NOT other `drive` nodes
                    "valid_children": ["default", "folder"],
                    "icon": {
                        "image": "../dist/js/jstree-v.pre1.0/themes/home.png"
                    },
                    // those prevent the functions with the same name to be used on `drive` nodes
                    // internally the `before` event is used
                    "start_drag": false,
                    "move_node": false,
                    "delete_node": false,
                    "remove": false
                }
            }
        },
        // UI & core - the nodes to initially select and open will be overwritten by the cookie plugin

        // the UI plugin - it handles selecting/deselecting/hovering nodes
        "ui": {
            // this makes the node with ID node_4 selected onload
            "initially_select": ["node_4"]
        },
        // the core plugin - not many options here
        "core": {
            // just open those two nodes up
            // as this is an AJAX enabled tree, both will be downloaded from the server
            "initially_open": ["node_2", "node_3"]
        }
    }).bind("create.jstree", function(e, data) {
        $.post(isDevelopingToRoute + "/api/arms/pdService/addNode.do", {
            "ref": data.rslt.parent.attr("id").replace("node_", "").replace("copy_", ""),
            "c_position": data.rslt.position,
            "c_title": data.rslt.name,
            "c_type": data.rslt.obj.attr("rel")
        }, function(r) {
            if (r.status) {
                $(data.rslt.obj).attr("id", "node_" + r.id);
                jNotify('Notification : <strong>Add Node</strong>, Complete !');
            } else {
                $.jstree.rollback(data.rlbk);
            }
            if (typeof Chat != "undefined"){
                Chat.sendMessage("노드를 추가했습니다. 추가된 노드의 아이디는 " + r.id , function(data) {
                    console.log(data);
                });
            }
            jsTreeBuild();
        });
    }).bind("remove.jstree", function(e, data) {
        data.rslt.obj.each(function() {
            $.ajax({
                async: false,
                type: 'POST',
                url: isDevelopingToRoute + "/api/arms/pdService/removeNode.do",
                data: {
                    "c_id": this.id.replace("node_", "").replace("copy_", "")
                },
                success: function(r) {
                    jNotify('Notification : <strong>Remove Node</strong>, Complete !');
                    if (typeof Chat != "undefined"){
                        Chat.sendMessage("노드를 삭제했습니다. 삭제된 노드의 아이디는 " + r.c_id , function(data) {
                            console.log(data);
                        });
                    }
                    jsTreeBuild();
                }
            });
        });
    }).bind("rename.jstree", function(e, data) {
        $.post(isDevelopingToRoute + "/api/arms/pdService/alterNode.do", {
            "c_id": data.rslt.obj.attr("id").replace("node_", "").replace("copy_", ""),
            "c_title": data.rslt.new_name,
            "c_type": data.rslt.obj.attr("rel")
        }, function(r) {
            if (!r.status) {
                $.jstree.rollback(data.rlbk);
            }
            jSuccess('Rename Node Complete');
            if (typeof Chat != "undefined"){
                Chat.sendMessage("노드를 변경했습니다. 변경된 노드의 아이디는 " + r.c_id , function(data) {
                    console.log(data);
                });
            }
            jsTreeBuild();
        });
    }).bind("set_type.jstree", function(e, data) {
        $.post(isDevelopingToRoute + "/api/arms/pdService/alterNodeType.do", {
            "c_id": data.rslt.obj.attr("id").replace("node_", "").replace("copy_", ""),
            "c_title": data.rslt.new_name,
            "c_type": data.rslt.obj.attr("rel")
        }, function(r) {
            jSuccess('Node Type Change');
            if (typeof Chat != "undefined"){
                Chat.sendMessage("노드를 변경했습니다. 변경된 노드의 아이디는 " + r.c_id , function(data) {
                    console.log(data);
                });
            }
            jsTreeBuild();
        });
    }).bind("move_node.jstree", function(e, data) {
        data.rslt.o.each(function(i) {
            $.ajax({
                async: false,
                type: 'POST',
                url: isDevelopingToRoute + "/api/arms/pdService/moveNode.do",
                data: {
                    "c_id": $(this).attr("id").replace("node_", "").replace("copy_", ""),
                    "ref": data.rslt.cr === -1 ? 1 : data.rslt.np.attr("id").replace("node_", "").replace("copy_", ""),
                    "c_position": data.rslt.cp + i,
                    "c_title": data.rslt.name,
                    "copy": data.rslt.cy ? 1 : 0,
                    "multiCounter": i
                },
                success: function(r) {
                    if (r.status) {
                        $.jstree.rollback(data.rlbk);
                    } else {
                        $(data.rslt.oc).attr("id", "node_" + r.id);
                        if (data.rslt.cy && $(data.rslt.oc).children("UL").length) {
                            data.inst.refresh(data.inst._get_parent(data.rslt.oc));
                        }
                    }
                    jNotify('Notification : <strong>Move Node</strong> Complete !');
                    if (typeof Chat != "undefined"){
                        Chat.sendMessage("노드가 이동되었습니다. 이동된 노드의 아이디는 " + r.c_id , function(data) {
                            console.log(data);
                        });
                    }
                    jsTreeBuild();
                }
            });
        });
    }).bind("select_node.jstree", function (event, data) {
        // `data.rslt.obj` is the jquery extended node that was clicked
        if ($.isFunction(jsTreeClick)) {
            console.log(data.rslt.obj.attr("localName"));
            jsTreeClick(data.rslt.obj.attr("id"), data.rslt.obj.text() );
        }
    });

    $("#mmenu input, #mmenu button").click(function() {
        switch (this.id) {
            case "add_default":
            case "add_folder":
                $("#demo").jstree("create", null, "last", {
                    "attr": {
                        "rel": this.id.toString().replace("add_", "")
                    }
                });
                break;
            case "search":
                $("#demo").jstree("search", document.getElementById("text").value);
                break;
            case "text":
                break;
            default:
                $("#demo").jstree(this.id);
                break;
        }
    });
}

/* ---------------------------------------- d3 config ------------------------------------ */
/* d3 */
var treeData = {
    "name": "product service name",
    "type":"Product(service)",
    "children": [
        {"name": "Visualization", "type": "Jira JQL"}
    ]
};
//treeJSON = d3.json(flare_data, function(error, treeData) {

// Calculate total nodes, max label length
var totalNodes = 0;
var maxLabelLength = 0;
// variables for drag/drop
var selectedNode = null;
var draggingNode = null;
// panning variables
var panSpeed = 200;
var panBoundary = 20; // Within 20px from edges will pan when dragging.
// Misc. variables
var i = 0;
var duration = 750;
var root;

// size of the diagram
//edit 313devops
//var viewerWidth = $(document).width();
//var viewerHeight = $(document).height();
var viewerWidth = $('#tree-container').outerHeight();
var viewerHeight = 295;

var tree = d3.layout.tree()
    .size([viewerHeight, viewerWidth]);

// define a d3 diagonal projection for use by the node paths later on.
var diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });


// A recursive helper function for performing some setup by walking through all nodes
function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
            visit(children[i], visitFn, childrenFn);
        }
    }
}

// Call visit function to establish maxLabelLength
visit(treeData, function(d) {
    totalNodes++;
    maxLabelLength = Math.max(d.name.length, maxLabelLength);

}, function(d) {
    return d.children && d.children.length > 0 ? d.children : null;
});

// sort the tree according to the node names
function sortTree() {
    tree.sort(function(a, b) {
        return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
}
// Sort the tree initially incase the JSON isn't in a sorted order.
sortTree();

// TODO: Pan function, can be better implemented.
function pan(domNode, direction) {
    var speed = panSpeed;
    if (panTimer) {
        clearTimeout(panTimer);
        translateCoords = d3.transform(svgGroup.attr("transform"));
        if (direction == 'left' || direction == 'right') {
            translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
            translateY = translateCoords.translate[1];
        } else if (direction == 'up' || direction == 'down') {
            translateX = translateCoords.translate[0];
            translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
        }
        scaleX = translateCoords.scale[0];
        scaleY = translateCoords.scale[1];
        scale = zoomListener.scale();
        svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
        d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
        zoomListener.scale(zoomListener.scale());
        zoomListener.translate([translateX, translateY]);
        panTimer = setTimeout(function() {
            pan(domNode, speed, direction);
        }, 50);
    }
}

// Define the zoom function for the zoomable tree
function zoom() {
    //edit 313devops
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    //svgGroup.attr("transform", "translate(" + "221,79" + ")scale(" + 1.5 + ")");
}

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

function initiateDrag(d, domNode) {
    draggingNode = d;
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    d3.select(domNode).attr('class', 'node activeDrag');


    svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
        if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
        else return -1; // a is the hovered element, bring "a" to the front
    });
    // if nodes has children, remove the links and nodes
    if (nodes.length > 1) {
        // remove link paths
        links = tree.links(nodes);
        nodePaths = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            }).remove();
        // remove child nodes
        nodesExit = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;
            }).filter(function(d, i) {
                if (d.id == draggingNode.id) {
                    return false;
                }
                return true;
            }).remove();
    }

    // remove parent link
    parentLink = tree.links(tree.nodes(draggingNode.parent));
    svgGroup.selectAll('path.link').filter(function(d, i) {
        if (d.target.id == draggingNode.id) {
            return true;
        }
        return false;
    }).remove();

    dragStarted = null;
}

// define the baseSvg, attaching a class for styling and the zoomListener
var baseSvg = d3.select("#tree-container").append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    .attr("class", "overlay")
    .call(zoomListener);


// Define the drag listeners for drag/drop behaviour of nodes.
dragListener = d3.behavior.drag()
    .on("dragstart", function(d) {
        if (d == root) {
            return;
        }
        dragStarted = true;
        nodes = tree.nodes(d);
        d3.event.sourceEvent.stopPropagation();
        // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
    })
    .on("drag", function(d) {
        if (d == root) {
            return;
        }
        if (dragStarted) {
            domNode = this;
            initiateDrag(d, domNode);
        }

        // get coords of mouseEvent relative to svg container to allow for panning
        relCoords = d3.mouse($('svg').get(0));
        if (relCoords[0] < panBoundary) {
            panTimer = true;
            pan(this, 'left');
        } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

            panTimer = true;
            pan(this, 'right');
        } else if (relCoords[1] < panBoundary) {
            panTimer = true;
            pan(this, 'up');
        } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
            panTimer = true;
            pan(this, 'down');
        } else {
            try {
                clearTimeout(panTimer);
            } catch (e) {

            }
        }

        d.x0 += d3.event.dy;
        d.y0 += d3.event.dx;
        var node = d3.select(this);
        node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
        updateTempConnector();
    })
    .on("dragend", function(d) {
        if (d == root) {
            return;
        }
        domNode = this;
        if (selectedNode) {
            // now remove the element from the parent, and insert it into the new elements children
            var index = draggingNode.parent.children.indexOf(draggingNode);
            if (index > -1) {
                draggingNode.parent.children.splice(index, 1);
            }
            if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                if (typeof selectedNode.children !== 'undefined') {
                    selectedNode.children.push(draggingNode);
                } else {
                    selectedNode._children.push(draggingNode);
                }
            } else {
                selectedNode.children = [];
                selectedNode.children.push(draggingNode);
            }
            // Make sure that the node being added to is expanded so user can see added node is correctly moved
            expand(selectedNode);
            sortTree();
            endDrag();
        } else {
            endDrag();
        }
    });

function endDrag() {
    selectedNode = null;
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
    d3.select(domNode).attr('class', 'node');
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
    updateTempConnector();
    if (draggingNode !== null) {
        update(root);
        centerNode(draggingNode);
        draggingNode = null;
    }
}

// Helper functions for collapsing and expanding nodes.
function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function expand(d) {
    if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
    }
}

var overCircle = function(d) {
    selectedNode = d;
    updateTempConnector();
};
var outCircle = function(d) {
    selectedNode = null;
    updateTempConnector();
};

// Function to update the temporary connector indicating dragging affiliation
var updateTempConnector = function() {
    var data = [];
    if (draggingNode !== null && selectedNode !== null) {
        // have to flip the source coordinates since we did this for the existing connectors on the original tree
        data = [{
            source: {
                x: selectedNode.y0,
                y: selectedNode.x0
            },
            target: {
                x: draggingNode.y0,
                y: draggingNode.x0
            }
        }];
    }
    var link = svgGroup.selectAll(".templink").data(data);

    link.enter().append("path")
        .attr("class", "templink")
        .attr("d", d3.svg.diagonal())
        .attr('pointer-events', 'none');

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
};

// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + viewerWidth / 2;
    y = y * scale + viewerHeight / 2;

    //edit 313devops
    x = $('#tree-container').outerWidth()/3;
    y = $('#tree-container').outerHeight()/3;
    scale = 1.4;

    d3.select('g').transition()
        .duration(duration)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
}

// Toggle children function
function toggleChildren(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else if (d._children) {
        d.children = d._children;
        d._children = null;
    }
    return d;
}

// Toggle children on click.
function click(d) {
    if (d3.event.defaultPrevented) return; // click suppressed
    d = toggleChildren(d);
    update(d);
    centerNode(d);
}

function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function(level, n) {

        if (n.children && n.children.length > 0) {
            if (levelWidth.length <= level + 1) levelWidth.push(0);

            levelWidth[level + 1] += n.children.length;
            n.children.forEach(function(d) {
                childCount(level + 1, d);
            });
        }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function(d) {
        d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
        // alternatively to keep a fixed scale one can set a fixed depth per level
        // Normalize for fixed-depth by commenting out below line
        // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    node = svgGroup.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .call(dragListener)
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    nodeEnter.append("circle")
        .attr('class', 'nodeCircle')
        .attr("r", 0)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.children || d._children ? -10 : 10;
        })
        .attr("dy", ".35em")
        .attr('class', 'nodeText')
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        })
        .style("fill-opacity", 0);

    nodeEnter.append('text')
        .attr('x', function(d) {
            return -15;
        })
        .attr('y', function(d) {
            return 15
        })
        .text(function(d) {
            return d.type;
        })
        .on('click', function(d) {
            window.location = d.url;
        })
        .style('font-size', '8px');

    // phantom node to give us mouseover in a radius around it
    nodeEnter.append("circle")
        .attr('class', 'ghostCircle')
        .attr("r", 30)
        .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
        .attr('pointer-events', 'mouseover')
        .on("mouseover", function(node) {
            overCircle(node);
        })
        .on("mouseout", function(node) {
            outCircle(node);
        });

    // Update the text to reflect whether node has children or not.
    node.select('text')
        .attr("x", function(d) {
            return d.children || d._children ? -10 : 10;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        });



    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
        .attr("r", 4.5)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Fade the text in
    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 0);

    nodeExit.select("text")
        .style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {
                x: source.x0,
                y: source.y0
            };
            return diagonal({
                source: o,
                target: o
            });
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Append a group which holds all nodes and which the zoom Listener can act upon.
var svgGroup = baseSvg.append("g");

// Define the root
root = treeData;
root.x0 = viewerHeight / 2;
root.y0 = 0;

// Layout the tree initially and center on the root node.
update(root);
centerNode(root);


/* --------------------------- multi select & slim scroll ---------------------------------- */
$(function () {

    //multiselect
    $('.searchable').multiSelect({
        selectableHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='try \"12\"'>",
        selectionHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='try \"4\"'>",
        afterInit: function(ms){
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                .on('keydown', function(e){
                    if (e.which === 40){
                        that.$selectableUl.focus();
                        return false;
                    }
                });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                .on('keydown', function(e){
                    if (e.which == 40){
                        that.$selectionUl.focus();
                        return false;
                    }
                });
        },
        afterSelect: function(value, text){
            this.qs1.cache();
            this.qs2.cache();
            d3Update();
        },
        afterDeselect: function(value, text){
            this.qs1.cache();
            this.qs2.cache();
            d3Update();
        }
    });


    //slim scroll
    $(".ms-list").slimscroll();
});


/* ----------------------- click action ------------------------- */
function d3Update(){
    if(typeof treeData.children == "undefined" || treeData.children == "" || treeData.children == null){
        console.log("it is not inner element");
        treeData.children = [];
    }else{
        treeData.children.splice(0,treeData.children.length);
    }

    $("#sampleMultiTest :selected").each(function() {
        item = {}
        item["name"] = this.text;
        item["type"] = "Jira JQL";
        treeData.children.push(item);
    });
    update(root);
}

function jsTreeClick(selectedNodeID, selectedNodeText) {
    treeData.name = selectedNodeText;
    update(root);
}