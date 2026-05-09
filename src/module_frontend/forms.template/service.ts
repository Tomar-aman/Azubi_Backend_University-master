import path from "path";
import emailService from "../../utils/emailService";
import ejs from "ejs";
export const contactFormService = async (payload, bccContent) => {
  try {
    const htmlContent = await ejs.renderFile(
      path.join(path.resolve(path.dirname("")), "views", "contact-us.ejs"),
      { data: payload },
    );
    await emailService.sendEmail({
      bcc: [
        // payload.email as string,
        //  "Karriere@azubiregional.de"
        `${bccContent[0]?.to}`,
      ],
      to: [`${bccContent[0]?.to}`],
      subject: "contact-us",
      html: htmlContent,
    });
  } catch (error) {
    throw new Error("failed to send contact info");
  }
};

export const forCompaniesFormService = async (payload, bccContent) => {
  try {
    // const htmlContent = await ejs.renderFile(
    //   path.join(path.resolve(path.dirname("")), "views", "companies-form.ejs"),
    //   { data: payload },
    // );
    const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <h3>Subject: MEDIADATEN ANFORDERN</h3>
      
      <p><strong>Ihr Name:</strong> ${payload.name}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${payload.email}">${
        payload.email
      }</a></p>
      <p><strong>Ihre Telefon-Nr.:</strong> ${payload.phoneNumber}</p>
      <p><strong>Ihre Firma / Firmenname:</strong> ${payload.companyName}</p>
  
      <h4>Bitte wählen Sie aus:</h4>
  
      ${
        payload.careerFairCheck
          ? `
        <p>
          <strong>✔ Karriere Messe (Anmeldeformular):</strong> 
          <br> Für welche Standorte interessieren Sie sich? (freiwillige Eingabe)
          <br> ${payload.careerFairData}
        </p>`
          : ""
      }
  
      ${
        payload.dreamJobCheck
          ? `
        <p>
          <strong>✔ Traumjob Magazin (Print Ausgabe Mediadaten):</strong> 
          <br> Für welche Standorte interessieren Sie sich? (freiwillige Eingabe)
          <br> ${payload.dreamJobData}
        </p>`
          : ""
      }
  
      ${
        payload.onlineJobCheck
          ? `
        <p>
          <strong>✔ Online Stellenbörse (Stellenanzeige/n schalten):</strong> 
          <br> Angefragt
        </p>`
          : ""
      }  

      ${
        payload.fourthCheckBox
          ? ` 
        <p>
          <strong>✔ Produktion hörbare Stellenanzeigen (Mediadaten)</strong>
          <br> Angefragt
        </p>`
          : ""
      }

      <p><strong>Terms and Conditions Accepted:</strong> ${
        payload.termsAndCondition ? "Yes" : "No"
      }</p>
    </div>
  `;

    await emailService.sendEmail({
      bcc: [
        // payload.email as string,
        // "vivek@digimonk.in",
        // "Karriere@azubiregional.de",
        `${bccContent[0]?.to}`,
      ],
      subject: "request for media data",
      html: htmlContent,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error });
    throw new Error("failed to send companies info");
  }
};

export const magazineFormService = async (payload, bccContent) => {
  try {
    const htmlContent = await ejs.renderFile(
      path.join(path.resolve(path.dirname("")), "views", "magazine-order.ejs"),
      { data: payload },
    );
    await emailService.sendEmail({
      // bcc: ["Karriere@azubiregional.de"],
      bcc: [`${bccContent[0]?.to}`],
      subject: "magazine order",
      html: htmlContent,
    });
  } catch (error) {
    throw new Error("failed to send companies info");
  }
};

export const dynamicEmailService = async (
  _: string,
  htmlContent: string,
  subject: string,
  bccContent,
) => {
  try {
    await emailService.sendEmail({
      // bcc: ["Karriere@azubiregional.de"],
      bcc: [`${bccContent[0]?.to}`],
      html: htmlContent,
      subject: subject,
    });
  } catch (error) {
    throw new Error("Failed to send the email.");
  }
};
