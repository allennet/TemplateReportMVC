//; (function ($, window, document, undefined) {
//    var KenDragEditor = function (ele, options) {
//        this.$element = ele;
//        this.editorOffset;//编辑器位移
//        this.editorWidth; //编辑器宽度
//        this.editorHeight;//编辑器高度
//        this.inEditor = false; //是否进入编辑器
//        this.dragX = 0;
//        this.dragY = 0;
//        this.iframeDoc;
//        this.editor;

//        this.defaults = {
//            'editor': '#editor',
//            'draggablenode': '.draggablenode',
//            'clonedClass': 'k-header k-drag-clue'
//        };
//        this.settings = $.extend(this.defaults, options);
//    }
//    //定义Beautifier的方法
//    KenDragEditor.prototype = {
//        //开始拖动
//        nodeDragStart: function (e) {
//            var kContent = $('.k-content');
//            var kContentParent = $(kContent).parent();
//            $(kContentParent).prepend('<div id="editorOverlay" class="overlay"></div>');
//            $("#editorOverlay").css({
//                "width": ($(kContent).outerWidth() - 2),
//                "height": ($(kContent).outerHeight() - 2),
//                "left": $(kContent).offset().left
//            });
//            $(".overlay").kendoDropTarget({
//                drop: dropTargetDrop,
//                dragenter: dropTargetDragEnter,
//                dragleave: dropTargetDragLeave
//            });
//        },
//        //拖动结束
//        nodeDrop: function (e) {
//            $('#editorOverlay').remove();
//        },
//        //拖动
//        nodeDrag: function (event) {
//            var rang;
//            if (this.inEditor) {
//                var x = event.x.client - editorOffset.left;
//                var y = event.y.client - editorOffset.top;
//                this.dragX = x;
//                this.dragY = y;
//                console.log(x + "," + y);
//                // Try the standards-based way first
//                if (this.iframeDoc.caretPositionFromPoint) {
//                    var sel = this.iframeDoc.getSelection();
//                    var pos = this.iframeDoc.caretPositionFromPoint(x, y);
//                    range = this.iframeDoc.createRange();
//                    range.setStart(pos.offsetNode, pos.offset);
//                    range.setEnd(pos.offsetNode, pos.offset);
//                    range.collapse(true);
//                    sel.removeAllRanges();
//                    sel.addRange(range);
//                }
//                    // Next, the WebKit way
//                else if (this.iframeDoc.caretRangeFromPoint) {
//                    var sel = this.iframeDoc.getSelection();
//                    range = this.iframeDoc.caretRangeFromPoint(x, y);
//                    range.setStart(range.startContainer, range.startOffset);
//                    range.setEnd(range.startContainer, range.startOffset);
//                    sel.removeAllRanges();
//                    sel.addRange(range);
//                }
//                    // Finally, the IE way
//                else if (this.iframeDoc.body.createTextRange) {
//                    $('.overlay').hide();
//                    range = this.iframeDoc.body.createTextRange();
//                    range.moveToPoint(x, y);
//                    range.select();
//                    $('.overlay').show();
//                }
//            }
//        },
//        //进入放置体
//        dropTargetDragEnter: function (e) {
//            this.inEditor = true;
//            this.editor.focus();
//            this.editorOffset = $(this.settings.editor).parent().offset();
//            this.editorWidth = $(this.settings.editor).parent().width();
//            this.editorHeight = $(this.settings.editor).parent().height();
//        },
//        //离开放置体
//        dropTargetDragLeave: function (e) {
//            this.inEditor = false;
//        },
//        //开始放置
//        dropTargetDrop: function (e) {
//            $('#editorOverlay').remove();
//            var range;
//            this.editor.focus();
//            // Try the standards-based way first
//            if (this.iframeDoc.caretPositionFromPoint) {
//                var pos = this.iframeDoc.caretPositionFromPoint(this.dragX, this.dragY);
//                range = this.editor.createRange();
//                range.setStart(pos.offsetNode, pos.offset);
//                range.collapse(true);
//            }
//                // Next, the WebKit way
//            else if (this.iframeDoc.caretRangeFromPoint) {
//                range = this.iframeDoc.caretRangeFromPoint(this.dragX, this.dragY);
//            }
//                // Finally, the IE way
//            else if (this.iframeDoc.body.createTextRange) {
//                var textRange = this.iframeDoc.body.createTextRange();
//                textRange.moveToPoint(this.dragX, this.dragY);
//                textRange.select();

//                //Gets the caret as an offset
//                var caret = getCaret(this.editor.body);

//                range = this.iframeDoc.createRange();
//                range.setStart(this.editor.body.firstChild, caret);
//                range.collapse(true);
//            }

//            this.editor.selectRange(range);
//            this.editor.exec("insertHtml", {
//                value: "{" + e.draggable.hint[0].textContent + "}"
//            });
//            this.inEditor = false;
//        }, 
//        init: function () {
//            this.editor = $(this.settings.editor).kendoEditor().data("kendoEditor"); 
//            this.iframeDoc = document.getElementsByTagName('iframe')[0].contentWindow.document; 
//            var $element = this;
//            var nodes = $(this.settings.draggablenode);
//            for (var i = 0; i < nodes.length; i++) {
//                $(nodes).css("cursor", "pointer");
//                $(nodes[i]).kendoDraggable({
//                    cursorOffset: {
//                        top: 10,
//                        left: 10
//                    },
//                    hint: function (element) {
//                        var cloned = $(element).clone();
//                        $(cloned).addClass($element.settings.clonedClass);
//                        return cloned;
//                    },
//                    dragstart: $element.nodeDragStart,
//                    dragend: $element.nodeDrop,
//                    drag: $element.nodeDrag
//                });
//            }
//            //$(this.settings.draggablenode).each(function () {
//            //    $(this).kendoDraggable({
//            //        cursorOffset: {
//            //            top: 10,
//            //            left: 10
//            //        },
//            //        hint: function (element) {
//            //            var cloned = $(element).clone();
//            //            $(cloned).addClass(.clonedClass);
//            //            return cloned;
//            //        },
//            //        dragstart: this.nodeDragStart,
//            //        dragend: this.nodeDrop,
//            //        drag: this.nodeDrag
//            //    });
//            //});
//        }
//    };
//    $.fn.KenDragEditor = function (options) {
//        var kenDragEditor = new KenDragEditor(this, options);
//        return kenDragEditor.init();
//    }
//})(jQuery, window, document);



