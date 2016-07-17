(function () {
    "use strict";
    //set global variables;
    var $search_wrapper = $(".page-header"),
        $students_arr = $(".student-item"),
        default_items_per_page = 10,
        $page_wrapper = $(".page");

    // Append necessary html to index.html
    $search_wrapper.append('<div class="student-search"><input id="search-input" placeholder="Search for students..."> <button id="confirm-search">Search</button></div>');
    $page_wrapper.append('<div class="pagination"></div>');

    // Function for calculating and adding page links to the html
    function paginationLinks(arr, items_per_page) {
        var page_count = Math.ceil(arr.length / items_per_page),
            page_links_html = '<ul class="pagination-list">';

        for(var i = 1; i <= page_count; i += 1) {
            if(i === 1) {
                page_links_html += '<li rel="' + i + '"><a class="active" href="#">' + i + '</a></li> ';
            } else {
                page_links_html += '<li rel="' + i + '" ><a href="#">' + i + '</a></li> ';
            }
        }

        page_links_html += '</ul>';

        $(".pagination").html(page_links_html);
    }

    // Function for showing the set number of items on the page based on which page the user clicks
    function paginateItems(arr, page_number, items_per_page) {
        var i = (page_number - 1) * items_per_page,
            l = i + (items_per_page - 1);

        $(arr).hide();

        for(i; i <= l; i += 1) {
            $(arr[i]).fadeIn();
        }
    }

    // Function for adding the active class to the clicked page link
    function showActivePage(clickedItem) {
        $(':first-child').removeClass('active');
        $(':first-child', clickedItem).addClass('active');
    }

    // Function for searching through the students array by name or email and displaying the results
    // If there are more then the set number of results pagination is implemented here as well
    function filterStudents(arr, search_term) {
        $students_arr.hide();
        $('.pagination').off('click', 'li');
        $('#no-results').remove();
        var filter_arr = [];
        arr = $.makeArray(arr);
        search_term = search_term.toLowerCase();

        arr.forEach(function (current_item) {
            var name = $(current_item).find('h3').text();
            var email = $('.email', current_item).text();

            if ( ~name.indexOf(search_term) || ~email.indexOf(search_term)) {
                filter_arr.push(current_item);
            }
        });

        if(filter_arr.length > default_items_per_page) {
            paginateItems(filter_arr, 1, default_items_per_page);
            paginationLinks(filter_arr, default_items_per_page);

            $('.pagination').on('click', 'li', function (event) {
                var that = event.currentTarget;
                var clicked_page = +$(that).attr('rel');
                paginateItems(filter_arr, clicked_page, default_items_per_page);
                showActivePage(that);
            });
        } else {
            $(".pagination").html('');
            filter_arr.forEach(function(current_item) {
                $(current_item).show();
            })
        }

        if(filter_arr.length === 0) {
            $page_wrapper.append('<div id="no-results"><h3>We\'re sorry no results match your search.</h3></div>');
        }
    }

    // See if original array is longer than set number of items, if it is then call the necessary pagination functions
    if ($students_arr.length > default_items_per_page) {
        paginateItems($students_arr, 1, default_items_per_page);
        paginationLinks($students_arr, default_items_per_page);

        // Add click event handler to the page links calling pagination functions on click
        $('.pagination').on('click', 'li', function (event) {
            var that = event.currentTarget;
            var clicked_page = +$(that).attr('rel');
            paginateItems($students_arr, clicked_page, default_items_per_page);
            showActivePage(that);
        });
    }

    // Add click handler to the search button calling the filter function
    $(document).on('click', '#confirm-search', function () {
        var input_value = $('#search-input').val();
        filterStudents($students_arr, input_value);
    });

    // Add keyup event handler which calls the filter function each time the user types a letter in the search input
    $(document).on('keyup', '#search-input', function () {
        var input_value = $(this).val();
        filterStudents($students_arr, input_value)
    });

}());
