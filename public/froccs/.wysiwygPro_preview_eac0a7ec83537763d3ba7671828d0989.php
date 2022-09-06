<?php
if ($_GET['randomId'] != "Ybs0P5qnviYdklB2TiSC3uqeQoXxVde4wxzpcZu6yWobRILbVhHkPFb3hldonPbB") {
    echo "Access Denied";
    exit();
}

// display the HTML code:
echo stripslashes($_POST['wproPreviewHTML']);

?>  
