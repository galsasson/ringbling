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
    splintName.attr("id", "splint" + numberOfSplints);
    splintName.attr("name", "splint" + numberOfSplints);
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
    }
    $("#downloadAllButton").text("Download All (" + numberOfSplints + ")");
    // Model container needs to be inserted before it can be loaded
    $("#splint"+ numberOfSplints +"Measurement1").change(updateSize1);
    $("#splint"+ numberOfSplints +"Measurement2").change(updateSize2);
    models["splint"+numberOfSplints+"Model"]  = ParametricApp();
    models["splint"+numberOfSplints+"Model"].loadModel("splint"+numberOfSplints+"Model", modelWidth, modelHeight, false, true);
});
function clickRemoveSplint(e) {
    $(e.target).parents(".splint").remove();
}
$(".removeSplint").click(clickRemoveSplint);

function downloadSplintFile(e) {
    var splintNumber = $(e.target).parents(".splint").data("splintNumber");
    models["splint" + splintNumber + "Model"].downloadModel($(e.target).parents(".splint").find(".splintName input").val());
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