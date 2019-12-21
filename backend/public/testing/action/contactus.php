<?php
if($_POST['user_email']){

    $to = "contact.mabasir@gmail.com‬";
    $subject = "You received new request!";
    
    $message = "
    <html>
    <head>
    <title>You received new request!</title>
    </head>
    <body>
    <p>Email from: ".$_POST['user_email']."</p>
    <p>User name: ".$_POST['user_name']."</p>
    <p>User phone number: (".$_POST['user_phone_number_prefix'].")".$_POST['user_phonenumber']."</p>
    <p>Message:</p>
    <p>".$_POST['user_message']."</p>
    <table>
    <tr>
    <th>Firstname</th>
    <th>Lastname</th>
    </tr>
    <tr>
    <td>John</td>
    <td>Doe</td>
    </tr>
    </table>
    </body>
    </html>
    ";
    
    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    
    // More headers
    $headers .= 'From: <'.$_POST['user_email'].'>' . "\r\n";
    // $headers .= 'Cc: myboss@example.com' . "\r\n";
    
    mail($to,$subject,$message,$headers);
    header("Location: /index.php?success=true");
}
else{
    header("Location: /index.php?success=false");
}
