import employerRoute from "../module/employer.template/employer.routes";
import authRoute from "../module/auth.template/auth.routes";
import userRoute from "../module/user.template/user.route";
import cityRoute from "../module/city.template/city.routes";
import industriesRoute from "../module/industries.template/industries.routes";
import jobRoute from "../module/job.template/job.routes";
import manageContentRoute from "../module/manage.contant.template/manage.content.route";
import smtpRoute from "../module/smtp.template/smtp.routes";
import manageKeyRoute from "../module/manage.key.template/manageKey.route";
import jobTypesRoute from "../module/job.type.template/job.types.route";
import contactRoute from "../module/contact.template/contact.route";
import tipRouter from "../module/applicationTip.template/tip.route";
import jobAlertContentsRoute from "../module/job.alert.template/job.alert.route";
import jobBannerRoute from "../module/jobBanner.template/jobBanner.router";
import federalStatesRoute from "../module/federalStates.template/federalStates.routes";
import trainingRoute from "../module/training.template/federalStates.routes";
import regionRoute from "../module/regions.template/regions.routes";
import beginningRoute from "../module/begnning.template/federalStates.routes";
import frontendJobRoute from "../module_frontend/job.template/route";
import frontendCompanyRoute from "../module_frontend/company.template/route";
import formRoute from "../module_frontend/forms.template/route";
import tabRoute from "../module_frontend/tabs.template/route";
import ManageCityRoute from "../module_frontend/manageCityContent/route";
import GalleryImageRoute from "../module_frontend/gallery/route";
import FooterImageRoute from "../module_frontend/footerImage.template/route";
import LandingPageRoute from "../module_frontend/landingPage.template/route";
import dynamicFooter from "../module_frontend/footer/route";
import dynamicContent from "../module_frontend/contact/route";
import mapContent from "../module_frontend/map/route";
import NewsLetter from "../module_frontend/newsLetter/route";
import ContactForm from "../module_frontend/conatct.Template/route";
const router = [
  {
    prefix: "/federal-states",
    router: federalStatesRoute,
  },
  {
    prefix: "/trainings",
    router: trainingRoute,
  },
  {
    prefix: "/regions",
    router: regionRoute,
  },
  {
    prefix: "/beginnings",
    router: beginningRoute,
  },
  {
    prefix: "/auth",
    router: authRoute,
  },
  {
    prefix: "/employer",
    router: employerRoute,
  },
  {
    prefix: "/user",
    router: userRoute,
  },
  {
    prefix: "/cities",
    router: cityRoute,
  },
  {
    prefix: "/industries",
    router: industriesRoute,
  },
  {
    prefix: "/job",
    router: jobRoute,
  },
  {
    prefix: "/manage_content",
    router: manageContentRoute,
  },
  { prefix: "/smtp", router: smtpRoute },
  {
    prefix: "/manage_key",
    router: manageKeyRoute,
  },
  {
    prefix: "/job-type",
    router: jobTypesRoute,
  },
  {
    prefix: "/contacts",
    router: contactRoute,
  },
  {
    prefix: "/tips",
    router: tipRouter,
  },
  {
    prefix: "/alert",
    router: jobAlertContentsRoute,
  },
  {
    prefix: "/banner",
    router: jobBannerRoute,
  },
  // frontend routes
  {
    prefix: "/front-ends/jobs",
    router: frontendJobRoute,
  },
  {
    prefix: "/front-ends/companies",
    router: frontendCompanyRoute,
  },
  {
    prefix: "/front-ends/forms",
    router: formRoute,
  },
  {
    prefix: "/navbar",
    router: tabRoute,
  },
  {
    prefix: "/cites-content",
    router: ManageCityRoute,
  },
  {
    prefix: "/manage-home-gallery",
    router: GalleryImageRoute,
  },
  {
    prefix: "/footer-images",
    router: FooterImageRoute,
  },
  {
    prefix: "/dynamic-footer",
    router: dynamicFooter,
  },
  {
    prefix: "/dynamic-content",
    router: dynamicContent,
  },
  {
    prefix: "/dynamic-map",
    router: mapContent,
  },
  {
    prefix: "/dynamic-new-letter",
    router: NewsLetter,
  },
  {
    prefix: "/dynamic-form-frontend",
    router: ContactForm,
  },
  {
    prefix: "/landing-page-images",
    router: LandingPageRoute,
  },
];

export default router;
