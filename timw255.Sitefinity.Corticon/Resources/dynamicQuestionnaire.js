$(document).ready(function() {
    var questions = kendo.observable({
        contents: [],
        cleared: true,
        getQuestionGroup: function(id) {
            return this.get('contents').filter(q => q.group == id);
        },
        removeQuestionGroup: function(id) {
            var filtered = this.get('contents').filter(q => q.group != id);
            this.set('contents', filtered);
        },
        add: function(item) {
            this.contents.push(item);
            this.set('cleared', false);
        },
        clear: function() {
            var contents = this.get('contents');
            contents.splice(0, contents.length);
            this.set('cleared', true);
        }
    });

    var results = kendo.observable({
        contents: [],
        cleared: true,
        getResults: function() {
            return this.get('contents');
        },
        add: function(item) {
            var found = false;

            var itemJSON = JSON.stringify(item);

            for (var i = 0; i < this.contents.length; i ++) {
                var current = this.contents[i];
                if (JSON.stringify(current) === itemJSON) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                this.contents.push(item);
                this.set("cleared", false);
            }
        },
        clear: function() {
            var contents = this.get("contents");
            contents.splice(0, contents.length);
            this.set("cleared", true);
        }
    });

    var viewModel = kendo.observable({
        dsEndpoint: dqConfig.CorticonServiceEndpoint,
        dsName: dqConfig.CorticonServiceName,
        dsMajorVersion: dqConfig.CorticonServiceMajorVersion,
        dsMinorVersion: dqConfig.CorticonServiceMinorVersion,
        questions: questions,
        results: results,
        currentGroup: 0,
        showQuestions: function() {
            return !this.questions.get('cleared');
        },
        showBack: function() {
            return this.get('currentGroup') > 1;
        },
        showResults: function() {
            return !this.results.get('cleared');
        },
        currentQuestions: function() {
            return this.questions.getQuestionGroup(this.get('currentGroup'));
        },
        currentResults: function() {
            return this.results.getResults();
        }
    });

    kendo.data.binders.visibleWithFadeIn = kendo.data.Binder.extend({
        refresh: function () {
            var value = this.bindings.visibleWithFadeIn.get();
            var speed = $(this.element).data("fade-speed") || 'fast';

            if (value) {
                $(this.element).fadeIn(speed);
            } else {
                $(this.element).hide();
            }
        }
    });

    kendo.bind($('#dynamic-questionnaire'), viewModel);

    $('#start').on('click', function (e) {
        e.preventDefault();
        doStep();
    });

    $('#next').on('click', function (e) {
        e.preventDefault();
        doStep();
    });

    $('#back').on('click', function (e) {
        e.preventDefault();
        var groupId = viewModel.get('currentGroup');

        if (groupId > 1) {
            if (!results.get('cleared')) {
                results.clear();
            }
            viewModel.set('currentGroup', groupId - 1);
            questions.removeQuestionGroup(groupId);
        }
        else {
            questions.clear();
            results.clear();
        }
    });

    $('.reset').on('click', function (e) {
        results.clear();
        viewModel.set('currentGroup', 0);
        questions.clear();
        doStep();
    });

    $('#dynamic-questionnaire').on('click', '.apply-online', function (e) {
        window.location = dqConfig.ApplyOnlineUrl;
    });

    function doStep() {
        var data = getFormattedRequestBody();

        var headers = {
            dsName: viewModel.get('dsName')
        };

        if (viewModel.get('dsMajorVersion') != null) {
            headers.dsMajorVersion = viewModel.get('dsMajorVersion');
        }

        if (viewModel.get('dsMinorVersion') != null) {
            headers.dsMinorVersion = viewModel.get('dsMinorVersion');
        }

        $.ajax({
            url: viewModel.get('dsEndpoint') + '/corticon/execute',
            headers: headers,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: data,
            success: success,
            error: error
        });
    }

    function getFormattedRequestBody() {
        var requestBody = {
            Objects: []
        };

        for (i = 0; i < questions.contents.length; i++) {
            var o = questions.contents[i];
            o.sequence = o.sequence.toString();
            requestBody.Objects.push(o);
        }

        return JSON.stringify(requestBody);
    }

    function success(data) {
        var cQuestions = data.Objects.filter(o => o.__metadata['#type'] == 'Question');
        var cResults = data.Objects.filter(o => o.__metadata['#type'] == 'Result');
        
        if (cResults.length) {
            handleResults(cResults);
            return;
        }

        handleQuestions(cQuestions);
    }

    function error() {
        console.log('Something bad has happened...');
    }

    function handleQuestions(cQuestions) {
        var newQuestions = cQuestions.filter(q => !q.hasOwnProperty('answer'));

        if (newQuestions.length) {
            var groupId = viewModel.get('currentGroup') + 1;

            viewModel.set('currentGroup', groupId);

            for (i = 0; i < newQuestions.length; i++) {
                var question = newQuestions[i];

                question.answer = null,
                question.group = groupId,
                question.field = {
                    name: '',
                    label: '',
                    type: ''
                };
                question.field.name = newQuestions[i].code;
                question.field.options = newQuestions[i].hasOwnProperty('possibleValues') ? newQuestions[i].possibleValues.split(',') : [];

                if (question.field.options.length) {
                    question.field.type = 'select';
                }
                else {
                    question.field.type = 'text';
                }

                questions.add(question);
            }
        }
        else {
            viewModel.questions.clear();
        }
    }

    function handleResults(cResults) {
        if (cResults.length > 1 || (cResults[0].sequence != 0)) {
            var filters = [];

            for (i = 0; i < cResults.length; i++) {
                var filter = '';

                if (i > 0) {
                    filter += 'or';
                }
                filters.push(dqConfig.ContentIdentifier + ' eq \'' + cResults[i].id + '\'');
            }

            $.ajax({
                url: dqConfig.ContentSourceEndpoint + '?$filter=' + filters.join(' ') + '&$expand=Image',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    for (i = 0; i < data.value.length; i++) {
                        var obj1 = data.value[i];
                        var obj2 = cResults.filter(r => r.id == obj1[dqConfig.ContentIdentifier])[0];

                        obj1.Corticon = {};

                        obj2.data.split(',').forEach(function(x) {
                            var arr = x.split('=');
                            arr[1] && (obj1.Corticon[arr[0].replace(/\s+/g, '')] = arr[1]);
                        });

                        results.add(obj1);
                    }
                },
                error: error
            });
        }
        else {
            results.add(cResults[0])
        }
    }

    doStep();
});