import { AccountInformationDto } from "src/users/dto/account-information.dto";
import { HeaderData } from "./email-verif.dto";
import { ShareLinkDto } from "src/events/dto/share-link.dto";

class TemplateHTML {
    public static templateSendEmailVerification = (headerData: HeaderData, token: string): string => {
        return `
        <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="X-UA-Compatible" content="ie=edge" />
              <title>Verify Your Email and Account Information</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                  background-color: rgba(242, 242, 242, 1);
                  color: rgba(0, 0, 0, 1);
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: rgba(255, 255, 255, 1);
                  border-radius: 8px;
                  overflow: hidden;
                }
                .header {
                  background-color: rgba(29, 41, 86, 1); /* primary */
                  color: rgba(255, 255, 255, 1);
                  padding: 30px;
                  text-align: center;
                }
                .logo {
                  max-width: 120px;
                  margin-bottom: 15px;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: bold;
                }
                .content {
                  padding: 30px 40px;
                }
                .content h2 {
                  font-size: 35px;
                  color: rgba(29, 41, 86, 1);
                }
                .content p {
                  font-size: 16px;
                  line-height: 1.6;
                  text-align: start;
                }
                .info-box {
                  background-color: rgba(242, 242, 242, 1);
                  border: 1px solid #eeeeee;
                  border-radius: 5px;
                  padding: 20px;
                  margin: 20px 0;
                }
                .info-box strong {
                  display: block;
                  margin-bottom: 5px;
                  color: #555555;
                }
                .button-container {
                  text-align: center;
                  margin: 30px 0;
                }
                .button {
                  background-color: rgba(236, 93, 42, 1);
                  color: rgba(255, 255, 255, 1);
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 18px;
                  font-weight: bold;
                  display: inline-block;
                }
                .footer {
                  background-color: rgba(242, 242, 242, 1);
                  color: #888888;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                }
                .footer a {
                  color: rgba(29, 41, 86, 1);
                  text-decoration: none;
                }
                .divider {
                  border-bottom: 1px solid #dddddd;
                  margin: 30px 0;
                }
              </style>
            </head>
            <body>
              <table
                width="100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="background-color: rgba(242, 242, 242, 1)"
              >
                <tr>
                  <td align="center" style="padding: 20px">
                    <div class="container">
                      <div class="header">
                        <img
                          src="https://grey-dinosaur-100296.hostingersite.com/public/storage/properties/digistarclub-white.png"
                          alt="Company Logo"
                          class="logo"
                        />
                        <h1>Welcome ${headerData.name}!</h1>
                      </div>

                      <div class="content">
                        <p style="text-align: start;">
                          To complete your email verification, please use the following One-Time PIN (OTP):
                        </p>

                        <h2 style="font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; margin: 35px 0 35px 0; line-height: 28px; font-weight: 700; letter-spacing: 0.5ch;">${token}</h2>
                        <p>
                          This OTP is valid for the next 5 minutes and can only be used once.
                          Do not share this code with anyone for security reasons.
                        </p>
                        <p style="margin-top: 35px; font-style: italic;">
                          If you did not verify your email, please ignore this email or contact our
                          support team immediately.
                        </p>

                        <div class="divider"></div>
                        <p style="text-align: start;">
                          If you have any questions, feel free to contact our support
                          team.
                        </p>
                        <p style="text-align: start; margin-top: 35px;">Thank you,<br /> <b>The Digistar Club Team</b></p>
                      </div>

                      <!-- Footer Section -->
                      <div class="footer">
                        <p>&copy; 2025 Digistar Club. All Rights Reserved.</p>
                        <p>
                          You are receiving this email because you verified your email on our site.
                          If you believe this is a mistake, please ignore this email.
                        </p>
                        <p>
                          <a href="https://club-staging.digistartelkom.id"
                            >Visit Our Site</a
                          >
                          |
                          <a href="https://club-staging.digistartelkom.id"
                            >Privacy Policy</a
                          >
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `
    }

