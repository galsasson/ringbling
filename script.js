(function(){
    var models = [];
    var downloadAllButton = document.createElement("button");
    var modelWidth = 587 > (window.innerWidth - 80) ? window.innerWidth - 80 : 587;
    var modelHeight = modelWidth * .5;
    downloadAllButton.id = "downloadAllButton";

    $("#addSplint").click(function(e) {
        var numberOfSplints = $(".splints .splint").length + 1;
        var newSplint = $(".templates .splint").clone();
        var splintName = newSplint.find(".splintName input");
        var splintMeasurement1 = newSplint.find(".splintMeasurement1 input");
        var splintMeasurement2 = newSplint.find(".splintMeasurement2 input");

        newSplint.data("splintNumber", numberOfSplints);
        splintName.attr("id", "splintName" + numberOfSplints);
        splintName.attr("name", "splintName" + numberOfSplints);
        splintName.attr("value", "Splint " + numberOfSplints);
        newSplint.find(".splintName label").attr("for", "splint" + numberOfSplints);

        splintMeasurement1.attr("id", "splint" + numberOfSplints + "Measurement1");
        splintMeasurement1.attr("name", "splint" + numberOfSplints + "Measurement1");
        newSplint.find(".splintMeasurement1 label").attr("for",  "splint" + numberOfSplints + "Measurement1");

        splintMeasurement2.attr("id", "splint" + numberOfSplints + "Measurement2");
        splintMeasurement2.attr("name", "splint" + numberOfSplints + "Measurement2");
        newSplint.find(".splintMeasurement2 label").attr("for",  "splint" + numberOfSplints + "Measurement2");

        newSplint.find("#splintNModel").attr("id", "splint" + numberOfSplints + "Model");

        newSplint.find(".removeSplint").click(clickRemoveSplint);
        newSplint.find(".downloadButton").click(downloadSplintFile);

        newSplint.insertBefore($("#addSplint"));
        if ($("#downloadAllButton").length === 0) {
            $("main").append(downloadAllButton);
            downloadAllButton.addEventListener("click",downloadAll);
        }
        $("#downloadAllButton").text("Download All (" + numberOfSplints + ")");
        // Model container needs to be inserted before it can be loaded
        $("#splint"+ numberOfSplints +"Measurement1").change(updateSize1);
        $("#splint"+ numberOfSplints +"Measurement2").change(updateSize2);
        models["splint"+numberOfSplints+"Model"]  = ParametricApp();
        models["splint"+numberOfSplints+"Model"].loadModel("splint"+numberOfSplints+"Model", modelWidth, modelHeight, false, true);
    });
    function disableDownloadAllButton() {
        $("#downloadAllButton").prop("disabled", true);
        $("#downloadAllButton").text("Processing your download…");
    }
    function enableDownloadAllButton() {
        $("#downloadAllButton").prop("disabled", false);
        $("#downloadAllButton").text("Download All (" + $(".splints .splint").length + ")");
    }
    function downloadAll() {
        var modelsData = [];
        disableDownloadAllButton();
        for (var splintNumber = 1; splintNumber <= $(".splints .splint").length; splintNumber++) {
            modelsData.push(models["splint" + splintNumber + "Model"].downloadModel(
                $("#splintName" + splintNumber).val(),
                "ADD_FILE_TO_ZIP"
            ));
        }
        addFilesToZip(modelsData);
    }
    function addFilesToZip(modelsData) {
        function addFileToZip (model_index) {
            var fd = new FormData();
            fd.append('fname', modelsData[model_index].filename);
            fd.append('data', modelsData[model_index].blob);
            $.ajax({
                type: 'POST',
                url: '/upload.php',
                data: fd,
                processData: false,
                contentType: false
            }).done(function(data) {
                if (model_index < modelsData.length - 1) {
                    addFileToZip(model_index+1);
                } else {
                    window.location = "download.php";
                    enableDownloadAllButton();
                }
            });
        }
        addFileToZip(0);
    }
    function clickRemoveSplint(e) {
        $(e.target).parents(".splint").remove();
    }
    $(".removeSplint").click(clickRemoveSplint);

    function downloadSplintFile(e) {
        var splintNumber = $(e.target).parents(".splint").data("splintNumber");
        models["splint" + splintNumber + "Model"].downloadModel($("#splintName" + splintNumber).val());
    }
    $(".downloadButton").click(downloadSplintFile);

    function updateSize1(e) {
        var splintNumber = $(e.target).parents(".splint").data("splintNumber");
        models["splint" + splintNumber + "Model"].onSizeChange1(e.target.value);
    }
    $("#splint1Measurement1").change(updateSize1);
    function updateSize2(e) {
        var splintNumber = $(e.target).parents(".splint").data("splintNumber");
        models["splint" + splintNumber + "Model"].onSizeChange2(e.target.value);
    }
    $("#splint1Measurement2").change(updateSize2);

    models = {"splint1Model" : ParametricApp()};

    models["splint1Model"].loadModel("splint1Model", modelWidth, modelHeight, false, true);
}());