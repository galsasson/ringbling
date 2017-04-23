<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ring Bling</title>
    <script src="js/libs/jquery-1.10.2.min.js"></script>
    <script src="js/libs/three.js"></script>
    <script src="js/libs/RequestAnimationFrame.js"></script>
    <script src="js/libs/OrbitControls.js"></script>
    <script src="js/libs/dat.gui.js"></script>
    <script src="js/libs/STLExporter.js"></script>
    <script src="js/libs/download.js"></script>
    <script src="js/siris_sizes.js"></script>
    <script src="js/ResourceManager.js"></script>
    <script src="js/ParametricApp.js"></script>
    <script src="js/Ring2.js"></script>
    <script src="js/RingBling.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Alegreya+Sans+SC' rel='stylesheet' type='text/css'>
    <link href='styles.css' rel='stylesheet' type='text/css'>
    <link rel="icon" type="image/png" href="/favicon.png" />
  </head>
  <body>
    <header>
        <h1><img width="215" height="120" alt="Ring Bling Logo" src="/images/ring-bling.svg" /></h1>
        <h2><a title="FAQ Page" href="/faq/"><img width="127" height="130" title="Frequently Asked Questions" alt="Frequently Asked Questions Logo" src="/images/faq.svg" /></a></h2>
    </header>
    <main>
        <header>
            <h1>Model your 3D-printable custom ring splints</h1>
            <h2>Enter your <a href="/faq/#siris">Siris ring sizes</a> below and watch as your custom ring splint is designed. Click <span class="downloadButtonMock">Download</span> to download an <a href="/faq/#stl">.stl file</a> for each 3D model, which you can use to <a href="/faq/#print">3D print your ring splints</a>.</h2>
        </header>
        <section class="splints">
            <article class="splint" data-splint-number="1">
                <fieldset class="splintName">
                    <input id="splintName1" name="splintName1" value="Splint 1" type="text" />
                    <label for="splintName1">Splint name</label>
                </fieldset>
                <fieldset class="splintMeasurement splintMeasurement1">
                    <input min="1" max="16" id="splint1Measurement1" name="splint1Measurement1" value="10" type="number" />
                    <label for="splint1Measurement1">Ring 1 Size</label>
                </fieldset><!--
                --><fieldset class="splintMeasurement splintMeasurement2">
                    <input min="1" max="16" id="splint1Measurement2" name="splint1Measurement2" value="10" type="number" />
                    <label for="splint1Measurement2">Ring 2 Size</label>
                </fieldset>
                <br />
                <a class="sizerHelp" href="/faq/#sizing">Need help with sizing?</a>
                <div class="model3d" id="splint1Model"></div>
                <button class="downloadButton">Download</button>
                <button class="removeSplint" title="Remove splint"><img width="30" height="30" alt="Close button" src="images/x.svg" /></button>
            </article>
            <button title="Add a splint" id="addSplint"><img width="122" height="122" alt="Add Splint Button" src="images/addSplint.svg" /> </button>
        </section>
    </main>
    <footer>Built at <a href="http://www.nyc.tomglobal.org">TOM NYC</a></footer>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <div class="templates">
        <article class="splint" data-splint-number="N">
            <fieldset class="splintName">
                <input id="splintNameN" name="splintNameN" value="Splint " type="text" />
                <label for="splintNameN">Splint name</label>
            </fieldset>
            <fieldset class="splintMeasurement splintMeasurement1">
                <input min="1" max="16" id="splintNMeasurement1" name="splintNMeasurement1" value="10" type="number" />
                <label for="splintNMeasurement1">Ring 1 Size</label>
            </fieldset><!--
            --><fieldset class="splintMeasurement splintMeasurement2">
                <input min="1" max="16" id="splintNMeasurement2" name="splintNMeasurement2" value="10" type="number" />
                <label for="splintNMeasurement2">Ring 2 Size</label>
            </fieldset>
            <br />
            <a class="sizerHelp" href="/faq/#sizing">Need help with sizing?</a>
            <div class="model3d" id="splintNModel"></div>
            <button class="downloadButton">Download</button>
            <button class="removeSplint" title="Remove splint"><img width="30" height="30" alt="Close button" src="images/x.svg" /></button>
        </article>
    </div>
    <script type="text/javascript">
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
    </script>
  </body>
</html>