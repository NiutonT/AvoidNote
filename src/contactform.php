<?php

/*
  PHP contact form script
  Copyrights BootstrapMade.com
*/

/***************** Configuration *****************/

// Enter your email, where you want to receive the messages.
$contact_email_to = "admin@avoidnote.studio";

// Subject prefix
$contact_subject_prefix = "Contat Form Message: ";

// Name too short error text
$contact_error_name = "Name is too short or empty!";

// Email invalid error text
$contact_error_email = "Please enter a valid email!";

// Subject too short error text
$contact_error_subject = "Subject is too short or empty!";

// Message too short error text
$contact_error_message = "Too short message! Please enter something.";


//CosicasBot
define('BOT_TOKEN','693197294:AAEHEAAC5K1JwyOFREd9Ta6Q0LVax7uxDxo');
define('CHAT_ID', '-317367948');

function enviar_telegram($msg) {
  $token = "693197294:AAEHEAAC5K1JwyOFREd9Ta6Q0LVax7uxDxo";
  $id = "-317367948";
  $urlMsg = "https://api.telegram.org/bot{$token}/sendMessage";
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $urlMsg);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, "chat_id={$id}&parse_mode=HTML&text=$msg");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);   
  $server_output = curl_exec($ch);
  curl_close($ch);
};


/********** Do not edit from the below line ***********/
/*
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
  die('Sorry Request must be Ajax POST');
}
*/
  $name = $email = $subject = $message = '';

  $name = filter_var($_POST["snombre"], FILTER_SANITIZE_STRING);
  $email = filter_var($_POST["smail"], FILTER_SANITIZE_EMAIL);
  $subject = filter_var($_POST["sujeto"], FILTER_SANITIZE_STRING);
  $message = filter_var($_POST["mensaje"], FILTER_SANITIZE_STRING);


  if(strlen($name)<4){
    die($contact_error_name);
  }

  if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
    die($contact_error_email); 
  }
  else {
    $contact_email_from = $email;
  }
  

  if(strlen($subject)<3){
    die($contact_error_subject);
  }

  if(strlen($message)<3){
    die($contact_error_message);
  }

  if(!isset($contact_email_from)) {
    $contact_email_from = "contactform@" . @preg_replace('/^www\./','', $_SERVER['SERVER_NAME']);
  }

  $sendemail = mail($contact_email_to, $contact_subject_prefix . $subject, $message,
    "From:  $name <$contact_email_from>" . PHP_EOL .
    "Reply-To: $email" . PHP_EOL .
    "X-Mailer: PHP/" . phpversion()
  );

  if( $sendemail ) {
    echo 'OK';
    $para_tel = 'Nombre: ' . $name . PHP_EOL .'e-mail: ' . $email . PHP_EOL . 'Asunto: ' . $subject . PHP_EOL . 'Mensaje: ' . $message . PHP_EOL;
    
    enviar_telegram($para_tel);

  } else {
    echo 'Could not send mail! Please check your PHP mail configuration.';
  }

?>
