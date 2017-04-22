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
    <script src="js/ResourceManager.js"></script>
    <script src="js/ParametricApp.js"></script>
    <script src="js/Ring2.js"></script>
    <script src="js/RingBling.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Alegreya+Sans+SC' rel='stylesheet' type='text/css'>
    <style type='text/css'>
        @font-face {
            font-family: 'WorkSans-Light';
            src: url('fonts/WorkSans-Light.eot');
            src: url('fonts/WorkSans-Light.woff') format('woff'), url('fonts/WorkSans-Light.ttf') format('truetype'), url('fonts/WorkSans-Light.svg') format('svg');
            font-weight: normal;
            font-style: normal;
        }
        * {
            font-weight:100;
            font-family: 'WorkSans-Light';
            box-sizing:border-box;
        }
        a {
            text-decoration:none;
            color:black;
            border-bottom:1px dashed black;
            display:inline-block;
        }
        input {
            color:#3D5AFE;
            padding-left:10px;
            border:none;
        }
        label {
            text-transform:uppercase;
            color:#3D5AFE;
            letter-spacing:1.5px;
            margin-top:3px;
            display:block;
        }
        button {
            background:none;
            border:none;
        }
        button:hover {
            cursor:pointer;
        }
        html, body, header {
            width:100%;
        }
        fieldset {
            border:none;
            display:inline-block;
            margin:0;
            padding:0;
            vertical-align:top;
        }
        html, body, header, h1, h2, h3 {
            padding:0;
            margin:0;
        }
        .templates {
            display:none;
        }
        .downloadButtonMock {
            display:inline-block;
            padding:5px 15px;
            font-size:11pt;
            vertical-align:middle;
        }
        .downloadButtonMock, main > .splints .downloadButton, #downloadAllButton {
            color:white;
            text-transform:uppercase;
            background-color:#3D5AFE;
            border:none;
            border-radius:20px;
            letter-spacing:2px;
        }
        body > header {
            height:280px;
            background:red;
            overflow:hidden;
            padding:40px;
            margin-bottom:40px;
            position:relative;
        }
        body > header a {
            border-bottom:0;
        }
        body > header h1, body > header h2 {
            display:inline-block;
        }
        body > header h1 {
            line-height:100px;
            vertical-align:middle;
        }
        body > header h2 {
            position:absolute;
            right:60px;
            top:50px;
        }
        main > header {
            padding-left:40px;
            padding-right:40px;
        }
        main > header > h1 {
            font-size:45pt;
            color:#F44336;
            margin-top:21px;
            margin-bottom:30px;
        }
        main > header > h1, main > header > h2 {
            width:794px;
        }
        main > header > h2 {
            font-size:22pt;
            margin-bottom:21px;
        }
        main > .splints {
            margin: 40px 0 100px 0;
            position:relative;
        }
        main > .splints .splint {
            padding:40px;
            background-color:#F2F2F2;
            position:relative;
            min-height:450px;
        }
        main > .splints .splint:not(:last-of-type) {
            margin-bottom:10px;
        }
        main > .splints .splint .splintName {
            display:block;
            margin-bottom:24px;
        }
        main > .splints .splint .splintName input {
            width:587px;
            height:72px;
            font-size:48px;
            line-height:56px;
            display:block;
        }
        main > .splints .splintMeasurement1 {
            display:inline-block;
            margin-right:10px;
        }
        main > .splints .splintMeasurement1 input, main > .splints .splintMeasurement2 input {
            height:72px;
            width:175px;
            font-size:48px;
            line-height:56px;
            display:block;
        }
        main > .splints .splintMeasurement1 label {
            font-size:18px;
        }
        main > .splints .sizerHelp {
            color:#999999;
            font-size:18pt;
            margin-top:24px;
        }
        main > .splints .model3d {
            display:inline-block;
            position:absolute;
            bottom:40px;
            right:40px;
        }
        main > .splints .downloadButton {
            bottom:40px;
            left:40px;
            position:absolute;
            padding:7px 20px;
            font-size:18pt;
            border-radius:50px;
        }
        main > .splints .removeSplint {
            position:absolute;
            background:none;
            top:40px;
            right:40px;
            color:black;
            border:none;
        }
        #addSplint {
            position:absolute;
            right:40px;
            bottom:-80px;
        }
        #addSplint:before {
            content:"Add a splint";
            text-transform:UPPERCASE;
            position:absolute;
            left:-170px;
            bottom:35px;
            color:#F44336;
            font-size:18pt;
        }
        #downloadAllButton {
            margin-top:20px 0;
            padding:15px 30px;
            color:white;
            background-color:#3D5AFE;
            position:relative;
            margin-left:40px;
            margin-bottom:60px;
            font-size:24pt;
            line-height:32px;
            border-radius:60px;
        }
        footer {
            background-color:black;
            min-height:100px;
            width:100%;
            color:white;
            padding:40px;
            font-size:18pt;
        }
        footer a {
            color:white;
            border-bottom:1px dashed white;
        }
    </style>
  </head>
  <body>
    <header>
        <h1><img width="350" height="196" alt="Ring Bling Logo" src="images/ring-bling.svg" /></h1>
        <h2><a title="FAQ Page" href="/FAQ"><img width="175" height="180" title="Frequently Asked Questions" alt="Frequently Asked Questions Logo" src="images/faq.svg" /></a></h2>
    </header>
    <main>
        <header>
            <h1>Model your 3D-printable custom ring splints</h1>
            <h2>Enter your <a href="/FAQ#siris">Siris ring sizes</a> below and watch as your custom ring splint is designed. Click <span class="downloadButtonMock">Download</span> to download an <a href="/FAQ#stl">.stl file</a> for each 3D model, which you can use to <a href="/FAQ#print">3D print your ring splints</a>.</h2>
        </header>
        <section class="splints">
            <article class="splint" data-splint-number="1">
                <fieldset class="splintName">
                    <input id="splintName1" name="splintName1" value="Splint 1" type="text" />
                    <label for="splintName1">Splint name</label>
                </fieldset>
                <fieldset class="splintMeasurement1">
                    <input id="splint1Measurement1" name="splint1Measurement1" value="1" type="number" />
                    <label for="splint1Measurement1">Ring 1 Size</label>
                </fieldset>
                <fieldset class="splintMeasurement2">
                    <input id="splint1Measurement2" name="splint1Measurement2" value="1" type="number" />
                    <label for="splint1Measurement2">Ring 2 Size</label>
                </fieldset>
                <br />
                <a class="sizerHelp" href="FAQ#sizing">Need help with sizing?</a>
                <div class="model3d" id="splint1Model"></div>
                <button class="downloadButton">Download</button>
                <button class="removeSplint" title="Remove splint"><img width="30" height="30" alt="Close button" src="images/x.svg" /></button>
            </article>
            <button title="Add a splint" id="addSplint"><img width="100" height="100" alt="Add Splint Button" src="images/addSplint.svg" /> </button>
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
            <fieldset class="splintMeasurement1">
                <input id="splintNMeasurement1" name="splintNMeasurement1" value="1" type="number" />
                <label for="splintNMeasurement1">Ring 1 Size</label>
            </fieldset>
            <fieldset class="splintMeasurement2">
                <input id="splintNMeasurement2" name="splintNMeasurement2" value="1" type="number" />
                <label for="splintNMeasurement2">Ring 2 Size</label>
            </fieldset>
            <br />
            <a class="sizerHelp" href="FAQ#sizing">Need help with sizing?</a>
            <div class="model3d" id="splintNModel"></div>
            <button class="downloadButton">Download</button>
            <button class="removeSplint" title="Remove splint"><img width="30" height="30" alt="Close button" src="images/x.svg" /></button>
        </article>
    </div>
    <script type="text/javascript">
        var models = [];
        var downloadAllButton = document.createElement("button");
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
            models["splint"+numberOfSplints+"Model"].loadModel("splint"+numberOfSplints+"Model", 587, 289, false);
        });
        function clickRemoveSplint(e) {
            $(e.target).parents(".splint").remove();
        }
        $(".removeSplint").click(clickRemoveSplint);
        function downloadSplintFile(e) {
            console.log("Attempting to download");
            var splintNumber = $(e.target).parents(".splint").data("splintNumber");
            models["splint" + splintNumber + "Model"].downloadModel();
        }
        $(".downloadButton").click(downloadSplintFile);

        models = {"splint1Model" : ParametricApp()};

        models["splint1Model"].loadModel("splint1Model", 587, 289, false);
    </script>
  </body>
</html>