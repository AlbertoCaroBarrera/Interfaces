window.addEventListener("load", function () {
    let calendar = null;

    function editEvent(event) {
        $('#event-modal input[name="event-index"]').val(event ? event.id : '');
        $('#event-modal input[name="event-name"]').val(event ? event.name : '');
        $('#event-modal input[name="event-location"]').val(event ? event.location : '');
        $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
        $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
        $('#event-modal').modal();
    }

    function deleteEvent(event) {
        var dataSource = calendar.getDataSource();

        calendar.setDataSource(dataSource.filter(item => item.id !== event.id));
    }

    function saveEvent() {
        var event = {
            id: $('#event-modal input[name="event-index"]').val(),
            name: $('#event-modal input[name="event-name"]').val(),
            location: $('#event-modal input[name="event-location"]').val(),
            startDate: $('#event-modal input[name="event-start-date"]').datepicker('getDate'),
            endDate: $('#event-modal input[name="event-end-date"]').datepicker('getDate')
        }

        var dataSource = calendar.getDataSource();

        if (event.id) {
            for (var i in dataSource) {
                if (dataSource[i].id == event.id) {
                    dataSource[i].name = event.name;
                    dataSource[i].location = event.location;
                    dataSource[i].startDate = event.startDate;
                    dataSource[i].endDate = event.endDate;
                }
            }
        }
        else {
            var newId = 0;
            for (var i in dataSource) {
                if (dataSource[i].id > newId) {
                    newId = dataSource[i].id;
                }
            }

            newId++;
            event.id = newId;

            dataSource.push(event);
        }

        calendar.setDataSource(dataSource);
        $('#event-modal').modal('hide');
    }

    $(function () {
        var currentYear = new Date().getFullYear();

        calendar = new Calendar('#calendar', {
            language: 'es',
            enableContextMenu: true,
            enableRangeSelection: true,
            contextMenuItems: [
                {
                    text: 'Update',
                    click: editEvent
                },
                {
                    text: 'Delete',
                    click: deleteEvent
                }
            ],
            selectRange: function (e) {
                editEvent({ startDate: e.startDate, endDate: e.endDate });
            },
            mouseOnDay: function (e) {
                if (e.events.length > 0) {
                    var content = '';

                    for (var i in e.events) {
                        content += '<div class="event-tooltip-content">'
                            + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
                            + '<div class="event-location">' + e.events[i].location + '</div>'
                            + '</div>';
                    }

                    $(e.element).popover({
                        trigger: 'manual',
                        container: 'body',
                        html: true,
                        content: content
                    });

                    $(e.element).popover('show');
                }
            },
            mouseOutDay: function (e) {
                if (e.events.length > 0) {
                    $(e.element).popover('hide');
                }
            },
            dayContextMenu: function (e) {
                $(e.element).popover('hide');
            },
            dataSource: [
                {
                    id: 0,
                    name: 'Final de clases',
                    location: 'Ultimo mes de clases',
                    startDate: new Date(currentYear, 1, 1),
                    endDate: new Date(currentYear, 1, 29)
                }
            ]
        });

        $('#save-event').click(function () {
            saveEvent();
        });
    });

});