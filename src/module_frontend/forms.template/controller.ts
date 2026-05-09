import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import {
  contactFormService,
  dynamicEmailService,
  forCompaniesFormService,
  magazineFormService,
} from "./service";
import { formTypes } from "./formType";
import mailchimp from "@mailchimp/mailchimp_marketing";
import md5 from "md5";
import { smtpSettingModel } from "../../models";

export async function subscribeHandler(req: Request, res: Response) {
  const { email } = req.body;
  try {
    mailchimp.setConfig({
      apiKey: process.env.MAIL_CHIMP_APIKEY,
      server: "us8",
    });
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const subscriber_hash = md5(email);
    await mailchimp.lists.setListMember(
      process.env.AUDIENCE_ID as string,
      subscriber_hash,
      {
        email_address: email,
        status_if_new: "subscribed",
      },
    );
    res.sendSuccess200Response("success", null);
  } catch (error) {
    res.sendErrorResponse(error.message, {});
  }
}

export async function formHandler(req: Request, res: Response) {
  try {
    const { I_AM_NOT_ROBOT, formType, ...payload } = req.body;
    const bccContent = await smtpSettingModel.find();
    if (formType === formTypes.CONTACT_FORM)
      await contactFormService(payload, bccContent);
    if (formType === formTypes.MAGAZINE_ORDER)
      await magazineFormService(payload, bccContent);
    if (formType === formTypes.COMMON_FORM)
      await forCompaniesFormService(payload, bccContent);
    res.sendSuccess200Response("success", null);
  } catch (error) {
    logger.error("forms", error);
    res.sendErrorResponse(error.message, {});
  }
}

export async function dynamicEmail(req: Request, res: Response) {
  try {
    const { recipientEmail } = req.body;
    const bccContent = await smtpSettingModel.find();
    const htmlContent = `
      <p>Subject - E-Mail Registrierung AzubiRegional.de</p>
      <p>${recipientEmail}</p>
      <p>Newsletter Registrierung auf Azubiregional.de</p>
      <br/>
    `;

    await dynamicEmailService(
      recipientEmail,
      htmlContent,
      "E-Mail Registrierung AzubiRegional.de",
      bccContent,
    );
    res.sendCreated201Response("", {});
  } catch (error) {
    logger.error("forms", error);
    res.sendErrorResponse(error.message, {});
  }
}
