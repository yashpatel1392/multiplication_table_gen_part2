/**
 * Name: Yash Patel
 * Email: Yash_Patel5@student.uml.edu
 * File: generate_table.js
 * 
 * Referred to the given resources, the library, and the following link for learning 
 * about the jQuery Tabs:
 *          https://jqueryui.com/tabs/
 * 
 */


// dictionary for indicating whether the sliders have moved or not
var slider_status = {"#min_x": false, "#max_x": false, "#min_y": false, "#max_y": false};

// function used for adding a row to the table
function add_row(row_content) {
    return '<tr>' + row_content + '</tr>';
}

// function used for adding data to a cell of a row
function add_cell(cell_content) {
    return '<td>' + cell_content + '</td>';
}

// function used for adding the table headings
function add_heading(heading) {
    return '<th>' + heading + '</th>';
}

// function used for adding tabs and displaying the tables
function add_tab(title, id, content) {
    // checking if the table with this values already exists in one of the tabs
    if ($('#' + id).length == 0) {
        var ul = $('<ul>'); // creating the ul element (would be appended to the div if it didn't exist)
        
        // creating the list item for the tab
        var li = $('<li>', {id: "tab" + id}).append(
                $('<a>', {href: '#' + id, text: title})).append(
                $('<button>', {id: "button" + id, class: 'remove_button', text: 'x'}));

        // creating the div which would have the content of this tab
        var div = $('<div>').attr('id', id);
        div.html(content);

        if ($('#multiplication_table ul').length == 0) {      
            ul.append(li);
            $('#multiplication_table').append(ul);

            // new div "table_wrapper" is added for making styling for the tables in the tabs convenient
            var new_div = $("<div>").attr("id", "table_wrapper");;
            $('#multiplication_table').append(new_div);
            $('#table_wrapper').append(div);

            // creating the tabs
            $('#multiplication_table').tabs();
        } 
        else {
            $('#multiplication_table ul').append(li);
            $('#table_wrapper').append(div);

            // refreshing after a tab has been added
            $('#multiplication_table').tabs("refresh");
        }   
        
        // modifying the default ui tab styling to set padding to 0 for the table to look better
        $(".ui-tabs .ui-tabs-panel").css('padding', '0');

        $('#multiplication_table').on('click', '.remove_button', function () {
            // getting the corresponding list item id which should be deleted
            var cor_li_id = $(this).closest('li').attr('id');

            console.log(cor_li_id);
            console.log(cor_li_id.substring(3));

            $('#' + cor_li_id).remove(); // removing the list item
            $('#' + cor_li_id.substring(3)).remove(); // removing the corresponding div, this div id is the id for
                                                      // the li without the first three letter (which is "tab") 

            // destroying the tabbed interface once the last tab is deleted
            if ($('#multiplication_table li').length == 0) { 
                $('#multiplication_table ul').remove();
                $('#table_wrapper').remove();
                $('#multiplication_table').tabs("destroy");
            } 
            else { // refreshing after a tab has been removed
                $('#multiplication_table').tabs("refresh");
            }
        });  
    } 
}

// function used for generating multiplication table, which is triggered when the generate button is clicked
// added the parameter save, so when save is true it will add the table to the tab, when it is false it would 
// just display the table
function generate_multiplication_table(save) {
    // reading the values from the form, and converting them to numbers as the input values are text by default
    var min_x = Number(document.getElementById('min_x').value);
    var max_x = Number(document.getElementById('max_x').value);
    var min_y = Number(document.getElementById('min_y').value);
    var max_y = Number(document.getElementById('max_y').value);

    console.log(min_x);
    console.log(max_x);
    console.log(min_y);
    console.log(max_y);

    var mult_table = '<table class="mult_table">';

    // writing the column heading
    var headings = add_heading('');
    for (var x = min_x; x <= max_x; x++) {
        headings += add_heading(x);
    }
    mult_table += add_row(headings);

    // writing the rows
    for (var i = min_y; i <= max_y; i++) {
        row_content = add_cell(i);
        for (var j = min_x; j <= max_x; j++) {
            row_content += add_cell(i * j);
        }
        mult_table += add_row(row_content);
    }
    mult_table += '</table>';


    var id = 'x' +  min_x + max_x + 'y' + min_y + max_y;
    var title = 'Column:(' +  min_x + ',' + max_x + ') Row:(' + min_y + ',' + max_y + ')';

    if (save) { // this block is executed when saving the table to a tab
        add_tab(title, id, mult_table);
    }
    else { // this block is only for displaying the table
        $("#display_table").html(mult_table);
    }
}

