<?php
/* Right now, the session is just for creating
 * a zip file, so it should be reset on page load
 */
session_start();
$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ring Bling</title>
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
            <h2>Enter your <a href="/faq/#sizer">Siris ring sizes</a> below and watch as your custom ring splint is designed. Click <span class="downloadButtonMock">Download</span> to download an <a href="/faq/#stl">.stl file</a> for each 3D model, which you can use to <a href="/faq/#print">3D print your ring splints</a>.</h2>
        </header>
        <section class="splints">
            <article class="splint" data-splint-number="1">
                <fieldset class="splintName">
                    <input id="splintName1" name="splintName1" value="Splint 1" type="text" />
                    <label for="splintName1">Splint name</label>
                </fieldset>
                <fieldset class="splintMeasurement splintMeasurement1">
                    <input min="1" max="40" id="splint1Measurement1" name="splint1Measurement1" value="10" type="number" />
                    <label for="splint1Measurement1">Ring 1 Size</label>
                </fieldset><!--
                --><fieldset class="splintMeasurement splintMeasurement2">
                    <input min="1" max="40" id="splint1Measurement2" name="splint1Measurement2" value="10" type="number" />
                    <label for="splint1Measurement2">Ring 2 Size</label>
                </fieldset>
                <br />
                <a class="sizerHelp" href="/faq/#sizer">Need help with sizing?</a>
                <div class="model3d" id="splint1Model"></div>
                <button class="downloadButton">Download</button>
                <button class="removeSplint" title="Remove splint"><img width="30" height="30" alt="Close button" src="images/x.svg" /></button>
            </article>
            <button title="Add a splint" id="addSplint"><img width="122" height="122" alt="Add Splint Button" src="images/addSplint.svg" /> </button>
        </section>
    </main>
    <footer><p>RingBling.org is a project sponsored by Tikkun Olam Makers (TOM), a registered non-profit organization. It was created by volunteers and is completely open source.</p></footer>
    <div class="templates">
        <article class="splint" data-splint-number="N">
            <fieldset class="splintName">
                <input id="splintNameN" name="splintNameN" value="Splint " type="text" />
                <label for="splintNameN">Splint name</label>
            </fieldset>
            <fieldset class="splintMeasurement splintMeasurement1">
                <input min="1" max="40" id="splintNMeasurement1" name="splintNMeasurement1" value="10" type="number" />
                <label for="splintNMeasurement1">Ring 1 Size</label>
            </fieldset><!--
            --><fieldset class="splintMeasurement splintMeasurement2">
                <input min="1" max="40" id="splintNMeasurement2" name="splintNMeasurement2" value="10" type="number" />
                <label for="splintNMeasurement2">Ring 2 Size</label>
            </fieldset>
            <br />
            <a class="sizerHelp" href="/faq/#sizer">Need help with sizing?</a>
            <div class="model3d" id="splintNModel"></div>
            <button class="downloadButton">Download</button>
            <button class="removeSplint" title="Remove splint"><img width="30" height="30" alt="Close button" src="images/x.svg" /></button>
        </article>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="/script.js" type="text/javascript"></script>
  </body>
</html>