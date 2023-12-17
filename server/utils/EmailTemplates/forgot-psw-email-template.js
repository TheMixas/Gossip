import {origin} from '../../app.js'
export default function forgotPswEmailTemplate(token, email){

    return {
        from: '"Gossip 👻" <gossip-no-reply@outlook.com>',
        to: email,
        subject: "Reset your password",
        text: "Hello world?", // plain text body,
        html:`
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
  .u-row {
    width: 600px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-27 {
    width: 162px !important;
  }

  .u-row .u-col-73 {
    width: 438px !important;
  }

  .u-row .u-col-100 {
    width: 600px !important;
  }

}

@media (max-width: 620px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_heading_1 .v-font-size { font-size: 26px !important; } #u_content_text_1 .v-container-padding-padding { padding: 5px 10px 10px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px 10px 40px !important; } #u_content_button_1 .v-size-width { width: 65% !important; } }
    </style>
  
  

<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
    
  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #4264f0;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #4264f0;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="598" style="background-color: #4264f0;width: 598px;padding: 0px;border-top: 1px solid #ffffff;border-left: 1px solid #ffffff;border-right: 1px solid #ffffff;border-bottom: 1px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #4264f0;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #ffffff;border-left: 1px solid #ffffff;border-right: 1px solid #ffffff;border-bottom: 1px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:19px;font-family:'Raleway',sans-serif;" align="left">
        
  <div class="v-font-size" style="font-size: 21px; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 140%;"><span style="color: #f1c40f; line-height: 29.4px;">Gossip ~ Password Helper<br /></span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #4264f0;width: 600px;padding: 10px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #4264f0;height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 10px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table id="u_content_heading_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Raleway',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-font-size" style="margin: 0px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 35px; font-weight: 400;"><span><span><span><span data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiNjVKak1FdmhsNGVRclpybThWU3JnaSIsInBhc3RlSUQiOjE5Mjk0NTkzOTgsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"></span><span data-buffer="&lt;!--(figma)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(/figma)--&gt;"></span><strong>Forgot your password?<br /></strong></span></span></span></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 50px 10px;font-family:'Raleway',sans-serif;" align="left">
        
  <div class="v-font-size" style="font-size: 20px; color: #ced4d9; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 150%;"><span style="color: #ecf0f1; line-height: 30px;">Enter the code</span> <span style="color: #f1c40f; line-height: 30px;"><strong>${token}</strong></span></p>
<p style="line-height: 150%;">or</p>
<p style="line-height: 150%;"><span style="color: #ecf0f1; line-height: 30px;">Press the button bellow</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_button_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 60px;font-family:'Raleway',sans-serif;" align="left">
        
  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
<div align="center">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:37px; v-text-anchor:middle; width:179px;" arcsize="11%"  stroke="f" fillcolor="#ecca49"><w:anchorlock/><center style="color:#4264f0;"><![endif]-->
    <a href="${origin}/forgot-password/?token=${token}&email=${email}" target="_blank" class="v-button v-size-width v-font-size" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #4264f0; background-color: #ecca49; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:32%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
      <span style="display:block;padding:10px 20px;line-height:120%;"><strong><span style="line-height: 16.8px;">Password Reset</span></strong></span>
    </a>
    <!--[if mso]></center></v:roundrect><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Raleway',sans-serif;" align="left">
        
  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 10px solid #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="162" style="background-color: #4264f0;width: 162px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-27" style="max-width: 320px;min-width: 162px;display: table-cell;vertical-align: top;">
  <div style="background-color: #4264f0;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="438" style="background-color: #4264f0;width: 438px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-73" style="max-width: 320px;min-width: 438px;display: table-cell;vertical-align: top;">
  <div style="background-color: #4264f0;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>

        `
        // html: `<div style="display: flex;flex-direction: column; width:100%;height: 500p;background-color: #3c3f44;" >
        //     <span>Reset your password</span><br/>
        //     <span>Your code is: </span><br/>
        //     <span>${token}</span><br/>
        //     <span>Click the link below to reset your password</span><br/>
        //     <a href="http://localhost:3000/reset-password/${token}">Reset password</a><br/>
        //     <span>This code & link is valid for 3 hours!</span>
        // </div>`

    }
}