    public static templateSendAccountInformation = (headerData: HeaderData, userData: AccountInformationDto): string => {
      return `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Verify Your Email and Account Information</title>
            <style>
              /* Color palette reference:
                primary: rgba(29, 41, 86, 1)
                secondary: rgba(236, 93, 42, 1)
                accent: rgba(210, 45, 48, 1)
                background: rgba(242, 242, 242, 1)
                light: rgba(255, 255, 255, 1)
                dark: rgba(0, 0, 0, 1)
              */

              body {
                margin: 0;
                padding: 0;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                background-color: rgba(242, 242, 242, 1);
                color: rgba(0, 0, 0, 1);
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: rgba(255, 255, 255, 1);
                border-radius: 8px;
                overflow: hidden;
              }
              .header {
                background-color: rgba(29, 41, 86, 1);
                color: rgba(255, 255, 255, 1);
                padding: 30px;
                text-align: center;
              }
              .logo {
                max-width: 120px;
                margin-bottom: 15px;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .content {
                padding: 30px 40px;
              }
              .content h2 {
                font-size: 22px;
                color: rgba(29, 41, 86, 1);
                margin-top: 0;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
              }
              .info-box {
                background-color: rgba(242, 242, 242, 1);
                border: 1px solid #eeeeee;
                border-radius: 5px;
                padding: 20px;
                margin: 20px 0;
              }
              .info-box strong {
                display: block;
                margin-bottom: 5px;
                color: #555555;
              }
              .button-container {
                text-align: center;
                margin: 30px 0;
              }
              .button {
                background-color: rgba(236, 93, 42, 1);
                color: rgba(255, 255, 255, 1);
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                display: inline-block;
              }
              .footer {
                background-color: rgba(242, 242, 242, 1);
                color: #888888;
                padding: 20px;
                text-align: center;
                font-size: 12px;
              }
              .footer a {
                color: rgba(29, 41, 86, 1);
                text-decoration: none;
              }
              .divider {
                border-bottom: 1px solid #dddddd;
                margin: 30px 0;
              }
            </style>
          </head>
          <body>
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              style="background-color: rgba(242, 242, 242, 1)"
            >
              <tr>
                <td align="center" style="padding: 20px">
                  <div class="container">
                    <div class="header">
                      <img
                        src="https://grey-dinosaur-100296.hostingersite.com/public/storage/properties/digistarclub-white.png"
                        alt="Company Logo"
                        class="logo"
                      />
                      <h1>Welcome ${headerData.name}!</h1>
                    </div>

                    <div class="content">
                      <h2>Your Login Details</h2>
                      <p style="text-align: start;">
                        These are your login details. Please keep them in a safe place
                        and do not share them with anyone.
                      </p>
                      <div class="info-box">
                        <strong>Email:</strong>
                        <span>${userData.email}</span>
                        <br /><br />
                        <strong>Digistar Club ID:</strong>
                        <span>${userData.unique_number}</span>
                        <br /><br />
                        <strong>Password Default:</strong>
                        <span>${userData.password}</span>
                      </div>

                      <div class="divider"></div>
                      <p style="text-align: start;">
                        If you have any questions, feel free to contact our support
                        team.
                      </p>
                      <p style="text-align: start; margin-top: 35px;">Thank you,<br /> <b>The Digistar Club Team</b></p>
                    </div>

                    <div class="footer">
                      <p>&copy; 2025 Digistar Club. All Rights Reserved.</p>
                      <p>
                        You are receiving this email because you registered on our site.
                        If you believe this is a mistake, please ignore this email.
                      </p>
                      <p>
                        <a href="https://club-staging.digistartelkom.id"
                          >Visit Our Site</a
                        >
                        |
                        <a href="https://club-staging.digistartelkom.id"
                          >Privacy Policy</a
                        >
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    }

    public static templateSendZoomLink = (headerData: HeaderData, data: ShareLinkDto): string => {
        return `
        <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="X-UA-Compatible" content="ie=edge" />
              <title>Verify Your Email and Account Information</title>
              <style>
                /* Color palette reference:
                  primary: rgba(29, 41, 86, 1)
                  secondary: rgba(236, 93, 42, 1)
                  accent: rgba(210, 45, 48, 1)
                  background: rgba(242, 242, 242, 1)
                  light: rgba(255, 255, 255, 1)
                  dark: rgba(0, 0, 0, 1)
                */

                body {
                  margin: 0;
                  padding: 0;
                  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                  background-color: rgba(242, 242, 242, 1);
                  color: rgba(0, 0, 0, 1);
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: rgba(255, 255, 255, 1);
                  border-radius: 8px;
                  overflow: hidden;
                }
                .header {
                  background-color: rgba(29, 41, 86, 1); /* primary */
                  color: rgba(255, 255, 255, 1);
                  padding: 30px;
                  text-align: center;
                }
                .logo {
                  max-width: 120px;
                  margin-bottom: 15px;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: bold;
                }
                .content {
                  padding: 30px 40px;
                }
                .content h2 {
                  font-size: 22px;
                  color: rgba(29, 41, 86, 1);
                  margin-top: 0;
                }
                .content p {
                  font-size: 16px;
                  line-height: 1.6;
                }
                .info-box {
                  background-color: rgba(242, 242, 242, 1);
                  border: 1px solid #eeeeee;
                  border-radius: 5px;
                  padding: 20px;
                  margin: 20px 0;
                }
                .info-box strong {
                  display: block;
                  margin-bottom: 5px;
                  color: #555555;
                }
                .button-container {
                  text-align: center;
                  margin: 30px 0;
                }
                .button {
                  background-color: rgba(236, 93, 42, 1);
                  color: rgba(255, 255, 255, 1);
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 18px;
                  font-weight: bold;
                  display: inline-block;
                }
                .footer {
                  background-color: rgba(242, 242, 242, 1);
                  color: #888888;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                }
                .footer a {
                  color: rgba(29, 41, 86, 1);
                  text-decoration: none;
                }
                .divider {
                  border-bottom: 1px solid #dddddd;
                  margin: 30px 0;
                }
              </style>
            </head>
            <body>
              <table
                width="100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="background-color: rgba(242, 242, 242, 1)"
              >
                <tr>
                  <td align="center" style="padding: 20px">
                    <div class="container">
                      <div class="header">
                        <img
                          src="https://grey-dinosaur-100296.hostingersite.com/public/storage/properties/digistarclub-white.png"
                          alt="Company Logo"
                          class="logo"
                        />
                        <h1>Welcome ${data.name}!</h1>
                      </div>

                      <div class="content">
                        <h2>Join Zoom Meeting</h2>
                        <p>You can join the Zoom meeting using the link below:</p>
                        <div class="button-container">
                          <a href="${data.zoom_link}" class="button"
                            >Join Zoom Meeting</a
                          >
                        </div>
                        <p>
                          If the button doesn't work, copy and paste the following URL
                          into your browser:<br /><a href="${data.zoom_link}"
                            >${data.zoom_link}</a
                          >
                        </p>

                        <div class="divider"></div>
                        <p style="text-align: start;">
                          If you have any questions, feel free to contact our support
                          team.
                        </p>
                        <p style="text-align: start; margin-top: 35px;">Thank you,<br /> <b>The Digistar Club Team</b></p>
                      </div>

                      <div class="footer">
                        <p>&copy; 2025 Digistar Club. All Rights Reserved.</p>
                        <p>
                          You are receiving this email because you registered on our site.
                          If you believe this is a mistake, please ignore this email.
                        </p>
                        <p>
                          <a href="https://club-staging.digistartelkom.id"
                            >Visit Our Site</a
                          >
                          |
                          <a href="https://club-staging.digistartelkom.id"
                            >Privacy Policy</a
                          >
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `
    }

    public static templateValidationAccount = (name: string): string => {
        return `
          <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Verify Your Email and Account Information</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    background-color: rgba(242, 242, 242, 1);
                    color: rgba(0, 0, 0, 1);
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: rgba(255, 255, 255, 1);
                    border-radius: 8px;
                    overflow: hidden;
                  }
                  .header {
                    background-color: rgba(29, 41, 86, 1); /* primary */
                    color: rgba(255, 255, 255, 1);
                    padding: 30px;
                    text-align: center;
                  }
                  .logo {
                    max-width: 120px;
                    margin-bottom: 15px;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                  }
                  .content {
                    padding: 30px 40px;
                  }
                  .content h2 {
                    font-size: 35px;
                    color: rgba(29, 41, 86, 1);
                  }
                  .content p {
                    font-size: 16px;
                    line-height: 1.6;
                    text-align: start;
                  }
                  .info-box {
                    background-color: rgba(242, 242, 242, 1);
                    border: 1px solid #eeeeee;
                    border-radius: 5px;
                    padding: 20px;
                    margin: 20px 0;
                  }
                  .info-box strong {
                    display: block;
                    margin-bottom: 5px;
                    color: #555555;
                  }
                  .button-container {
                    text-align: center;
                    margin: 30px 0;
                  }
                  .button {
                    background-color: rgba(236, 93, 42, 1);
                    color: rgba(255, 255, 255, 1);
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 18px;
                    font-weight: bold;
                    display: inline-block;
                  }
                  .footer {
                    background-color: rgba(242, 242, 242, 1);
                    color: #888888;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                  }
                  .footer a {
                    color: rgba(29, 41, 86, 1);
                    text-decoration: none;
                  }
                  .divider {
                    border-bottom: 1px solid #dddddd;
                    margin: 30px 0;
                  }
                </style>
              </head>
              <body>
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="background-color: rgba(242, 242, 242, 1)"
                >
                  <tr>
                    <td align="center" style="padding: 20px">
                      <div class="container">
                        <div class="header">
                          <img
                            src="https://grey-dinosaur-100296.hostingersite.com/public/storage/properties/digistarclub-white.png"
                            alt="Company Logo"
                            class="logo"
                          />
                          <h1>Welcome ${name}!</h1>
                        </div>

                        <div class="content">
                          <p style="text-align: start;">
                            We are pleased to inform you that your Digistar Club account has been successfully verified. 
                            You can now access all the features and services available.
                          </p>

                          <!-- <h2 style="font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; margin: 35px 0 35px 0; line-height: 28px; font-weight: 700; letter-spacing: 0.5ch;">067890</h2> -->
                          <p>
                            For a seamless login experience, we recommend visiting: <a href="https://club-staging.digistartelkom.id/login" target="_blank">Login</a>
                          </p>

                          <div class="divider"></div>
                          <p style="text-align: start;">
                            If you have any questions, feel free to contact our support
                            team.
                          </p>
                          <p style="text-align: start; margin-top: 35px;">Thank you,<br /> <b>The Digistar Club Team</b></p>
                        </div>

                        <!-- Footer Section -->
                        <div class="footer">
                          <p>&copy; 2025 Digistar Club. All Rights Reserved.</p>
                          <p>
                            You are receiving this email because you registered on our site.
                            If you believe this is a mistake, please ignore this email.
                          </p>
                          <p>
                            <a href="https://club-staging.digistartelkom.id"
                              >Visit Our Site</a
                            >
                            |
                            <a href="https://club-staging.digistartelkom.id"
                              >Privacy Policy</a
                            >
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
        `
    }

    public static templateSuccessEmailVerification = (data: string): string => {
        return `
        <!DOCTYPE html>
            <html lang="en">
              <head></head>
              <body>
                <div style="text-align: center">
                    <h1 style="color: green">${data}</h1>
                    <p>Silahkan login kembali</p>
                </div>
              </body>
            </html>
        `
    }
}


export default TemplateHTML;