//$.fn.kenDragEditor = function (options) {
//    var defaults = {
//        'editor': '#editor',
//        'draggablenode': '.draggablenode',
//        'clonedClass': 'k-header k-drag-clue'
//    };
//    var settings = $.extend(defaults, options);


//    var editorOffset;//编辑器位移
//    var editorWidth; //编辑器宽度
//    var editorHeight;//编辑器高度
//    var inEditor = false; //是否进入编辑器
//    var dragX = 0;
//    var dragY = 0;
//    var iframeDoc;
//    var editor;

//    //开始拖动
//    function nodeDragStart(e) {
//        var kContent = $('.k-content');
//        var kContentParent = $(kContent).parent();
//        $(kContentParent).prepend('<div id="editorOverlay" class="overlay"></div>');
//        $("#editorOverlay").css({
//            "width": ($(kContent).outerWidth() - 2),
//            "height": ($(kContent).outerHeight() - 2),
//            "left": $(kContent).offset().left
//        });
//        $(".overlay").kendoDropTarget({
//            drop: dropTargetDrop,
//            dragenter: dropTargetDragEnter,
//            dragleave: dropTargetDragLeave
//        });
//    }
//    //拖动结束
//    function nodeDrop(e) {
//        $('#editorOverlay').remove();
//    }

//    //拖动
//    function nodeDrag(event) {
//        if (inEditor) {
//            var x = event.x.client - editorOffset.left;
//            var y = event.y.client - editorOffset.top;
//            dragX = x;
//            dragY = y;
//            console.log(x + "," + y);
//            // Try the standards-based way first
//            if (iframeDoc.caretPositionFromPoint) {
//                var sel = iframeDoc.getSelection();
//                var pos = iframeDoc.caretPositionFromPoint(x, y);
//                range = iframeDoc.createRange();
//                range.setStart(pos.offsetNode, pos.offset);
//                range.setEnd(pos.offsetNode, pos.offset);
//                range.collapse(true);
//                sel.removeAllRanges();
//                sel.addRange(range);
//            }
//                // Next, the WebKit way
//            else if (iframeDoc.caretRangeFromPoint) {
//                var sel = iframeDoc.getSelection();
//                range = iframeDoc.caretRangeFromPoint(x, y);
//                range.setStart(range.startContainer, range.startOffset);
//                range.setEnd(range.startContainer, range.startOffset);

//                sel.removeAllRanges();
//                sel.addRange(range);
//            }
//                // Finally, the IE way
//            else if (iframeDoc.body.createTextRange) {
//                $('.overlay').hide();
//                range = iframeDoc.body.createTextRange();
//                range.moveToPoint(x, y);
//                range.select();
//                $('.overlay').show();
//            }
//        }
//    }
//    //进入放置体
//    function dropTargetDragEnter(e) {
//        inEditor = true;
//        editor.focus();
//        editorOffset = $(settings.editor).parent().offset();
//        editorWidth = $(settings.editor).parent().width();
//        editorHeight = $(settings.editor).parent().height();
//    }
//    //离开放置体
//    function dropTargetDragLeave(e) {
//        inEditor = false;
//    }

//    //开始放置
//    function dropTargetDrop(e) {
//        $('#editorOverlay').remove();
//        var range;
//        editor.focus();
//        // Try the standards-based way first
//        if (iframeDoc.caretPositionFromPoint) {
//            var pos = iframeDoc.caretPositionFromPoint(dragX, dragY);
//            range = editor.createRange();
//            range.setStart(pos.offsetNode, pos.offset);
//            range.collapse(true);
//        }
//            // Next, the WebKit way
//        else if (iframeDoc.caretRangeFromPoint) {
//            range = iframeDoc.caretRangeFromPoint(dragX, dragY);
//        }
//            // Finally, the IE way
//        else if (iframeDoc.body.createTextRange) {
//            var textRange = iframeDoc.body.createTextRange();
//            textRange.moveToPoint(dragX, dragY);
//            textRange.select();

//            //Gets the caret as an offset
//            var caret = getCaret(editor.body);

//            range = iframeDoc.createRange();
//            range.setStart(editor.body.firstChild, caret);
//            range.collapse(true);
//        }

//        editor.selectRange(range);
//        editor.exec("insertHtml", {
//            value: "{" + e.draggable.hint[0].textContent + "}"
//        });
//        inEditor = false;
//    }

//    editor = $(settings.editor).kendoEditor().data("kendoEditor");

//    iframeDoc = document.getElementsByTagName('iframe')[0].contentWindow.document;

//    $(settings.draggablenode).each(function () {
//        $(this).kendoDraggable({
//            cursorOffset: {
//                top: 10,
//                left: 10
//            },
//            hint: function (element) {
//                var cloned = $(element).clone();
//                $(cloned).addClass(settings.clonedClass);
//                return cloned;
//            },
//            dragstart: nodeDragStart,
//            dragend: nodeDrop,
//            drag: nodeDrag
//        });
//    });
//}