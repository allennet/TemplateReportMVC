/*
 * kenDragEditor v1.0  
 * Author:Allen Cai
 * IE浏览器只支持点击
 * 谷歌、火狐等浏览器支持拖动、点击
 *
 */

; (function ($) {
    var editorOffset;//编辑器位移
    var editorWidth; //编辑器宽度
    var editorHeight;//编辑器高度
    var inEditor = false; //是否进入编辑器
    var dragX = 0;
    var dragY = 0;
    var iframeDoc;
    var editor;
    var settings;
    var kenEditorSettings; // editor配置
    var isDrag = false;


    var defaults = {
        'editor': '#editor',
        'draggablenode': '.draggablenode',
        'clonedClass': 'k-header k-drag-clue'
    };
    var kenEditorSettingDefaults = {
        tools: [
               "bold",
               "italic",
               "underline",
               "strikethrough",
               "justifyLeft",
               "justifyCenter",
               "justifyRight",
               "justifyFull",
               "insertUnorderedList",
               "insertOrderedList",
               "indent",
               "outdent",
               "createLink",
               "unlink",
               "insertImage",
               "insertFile",
               "subscript",
               "superscript",
               "tableWizard",
               "createTable",
               "addRowAbove",
               "addRowBelow",
               "addColumnLeft",
               "addColumnRight",
               "deleteRow",
               "deleteColumn",
               "viewHtml",
               "formatting",
               "cleanFormatting",
               "fontName",
               "fontSize",
               "foreColor",
               "backColor",
               "print"
        ]
    };

    var getCaret = function (node) {
        //node.focus(); 
        /* without node.focus() IE will returns -1 when focus is not on node */
        if (node.selectionStart) return node.selectionStart;
        else if (!document.selection) return 0;
        var c = "\001";
        var sel = document.selection.createRange();
        var dul = sel.duplicate();
        var len = 0;
        dul.moveToElementText(node);
        sel.text = c;
        len = (dul.text.indexOf(c));
        sel.moveStart('character', -1);
        sel.text = "";
        return len;
    };

    //Used for setting caret in elements such as forms
    var setCaretPosition = function (ctrl, pos) {
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    //开始拖动
    var nodeDragStart = function (e) {
        var kContent = $('.k-content');
        var kContentParent = $(kContent).parent();
        $(kContentParent).prepend('<div id="editorOverlay" class="overlay"></div>');
        $("#editorOverlay").css({
            "width": ($(kContent).outerWidth() - 2),
            "height": ($(kContent).outerHeight() - 2)
            //"left": $(kContent).offset().left
        });
        $(".overlay").kendoDropTarget({
            drop: dropTargetDrop,
            dragenter: dropTargetDragEnter,
            dragleave: dropTargetDragLeave
        });
        isDrag = true;
    };

    //拖动结束
    var nodeDrop = function (e) {
        $('#editorOverlay').remove();
        isDrag = false;
    };

    //拖动
    var nodeDrag = function (event) {
        if (inEditor) {
            var x = event.x.client - editorOffset.left;
            var y = event.y.client - editorOffset.top;
            dragX = x;
            dragY = y;
            console.log(x + "," + y);
            // 标准的
            if (iframeDoc.caretPositionFromPoint) {
                var sel = iframeDoc.getSelection();
                var pos = iframeDoc.caretPositionFromPoint(x, y);
                range = iframeDoc.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.setEnd(pos.offsetNode, pos.offset);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
                //WebKit
            else if (iframeDoc.caretRangeFromPoint) {
                var sel = iframeDoc.getSelection();
                range = iframeDoc.caretRangeFromPoint(x, y);
                range.setStart(range.startContainer, range.startOffset);
                range.setEnd(range.startContainer, range.startOffset);

                sel.removeAllRanges();
                sel.addRange(range);
            }
                // IE 存在BUG 放弃拖动
            else if (iframeDoc.body.createTextRange) {
                //$('.overlay').hide(); 
                //range = iframeDoc.body.createTextRange();
                //range.moveToPoint(x, y);
                //range.select();
                //$('.overlay').show();
            }
        }
    };

    // 获取光标位置
    var getCursortPosition = function (ctrl) {
        var CaretPos = 0;   // IE Support 
        ctrl.focus();
        var Sel = ctrl.createTextRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
        return (CaretPos);
    };

    //进入放置体
    var dropTargetDragEnter = function (e) {
        inEditor = true;
        editor.focus();
        editorOffset = $(settings.editor).parent().offset();
        editorWidth = $(settings.editor).parent().width();
        editorHeight = $(settings.editor).parent().height();
    };

    //离开放置体
    var dropTargetDragLeave = function dropTargetDragLeave(e) {
        inEditor = false;
    };

    //开始放置
    var dropTargetDrop = function (e) {
        $('#editorOverlay').remove();
        var range;
        editor.focus();
        //标准
        if (iframeDoc.caretPositionFromPoint) {
            var pos = iframeDoc.caretPositionFromPoint(dragX, dragY);
            range = editor.createRange();
            range.setStart(pos.offsetNode, pos.offset);
            range.collapse(true);
        }
            //WebKit
        else if (iframeDoc.caretRangeFromPoint) {
            range = iframeDoc.caretRangeFromPoint(dragX, dragY);
        }
            //IE 存在BUG 放弃
        else if (iframeDoc.body.createTextRange) {
            //var textRange = iframeDoc.body.createTextRange();
            //textRange.moveToPoint(dragX, dragY);
            //textRange.select();

            ////Gets the caret as an offset
            //var caret = getCaret(editor.body);

            //range = iframeDoc.createRange();
            //range.setStart(editor.body.firstChild, caret);
            //range.collapse(true);
            return false;
        }
        editor.selectRange(range);

        editor.exec("insertHtml", {
            value: "" + createField(e.draggable.hint[0].textContent) + ""
        });
        inEditor = false;
    };

    //自定义字段
    var createField = function (content) {
        if (content == undefined || content == "undefined" || content == "")
            return "";
        if (content.indexOf("]") >= 0 && content.indexOf("[") >= 0) {
            var items = content.split(',');
            if (items.length == 0)
                return "";
            var tabHtml = "<table class='k-table'><tbody>";
            tabHtml += "<tr style=\"height:50%;\" data-role=\"resizable\">";
            for (var i = 0; i < items.length; i++) {
                tabHtml += "<td>" + items[i] + "</td>";
            }
            tabHtml += "</tr></tbody></table>";
            return tabHtml;
        } else {
            return "{" + content + "}";
        }
    };

    //点击插入
    var clickInsert = function (text) {
        editor.exec("insertHtml", { html: text, split: false });
    };

    //获取IE版本
    var IEVersion = function () {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return 7;
            } else if (fIEVersion == 8) {
                return 8;
            } else if (fIEVersion == 9) {
                return 9;
            } else if (fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }
        } else if (isEdge) {
            return 'edge';//edge
        } else if (isIE11) {
            return 11; //IE11  
        } else {
            return -1;//不是ie浏览器
        }
    }
    //初始化
    var init = function () {
        editor = $(settings.editor).kendoEditor(kenEditorSettings).data("kendoEditor");
        iframeDoc = document.getElementsByTagName('iframe')[0].contentWindow.document;
        var isIE = IEVersion();
        $(settings.draggablenode).each(function () {
            if (isIE == -1) {
                //拖动插入
                $(this).kendoDraggable({
                    cursorOffset: {
                        top: 10,
                        left: 10
                    },
                    hint: function (element) {
                        var cloned = $(element).clone();
                        $(cloned).addClass(settings.clonedClass);
                        return cloned;
                    },
                    dragstart: nodeDragStart,
                    dragend: nodeDrop,
                    drag: nodeDrag
                });
            }
            //点击插入
            $(this).click(function () {
                if (isDrag == false) {
                    editor.focus();
                    clickInsert(createField(this.innerText));
                }
            });
        });
    }
    //插件名称
    $.fn.KenDragEditor = function (commomOptions, editorOptions) {
        settings = $.extend(defaults, commomOptions);
        kenEditorSettings = $.extend(kenEditorSettingDefaults, editorOptions);
        return this.each(function () {
            init();
        });
    }
})(jQuery);