// function for creating the sliders
function create_slider(name) {
    var slider = $(name + "_slider").slider({
        range: "true",
        min: -50,
        max: 50,
        // this following function is called when the slider is actually moving
        slide: function(event, ui) {  
            // updating the value in the text box to keep it matched with the slider
            $(name).val(ui.value);

            // following if block is for checking whether all sliders has been moved at least oncee
            if (slider_status["#min_x"] && slider_status["#max_x"] &&
                slider_status["#min_y"] && slider_status["#max_y"]) {
                    if($("#numbers").valid()){
                        generate_multiplication_table(false);
                    }
            }
        },
        // this following function is called right after the slider is stops moving
        stop: function(event, ui) {  
            // updating the value in the text box to keep it matched with the slider
            $(name).val(ui.value);
            
            // changing this to true to indicate that this slider has moved
            if (!slider_status[name]) {
                slider_status[name] = true;
            }

            // following if block is for checking whether all sliders has been moved at least once
            // only for the first time, the table is generated when all sliders has been moved once
            // after that the table is generated dynamically whenever the sliders moves
            if (slider_status["#min_x"] && slider_status["#max_x"] &&
                slider_status["#min_y"] && slider_status["#max_y"]) {
                    if($("#numbers").valid()){
                        generate_multiplication_table(false);
                    }
            }
        }
    });

    // following function is used to slide the slider when the value is entered in the textbox
    $(name).on("change", function(){
        slider.slider("value", $(name).val());

        // changing this to true to indicate that this textbox has been used
        if (!slider_status[name]) {
            slider_status[name] = true;
        }

        // following if block is for checking whether all sliders has been moved at least oncee
        if (slider_status["#min_x"] && slider_status["#max_x"] &&
            slider_status["#min_y"] && slider_status["#max_y"]) {
                if($("#numbers").valid()){
                    generate_multiplication_table(false);
                }
        }
    });
}

// following two functions are the custom rules for verifying that the  
// mins are smaller than the maxs and the maxs are greater than the mins
$.validator.addMethod("lessthan", function(value, element, param) {
    return parseFloat(value) < parseFloat($(param).val());
});
$.validator.addMethod("greaterthan", function(value, element, param) {
    return parseFloat(value) > parseFloat($(param).val());
});

$(document).ready(function () {
    // creating the four sliders
    create_slider("#min_x");
    create_slider("#max_x");
    create_slider("#min_y");
    create_slider("#max_y");

    // using validator to valid the inputs
    $("#numbers").validate({
        // rules specify that each input is required, should be a number between -50 and 50,
        // and min_x and min_y should always be less than max_x and max_y respectively, and
        // max_x and max_y should always be greater than min_x and min_y respectively.
        rules: {
            min_x: {
                required: true,
                number: true,
                range: [-50, 50],
                lessthan: "#max_x"
            },
            max_x: {
                required: true,
                number: true,
                range: [-50, 50],
                greaterthan: "#min_x"
            },
            min_y: {
                required: true,
                number: true,
                range: [-50, 50],
                lessthan: "#max_y"
            },
            max_y: {
                required: true,
                number: true,
                range: [-50, 50],
                greaterthan: "#min_y"
            }
        },
        messages: {
            min_x: {
                required: "This is required field. Please enter a number between -50 and 50.",
                number: "This field should be a number. Please enter a number between -50 and 50.",
                range: "Minimum Column Value is out of range. Please enter a number between -50 and 50.",
                lessthan: "Maximum Column Value is less than Minimum Column Value, please enter valid numbers."
            },
            max_x: {
                required: "This is required field. Please enter a number between -50 and 50.",
                number: "This field should be a number. Please enter a number between -50 and 50.",
                range: "Maximum Column Value is out of range. Please enter a number between -50 and 50.",
                greaterthan: "Minimum Column Value is greater than Maximum Column Value, please enter valid numbers."
            },
            min_y: {
                required: "This is required field. Please enter a number between -50 and 50.",
                number: "This field should be a number. Please enter a number between -50 and 50.",
                range: "Minimum Row Value is out of range. Please enter a number between -50 and 50.",
                lessthan: "Maximum Row Value is less than Minimum Row Value, please enter valid numbers."
            },
            max_y: {
                required: "This is required field. Please enter a number between -50 and 50.",
                number: "This field should be a number. Please enter a number between -50 and 50.",
                range: "Maximum Row Value is out of range. Please enter a number between -50 and 50.",
                greaterthan: "Minimum Row Value is greater than Maximum Row Value, please enter valid numbers."
            }
        },
        submitHandler: function () { // this is called when the save button is clicked to save the table to a tab
            generate_multiplication_table(true);
        }
    });    
});
