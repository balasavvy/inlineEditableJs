(function($) {

    $.fn.inlineEdiTable = function(options) {
        //Default Options
        var settings = $.extend({
            customColumns: "",
            customdata: "",
            addCallback: function() {},
            editCallback: function() {},
            deleteCallback: function() {},
            cancelCallback: function() {},
            saveCallback: function() {},
            disableCoumntoEdit: {},
            editBtn: "false",
            deleteBtn: "false",
            addBtn: "false",
            scrollStatus: "false",
            scroll: null,
            pagination: "false",
            rowsConatiner: '',
            paginationConatiner: "",
            itemsCount: 7,
            isDisabled: false,
            currentPage: 1,
            pageSize: 2,
            allPagesLabel: 'All',
            firstPageLabel: '<<',
            lastPageLabel: '>>',
            nextPageLabel: '>',
            previousPageLabel: '<'
        }, options);
        var target;
        var updatedValues = {};
        var rowId;
        var currentRecord = {};
        var headers = [];
        var tableData = [];

     

        return this.each(function(index) {
            
            var elem = $(this);
            
            initializetoolTips(); //initiate ToolTips
            var tableget = $(this).attr("id");
            var tableId = "#" + tableget;
           function settableData(jsonData) {
                tableData = jsonData;
            }

            function getcustomFields(id) {
                if (id) {
                    tableData = settings.customdata[id];
                } else {
                    tableData = settings.customdata;
                }
                return tableData;
            }

            function replacespecialChar(string) {
                if (string) {
                    var newString = string.replace(/ /g, '_'); // convert spaces to underscores
                    newString = newString.replace(/^_+|_+$/g, ''); // remove leading & trailing underscores
                    newString = newString.trim();
                    newString = newString.replace(/[^a-zA-Z0-9_+ ]/ig, ''); // remove special characters
                    newString = newString.replace(/_+/g, '_'); // converts multiple underscores to single
                    return newString.toUpperCase();
                }
            }

            function settableHeaders(tableColumns) {

                headers = tableColumns;
            }

            function gettableHeaders() {

                return headers;

            }
            /**Pagination Functionality Starts*/
            var $container = settings.paginationConatiner,
                ALL = -1,
                PREVIOUS_PAGE_NUMBER = -1,
                NEXT_PAGE_NUMBER = -2,
                FIRST_PAGE_NUMBER = -3,
                LAST_PAGE_NUMBER = -4;
            getRenderedPager = function(target) {
                  
                return '<ul class="pagination pagination' + index + '">' + getRenderedPageNumbers(target) + '</ul>';
            };

            getRenderedPageNumbers = function(target) {
              
                var pageNumbers = getPageNumbersToDisplay(target),
                    result;
                result = '<li ><a data-page="' + FIRST_PAGE_NUMBER + '" ><span aria-hidden="true">' + settings.firstPageLabel + '</span></a></li>' +
                    '<li ><a data-page="' + PREVIOUS_PAGE_NUMBER + '"><span aria-hidden="true">' + settings.previousPageLabel + '</span></a></li><li class="pageNumber">';

                $.each(pageNumbers, function(i, p) {

                    result += ' <a data-page="' + p + '" ' + (p === settings.currentPage ? 'class="active pagination-active"' : '') + '>' + p + '</a>';
                });

                result += '</li><li ><a data-page="' + NEXT_PAGE_NUMBER + '"><span aria-hidden="true">' + settings.nextPageLabel + '</span></a></li>' +
                    '<li ><a data-page="' + LAST_PAGE_NUMBER + '"><span aria-hidden="true">' + settings.lastPageLabel + '</span></a></li>';

                return result;
            };
            toggleElements = function(pageID, target, paginationLi) {
                var paginationId = $('#' + pageID);
                var pageCount = getPagesCount(target);

                $(target).next($('#' + pageID)).find('a[data-page="' + PREVIOUS_PAGE_NUMBER + '"]').addClass("pagination-arrow text-normal").parents('li').toggleClass('disabled', settings.currentPage === 1);
                $(target).next($('#' + pageID)).find('a[data-page="' + NEXT_PAGE_NUMBER + '"]').addClass("pagination-arrow text-normal").parents('li').toggleClass('disabled', settings.currentPage === pageCount);
                $(target).next($('#' + pageID)).find('a[data-page="' + FIRST_PAGE_NUMBER + '"]').addClass("pagination-arrow text-normal").parents('li').toggleClass('disabled', settings.currentPage === 1);
                $(target).next($('#' + pageID)).find('a[data-page="' + LAST_PAGE_NUMBER + '"]').addClass("pagination-arrow text-normal").parents('li').toggleClass('disabled', settings.currentPage === pageCount);
            };
            onPageClick = function(event) {
                
                var target = event.data.target;
               
                var paginationId = event.data.paginationId;
                var paginationUi = event.data.paginationUi;
                var paginationLi = event.data.paginationLi
                var $p = $(this),
                    page = $p.data('page');

                if (!settings.isDisabled && !$p.hasClass('active')) {

                    switch (page) {
                        case PREVIOUS_PAGE_NUMBER:
                            goPreviousPage(paginationUi, target);
                            break;
                        case NEXT_PAGE_NUMBER:

                            goNextPage(paginationUi, target);
                            break;
                        case FIRST_PAGE_NUMBER:
                            goToFirstPage(paginationUi, target);
                            break;
                        case LAST_PAGE_NUMBER:

                            goToLastPage(paginationUi, target);
                            break;
                        default:
                            goToPage(page, target, paginationUi);

                            break;
                    }

                    toggleElements(paginationId, target, paginationLi);
                }
            };
            getPageNumbersToDisplay = function(target) {
                var pageNumbers = [],
                    startFromNumber,
                    pagesToShow = 5,
                    i = 1,
                    pageCount = getPagesCount(target);
                  
                if (pageCount < 5) {
                    pagesToShow = pageCount;
                }

                if (settings.currentPage === 1 || settings.currentPage === 2) {
                    startFromNumber = 1;
                } else if (settings.currentPage === pageCount) {
                    startFromNumber = settings.currentPage - (pagesToShow - 1);
                } else if ((pageCount - settings.currentPage) === 1 && pageCount >= 5) {
                    startFromNumber = settings.currentPage - 3;
                } else {
                    startFromNumber = settings.currentPage - 2;
                }

                while (i <= pagesToShow) {
                    pageNumbers.push(startFromNumber++);
                    i++;
                }

                return pageNumbers;
            };
            getPagesCount = function(target) {
              
                var itemlength = ($(target + " tr").length) - 1;
                
                return Math.ceil(itemlength / settings.pageSize);
            };



            goNextPage = function(paginationUi, target) {
                
                if (settings.currentPage < getPagesCount(target)) {

                    settings.currentPage++;
                    reRenderPageNumbers(paginationUi, target);
                    process(target);
                }
            };

            goPreviousPage = function(paginationUi, target) {
                if (settings.currentPage > 1) {
                    settings.currentPage--;
                    reRenderPageNumbers(paginationUi, target);
                    process(target);
                }
            };

            goToFirstPage = function(paginationUi, target) {
                var lengthItemm = $(target).next(paginationUi).find('.pageNumber').children().length;
                settings.currentPage = lengthItemm;
                if (settings.currentPage !== 1) {
                    goToPage(1, target, paginationUi);
                }

            };

            goToLastPage = function(paginationUi, target) {
                var pageCount = getPagesCount(target);
                settings.currentPage = 1;
                if (settings.currentPage !== pageCount) {
                    goToPage(pageCount, target, paginationUi);
                }
            };

            goToPage = function(pageNumber, target, paginationUi) {

                settings.currentPage = pageNumber;

                reRenderPageNumbers(paginationUi, target);
                process(target);
            };
            reRenderPageNumbers = function(paginationUi, target) {

                $(paginationUi).html(getRenderedPageNumbers(target));
            };

            changePageSize = function(ps) {
                settings.pageSize = ps;
                goToPage(1);
            };

            process = function(target) {

                var start = settings.pageSize * (settings.currentPage - 1),
                    end = start + settings.pageSize;

                var length = $(target).find("tr.rows").length;

                $(target).find("tr.rows").hide();
                for (var i = start; i < end; i++) {
                    $(target).find("tr.rows").eq(i).show();
                }

            };
            /**Pagination Functionality Starts*/

            //Trigger Click Functionality to add new row
            $(tableId).prev('button').click(function() {
                var paginationID = $(target).parent("div").next(settings.paginationConatiner).attr('id')

                createtableRow(tableId, paginationID);

            });
            //Build the table
            buildinlineTable(tableId, settings.customColumns, settings.customdata)

            /**
             * This function is to retrieve the type of input field (like checkbox, textbox, select)
             *
             */
            function getfieldType(fieldName) {
                var fieldType;
                $.each(gettableHeaders(), function(index, obj) {
                    if (fieldName == obj.name)
                        fieldType = obj.fieldType
                });
                return fieldType;
            }

            /**
             * This function is to retrieve the values for the select box
             *
             */
            function getfieldValues(fieldName) {
                var optionvalues = [];
                $.each(gettableHeaders(), function(index, obj) {
                    if (fieldName == obj.name)
                        optionvalues = obj.fieldValues
                });
                return optionvalues;
            }
            /**
             * This function is create the datatable from the server side data for the first time
             */
            function buildinlineTable(tableId, columnHeaders, tableData) {

                target = tableId;
                cleartable(target);
                settableHeaders(columnHeaders);
                settableData(tableData);
                
                var data = getcustomFields(); // returns data array
                var header = gettableHeaders(); // returns table headers
                var hdata = '';
                var rdata = '';

                hdata += '<thead>\n<tr>';

                $.each(header, function(index, obj) {
                    if (obj.displayName == "Add") {
                        if (settings.addBtn == "true") {
                            hdata += '<th width="" class="addbtn"><a href="javascript:void(0);"><div  data-tab="' + target + '">Add</div></a></th>'
                        } else {
                            hdata += '<th width="">-</th>'
                        }


                    } else {
                        hdata += '<th width="">' + obj.displayName + '</th>'
                    }

                });
                hdata += '</tr>\n</thead>'
                $(target).append(hdata);
                //Create the table body
                rdata += '<tbody>';
                for (key in data) {
                    rdata += ('<tr class="rows" data-id="' + key + '">');

                    for (subkey in data[key]) {
                        var fieldbox = getfieldType(subkey);
                        switch (fieldbox) {
                            case 'checkbox':
                                var checked = '';
                                if (data[key][subkey] == true) {
                                    var checked = 'checked';
                                }
                                rdata += '<td class="text-center"><input type="checkbox" data-field="' + subkey + '" disabled ' + checked + ' /></td>';
                                break;
                            case 'select':
                                var fieldTypeName = '';
                                var fieldTypeVal = '';
                                var fieldValues = getfieldValues(subkey);
                                $.each(fieldValues, function(i, l) {
                                    if (l[0] == data[key][subkey]) {

                                        fieldTypeName = fieldValues[i][1];
                                        fieldTypeVal = fieldValues[i][0];
                                    }
                                })
                                rdata += '<td><span class="field" data-field="' + subkey + '">' + fieldTypeName + '</span><select class="form-control input-sm" data-field="' + subkey + '" style="display:none;">';
                                var options = buildfieldTypeSelect(data[key][subkey], key, fieldValues);
                                rdata += options + '</select></td>';
                                break;
                            case 'datetimepicker':
                                rdata += '<td><span class="field" data-field="' + subkey + '">' + data[key][subkey] + '</span><div class="input-group date dynamicDate"  style="display:none"><input type="text" class="form-control" data-field="' + subkey + '" value="" placeholder="MM - DD - YYYY"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></td>';

                                break;
                            default:
                                rdata += '<td><span class="field" data-field="' + subkey + '">' + data[key][subkey] + '</span><input type="text" class="form-control input-sm" data-field="' + subkey + '" value="' + data[key][subkey] + '" style="display:none;" /></td>';
                        }
                    }
                    if (settings.editBtn == "true" && settings.deleteBtn == "true") {

                        rdata += '<td class="text-center"><button style="border:none;background:transparent" class=" text-primary text-bold text-underline" data-edit="' + key + '">Edit</button><button style="border:none;background:transparent" class="text-underline text-primary text-bold" data-delete="' + key + '">Delete</button><button  class="text-underline text-primary text-bold" style="display:none;border:none;background:transparent" data-save="' + key + '">Save</span></button><button class="text-underline text-primary text-bold" style="display:none;border:none;background:transparent" data-cancel="' + key + '">Cancel</button></td>';
                    } else if (settings.editBtn == "true") {

                        rdata += '<td class="text-center"><button style="border:none;background:transparent" class=" text-primary text-bold text-underline" data-edit="' + key + '">Edit<button  class="text-underline text-primary text-bold" style="display:none;border:none;background:transparent" data-save="' + key + '">Save</span></button><button class="text-underline text-primary text-bold" style="display:none;border:none;background:transparent" data-cancel="' + key + '">Cancel</button></td>';
                    } else {
                        rdata += '<td class="text-center"><button style="border:none;background:transparent" class="text-underline text-primary text-bold" data-delete="' + key + '">Delete</button><button  class="text-underline text-primary text-bold savebtn" style="display:none;border:none;background:transparent" data-save="' + key + '">Save</span></button><button class="text-underline text-primary text-bold" style="display:none;border:none;background:transparent" data-cancel="' + key + '">Cancel</button></td>';
                    }

                    rdata += '</tr>';
                }

                rdata += ('</tbody>');
                $(target).append(rdata);
                var dataLength = data.length;
                rowId = dataLength
                initializebtns();
               
                if (settings.pagination == "true") {

                    var pageID = $(target).next(settings.paginationConatiner).attr('id');
                    if (pageID == "undefined" || pageID == "") {

                    } else {
                        $("#" + pageID).html(getRenderedPager(target));
                        $pagesContainer = $("#" + pageID).find('.pagination' + index);

                        var paginationLi = $("#" + pageID).find('.pagination' + index).find('li.pageNumber > a').length;
                        $pagesContainer.on("click", "li a", {
                            target: target,
                            paginationUi: $pagesContainer,
                            paginationLi: paginationLi,
                            paginationId: pageID
                        }, onPageClick);
                        toggleElements(pageID, target, paginationLi);

                        process(target);

                    }

                }



            }

            function cleartable(target) {
                $(target).empty();

            }

            function resetform(target) {
                var currentID = $(target + ' tfoot tr').data('id');
                var newID = parseInt(currentID) + 1;
                $(target + ' tfoot tr').attr('data-id', newID);
            }

            //Function to handle the update/delete/cancel actions to the fields
            function updatefields(id, type) {
                var updatedRecord = gettableRowValues(id);
                //Logic if the save button is pressed
                if (type == 'save') {
                    if (isNaN(id)) {
                        updatedRecord["actionType"] = 'Add';
                    } else {
                        updatedRecord["actionType"] = 'Update';
                    }
                    for (xkey in updatedRecord) {

                        var options = getfieldValues(xkey);
                        if (options.length > 0) {
                            $.each(options, function(i, l) {
                                if (l[0] == updatedRecord[xkey]) {
                                    fieldTypeName = options[i][1];
                                    fieldTypeVal = options[i][0];
                                }
                            })

                            $(target + ' tr[data-id="' + id + '"] .field[data-field="' + xkey + '"]').html(fieldTypeName);
                        } else {
                            $(target + ' tr[data-id="' + id + '"] .field[data-field="' + xkey + '"]').html(updatedRecord[xkey]);
                        }
                    }
                }
                //Logic if the delete button is pressed
                if (type == 'delete') {
                    updatedRecord["actionType"] = 'Delete';
                    $(target + ' tr[data-id="' + id + '"]').remove();
                }
                if (type == 'cancel') {
                  
                    
                }
                if (isNaN(id) && (type == 'delete')) {
                    //Delete the record from the array as it is newly added record
                    delete updatedValues[id];
                } else if (type != 'cancel') {
                    updatedValues[id] = updatedRecord;
                }
                console.log(updatedValues);
                //Logic if the delete button is pressed
                if (type == 'cancel') {
                    //Reset the original values
                    settableRowValues(id);
                }

            };
            //Function to toggle between read only and editable mode
            function togglerow(row, actiontype) {


                //$(target + ' tr[data-id="' + row + '"]').toggleClass('success');
                $(target + ' tr[data-id="' + row + '"] td button[data-edit]').toggle();
                $(target + ' tr[data-id="' + row + '"] td button[data-delete]').toggle();
                $(target + ' tr[data-id="' + row + '"] td button[data-save]').toggle();
                $(target + ' tr[data-id="' + row + '"] td button[data-cancel]').toggle();
                $(target + ' tr[data-id="' + row + '"] td').children('input:not([type="checkbox"])').toggle();
                $(target + ' tr[data-id="' + row + '"] td').children('select').toggle();
                $(target + ' tr[data-id="' + row + '"] td').children('.dynamicDate').toggle();
                $(target + ' tr[data-id="' + row + '"] td').children('span.field').toggle();
                //Enable / Diasable all the checkboxes
                var tableColumns = gettableHeaders();
                $.each(tableColumns, function(index, columnObj) {

                    if (columnObj.name != 'actions') {
                        $.each(settings.disableCoumntoEdit.name, function(i) {
                            if (settings.disableCoumntoEdit.name[i] == columnObj.name) {

                                if (actiontype == 'edit') {
                                    // $(target + ' tr[data-id="' + row + '"] td select').attr("readonly","readonly");
                                    $(target + ' tr[data-id="' + row + '"] td input[data-field="' + columnObj.name + '"]').prop({
                                        readonly: true
                                    }).prop("disabled", "true");;
                                    $(target + ' tr[data-id="' + row + '"] td select[data-field="' + columnObj.name + '"]').attr("readonly", "readonly");
                                    $(target + ' tr[data-id="' + row + '"] td select[data-field="' + columnObj.name + '"]').prop("disabled", "true");

                                }

                            }
                            if (columnObj.fieldType == 'checkbox') {

                                if (actiontype == 'edit') {

                                    if (settings.disableCoumntoEdit.name[i] == columnObj.name) {


                                        $(target + ' tr[data-id="' + row + '"] td input[data-field="' + columnObj.name + '"]').prop({
                                            disabled: true
                                        });

                                    } else {

                                        $(target + ' tr[data-id="' + row + '"] td input[data-field="' + columnObj.name + '"]').prop({
                                            disabled: false
                                        });

                                    }

                                } else {
                                    $(target + ' tr[data-id="' + row + '"] td input[data-field="' + columnObj.name + '"]').prop({
                                        disabled: true
                                    });
                                }

                            }

                        });
                    }
                });

            }
            //Function to change the mode to editable
            function changemodefn(row, element, type) {

                switch (type) {
                    case 'edit':
                        togglerow(row, type);
                        currentRecord = gettableRowValues(row);
                        lockBtns(target);
                        break;
                    case 'delete':
                        updatefields(row, type);
                        togglerow(row, type);
                        break;
                    case 'save':
                        updatefields(row, type);
                        togglerow(row, type);
                        release_locks(target);
                        break;
                    case 'cancel':
                        updatefields(row, type);
                        togglerow(row, type);
                        release_locks(target);
                    default:
                        break;
                }
            }
            //Function to initialize the button functions   
            function initializebtns(tableRow) {
               
                $(target + ' select').on('change', function(e) {
                    e.preventDefault();
                    var id = $(this).parent().parent().data('id');

                });
                $(target + ' input[data-field="fieldName"]').on('focusout', function(e) {
                    var value = $(this).val();
                    value = replacespecialChar(value);
                    $(this).val(value);
                })
                $("body").on('click', target + ' button[data-edit]', function(e) {
                    e.preventDefault();
                    if (settings.editCallback) {
                        settings.editCallback.call();
                    }

                    $('.dynamicDate').trigger("click");
                    var row = $(this).data('edit');
                    changemodefn(row, $(this), 'edit');

                })
                $("body").on('click', target + ' button[data-delete]', function(e) {
                    e.preventDefault();
                    if (settings.deleteCallback) {
                        settings.deleteCallback.call();
                    }
                    var row = $(this).data('delete');
                    changemodefn(row, $(this), 'delete');
                })

                $("body").on('click', target + ' button[data-cancel]', function(e) {
                    e.preventDefault();
                    if (settings.cancelCallback) {
                        settings.cancelCallback.call();
                    }
                    var row = $(this).data('cancel');
                    var parentTr=$(this).parents('tr');
                    var $inputfields = $(this).parents('tr').find("input");
                    var $selectfields =$(this).parents('tr').find("select");
                    var $emptyFields = $inputfields.filter(function() {
                        return $.trim(this.value) === "";
                    });
                    var $emptySelectFields = $selectfields.filter(function() {
                        return $.trim(this.value) === "";
                    });
                    $(target + ' tr.newRow[data-id="' + row + '"] ').remove();
                    //check all fields are empty
//                    if ($emptyFields.length || $emptySelectFields.length) { 
//                        $(target + ' tr.newRow[data-id="' + row + '"] ').remove();
//                    }                    
                     changemodefn(row,$(this),'cancel');
//                    var rowuniqueId = $(this).parents('tr').data('id');
//                   
//                    var removeCcanceldRow = rowuniqueId.replace(/[A-Za-z$-]/g, "");;
//                    var finalRow = (parseInt(removeCcanceldRow) - 1); 
//                  
//                    changemodefn("N" + finalRow, $(this), 'cancel');
                })


                $("body").on('click', target + ' button[data-save]', function(e) {
                    e.preventDefault();
                    if (settings.saveCallback) {
                        settings.saveCallback.call();
                    }
                    console.log('inside save');
                    $('.dynamicDate').trigger("click");
                    $(this).parents('tr').removeClass("newRow");
                    var row = $(this).data('save');
                    changemodefn(row, $(this), 'save');
                    getnewRecords();
                })
            }

            function destroyPagination(target, paginationID) {
                $("#" + paginationID).empty();
                $(target).find("tr.rows").show();

            }
            //This function creates a new row when add button is pressed            
            function createtableRow(target, paginationID) {
                if (settings.addCallback) {
                    settings.addCallback.call();
                }
                //destroyPagination(target,paginationID);//destroy pagination

                var tableColumns = gettableHeaders();
                var rowdata = "";

                rowId = rowId + 1;

                var uniqueRowId = 'N' + rowId
                rowdata += ('<tr class="rows newRow" data-id="' + uniqueRowId + '">');

                $.each(tableColumns, function(index, columnObj) {

                    if (columnObj.name != 'actions') {
                        switch (columnObj.fieldType) {
                            case 'checkbox':
                                rowdata += '<td class="text-center"><input type="checkbox" data-field="' + columnObj.name + '" disabled /></td>';
                                break;
                            case 'select':
                                var fieldValues = getfieldValues(columnObj.name);
                                rowdata += '<td><span class="field" data-field="' + columnObj.name + '"></span><select class="form-control input-sm" data-field="' + columnObj.name + '" style="display:none;">';
                                var options = buildfieldTypeSelect("", uniqueRowId, fieldValues);
                                rowdata += options + '</select></td>';

                                break;

                            case 'datetimepicker':
                                rowdata += '<td><span class="field" data-field="' + columnObj.name + '"></span><div class="input-group date dynamicDate" id="fromDateClinic1' + index + '" style="display:none"><input type="text" class="form-control" data-field="' + columnObj.name + '" value="" placeholder="MM - DD - YYYY"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></td>';


                                break;
                            default:
                                rowdata += '<td><span class="field" data-field="' + columnObj.name + '"></span><input type="text" class="form-control input-sm" data-field="' + columnObj.name + '" value="" style="display:none;" /></td>';
                        }
                    }

                });

                rowdata += '<td class="text-center"><button style="border:none;background:transparent" class="text-underline text-primary text-bold" data-edit="' + uniqueRowId + '">Edit</button><button style="border:none;background:transparent" class="text-underline text-primary text-bold" data-delete="' + uniqueRowId + '">Delete</button><button  class="text-underline text-primary text-bold savebtn" style="display:none;border:none;background:transparent" data-save="' + uniqueRowId + '">Save</button><button class="text-underline text-primary text-bold" style="display:none;border:none;background:transparent" data-cancel="' + uniqueRowId + '">Cancel</button></td>';
                rowdata += '</tr>';    
                
                if(settings.pagination == "false"){                    
                $(target).append(rowdata);    
                }else{
                    
                     $(target).prepend(rowdata);   
                      var pageID = $(target).next(settings.paginationConatiner).attr('id');
                    if (pageID == "undefined" || pageID == "") {

                    } else {
                      
                        $("#" + pageID).html(getRenderedPager(target));
                        $pagesContainer = $("#" + pageID).find('.pagination' + index);

                        var paginationLi = $("#" + pageID).find('.pagination' + index).find('li.pageNumber > a').length;
                        $pagesContainer.on("click", "li a", {
                            target: target,
                            paginationUi: $pagesContainer,
                            paginationLi: paginationLi,
                            paginationId: pageID
                        }, onPageClick);
                        toggleElements(pageID, target, paginationLi);

                        process(target);

                    }
                
                }
                if (settings.pagination == "true") {
              

                }
                
                $('.dynamicDate').trigger("click");
                changemodefn(uniqueRowId, this, 'edit');


            }

            //Get the current values of the row which is to be edited.This will be useful if the user cancels the edit action
            function gettableRowValues(id) {
                var rowRecord = {};
                var colums = gettableHeaders();
                $.each(colums, function(index, column) {
                    if (column.name != 'actions') {
                        switch (column.fieldType) {
                            case 'checkbox':
                                rowRecord[column.name] = $(target + ' tr[data-id="' + id + '"] input[data-field="' + column.name + '"]').is(':checked');
                                break;
                            case 'select':
                                rowRecord[column.name] = $(target + ' tr[data-id="' + id + '"] select[data-field="' + column.name + '"] option:selected').val();
                                break;
                            case 'datetimepicker':

                                rowRecord[column.name] = $(target + ' tr[data-id="' + id + '"] input[data-field="' + column.name + '"]').val();

                                break;
                            default:
                                rowRecord[column.name] = $(target + ' tr[data-id="' + id + '"] input[data-field="' + column.name + '"]').val();
                        }
                    }
                });
                return rowRecord;
            }
            //This function is used to set the original values incase of cancel
            function settableRowValues(id) {
                var colums = gettableHeaders();
                $.each(colums, function(index, column) {
                    switch (column.fieldType) {
                        case 'checkbox':
                            $(target + ' tr[data-id="' + id + '"] input[data-field="' + column.name + '"]').prop('checked', currentRecord[column.name]);
                            break;
                        case 'select':
                            $(target + ' tr[data-id="' + id + '"] select[data-field="' + column.name + '"]').val(currentRecord[column.name]);
                            break;
                        case 'datetimeticker':
                            $(target + ' tr[data-id="' + id + '"] input[data-field="' + column.name + '"]').val(currentRecord[column.name]);
                            break;
                        default:
                            $(target + ' tr[data-id="' + id + '"] input[data-field="' + column.name + '"]').val(currentRecord[column.name]);
                    }
                });

            }
            //Lock the action buttons and allow to edit only one record at a time
            function lockBtns(target) {
                // Disable add button
                $(target + " .addbtn").prop("disabled", true);
                $('button[data-edit]').prop("disabled", true);
            }
            //Release the locks on the action buttons once save or cancel action is performed
            function release_locks(target) {
                // Enable add button
                $(target + " .addbtn").prop("disabled", false);
                $('button[data-edit]').prop("disabled", false);
            }
            //Function to return all added/modified/deleted records in the table
            function getAllrecords() {
                return updatedValues;
            }
            //Function to return only newly added records
            function getnewRecords() {
                var newRecords = new Array();

                $.each(updatedValues, function(valueIndex, newObj) {
                    if (newObj.actionType == 'Add') {
                        newRecords.push(newObj);

                        var paginationID = $(target).parent("div").next(settings.paginationConatiner).attr('id')
                        destroyPagination(target, paginationID);
                        console.log(newRecords);
                        if (settings.pagination == "true") {

                            var pageID = $(target).parent("div").next(settings.paginationConatiner).attr('id');


                            if (pageID == "undefined" || pageID == "") {


                            } else {
                                var pageCount = getPagesCount(target);

                                $("#" + pageID).html(getRenderedPager(target));
                                $pagesContainer = $("#" + pageID).find('.pagination' + index);


                                var paginationLi = $("#" + pageID).find('.pagination' + index).find('li.pageNumber > a').length;

                                $pagesContainer.on("click", "li a", {
                                    target: target,
                                    paginationUi: $pagesContainer,
                                    paginationLi: paginationLi,
                                    paginationId: pageID
                                }, onPageClick);
                                toggleElements(pageID, target, paginationLi);

                                process(target);

                            }

                        }
                    }
                });
                return newRecords;
            }

            //Function to return only modified records
            function getmodifiedRecords() {
                var modRecords = new Array();
                $.each(updatedValues, function(valueIndex, newObj) {
                    if (newObj.actionType == 'Update')
                        modRecords.push(newObj);
                });
                return modRecords;
            }

            //Function to return only deleted records
            function getDeletedRecords() {
                var delRecords = new Array();
                $.each(updatedValues, function(valueIndex, newObj) {
                    if (newObj.actionType == 'Delete')
                        delRecords.push(newObj);
                });
                return delRecords;
            }

            //Function to submit the records
            function submitrecords() {
                var records = getAllrecords();
                console.log(records);
            }

            //Initialize the tooltips for the buttons
            function initializetoolTips() {
                $('button[data-cancel]').tooltip({
                    placement: 'top',
                    title: 'Cancel',
                    delay: {
                        show: 800,
                        hide: 0
                    }
                });
                $('button[data-edit]').tooltip({
                    placement: 'top',
                    title: 'Edit',
                    delay: {
                        show: 800,
                        hide: 0
                    }
                });
                $('button[data-save]').tooltip({
                    placement: 'top',
                    title: 'Save',
                    delay: {
                        show: 800,
                        hide: 0
                    }
                });
                $('button[data-delete]').tooltip({
                    placement: 'top',
                    title: 'Delete',
                    delay: {
                        show: 800,
                        hide: 0
                    }
                });
            }

            function buildfieldTypeSelect(selected, id, fieldValues) {
                var t = fieldValues;
                var options = '';
                var limit = t.length;
                if (id > 2) {
                    limit = limit - 1;
                }
                for (i = 0; i < limit; i++) {
                    if (t[i][0] == selected) {
                        options += '<option value="' + t[i][0] + '" selected>' + t[i][1] + '</option>'
                    } else {
                        options += '<option value="' + t[i][0] + '">' + t[i][1] + '</option>'
                    }
                }
                return options;
            }

        });

    };


}(jQuery));