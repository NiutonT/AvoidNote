
if( $_SERVER['HTTP_X_REQUESTED_WITH'] === null )
{
    // not ajax
}
else
{
   // ajax
}

otra

In vanilla javascript, you need to add this to your ajax:

xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


1. Email del remitente:
 
2. Asunto del mensaje:
 
3. Contenido del mensaje:
 
[sourcecode language="php"]
 
<?php
 
function spamcheck($field)
 
{
 
//filter_var() sanitizes the e-mail address that is inserted
 
// The FILTER_SANITIZE_EMAIL filter removes all forbidden e-mail characters from the inserted string $field=filter_var($field, FILTER_SANITIZE_EMAIL);
 
//filter_var() validates the e-mail address that is inserted
 
// The FILTER_VALIDATE_EMAIL filter validates the value of the text inserted as an e-mail address
 
if(filter_var($field, FILTER_VALIDATE_EMAIL))
 
{
 
return TRUE;
 
}
 
else
 
{
 
return FALSE;
 
}
 
}
 
if (isset($_REQUEST['email']))
 
{//this is a simple check that makes sure the email field not empty
 
//this is the check that uses the validation function to ensure the email address is valid
 
$mailcheck = spamcheck($_REQUEST['email']);
 
if ($mailcheck==FALSE)
 
{
 
echo "You have inserted incorrect email address or have left some of the fields empty";
 
}
 
else
 
{//send email
 
$email = $_REQUEST['email'] ;
 
$subject = $_REQUEST['subject'] ;
 
$message = $_REQUEST['message'] ;
 
mail("test@siteground.com", "Subject: $subject",
 
$message, "From: $email" );
 
echo "Thank you for using our mail form! We will get in touch with you soon!";
 
}
 
}
 
else
 
{//if the "email" field is not filled out the form itself will be displayed.
 
echo "<form method='post' action='contact.php'>
 
Email: <input name='email' type='text' /><br />
 
Subject: <input name='subject' type='text' /><br />
 
Message:<br />
 
<textarea name='message' rows='15' cols='40'>
 
</textarea><br />
 
<input type='submit' />
 
</form>";
 
}
 
?>
 
[/sourcecode]