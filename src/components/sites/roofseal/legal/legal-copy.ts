type LegalSection = { title: string; paragraphs: string[] };
type LegalLanguage = { id: string; lang: "en"; title: string; intro: string; sections: LegalSection[] };
type LegalCopy = { title: string; languages: LegalLanguage[] };
export type LegalDocument = "terms" | "privacy";

/** Generated review copy, not client-approved legal or commercial policy. */
export const legalCopy: Record<LegalDocument, LegalCopy> = {
  terms: {
    title: "Terms & Conditions",
    languages: [
      {
        id: "english", lang: "en", title: "Website Terms & Conditions",
        intro: "These draft terms describe the proposed use of the Roofseal Resources (M) Sdn Bhd website and its product information, enquiry forms and quote list.",
        sections: [
          { title: "Website information", paragraphs: ["Product descriptions, images, catalogues and project examples provide general information. Confirm the latest specifications, availability and suitability for your project with Roofseal before ordering or relying on them for design or installation."] },
          { title: "Enquiries and quotations", paragraphs: ["Adding products to a quote list or submitting a form requests a response from Roofseal. A submission reference acknowledges receipt of an enquiry; it does not confirm an order or form a commercial contract.", "Prices, quantities, delivery arrangements, payment, returns and any product warranties must be set out in the applicable quotation or separately agreed commercial documents. This website draft does not establish those terms."] },
          { title: "Using the website", paragraphs: ["Provide accurate contact and project details and only share information you are authorised to provide. Please do not submit confidential third-party information, misuse the forms, interfere with the website or attempt unauthorised access."] },
          { title: "Content and product selection", paragraphs: ["Contact Roofseal before reproducing website materials for commercial use. Product selection and installation should be assessed against the requirements of the project, relevant technical documentation and advice from appropriately qualified professionals."] },
          { title: "External services and personal information", paragraphs: ["Links and embedded services may be operated by other providers and have their own terms. Our draft Privacy Policy describes the website’s enquiry data and service providers. Review it before sending personal information."] },
          { title: "Questions and updates", paragraphs: ["For questions about this website or a proposed purchase, contact Roofseal using the email below. Any future approved website terms should carry their own publication date; this draft has no approved effective date."] },
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    languages: [
      {
        id: "english", lang: "en", title: "Privacy Notice",
        intro: "This draft describes personal information handled through the Roofseal Resources (M) Sdn Bhd website. It covers website enquiries and quote requests; Roofseal must confirm its wider business practices before approving this notice.",
        sections: [
          { title: "Information you provide", paragraphs: ["Contact and quote forms collect your name, company, email address, telephone number and message. Depending on the form, they also collect enquiry type, state or location, project type, project location, estimated quantities or requirements, and selected products. Successful submissions store an enquiry reference and the wording and time of your consent.", "Fields marked with an asterisk and consent are required for online submission. Without them, the form cannot be submitted. Optional project details help explain your requirements. Please avoid sending sensitive personal information or other people’s details without authority."] },
          { title: "Why information is used", paragraphs: ["The proposed purposes are to respond to your enquiry, understand your project, prepare requested quotations and manage related follow-up. The website also checks submissions to prevent abuse and duplicate enquiries. Enquiry consent should not be treated as a separate subscription to promotional messages."] },
          { title: "Website storage and security checks", paragraphs: ["Selected quote products are saved in your browser’s local storage so the list remains available when you return. You can remove products or clear this data through your browser settings. Submitted enquiries are saved in the website’s enquiry system.", "The server uses a keyed hash derived from the visitor’s IP address for submission rate limiting when a trusted IP header is configured; otherwise it uses a shared limit. This rate-limit record is separate from the enquiry content."] },
          { title: "Service providers and embedded content", paragraphs: ["The hosting setup uses Cloudflare infrastructure. BugHerd is used for website feedback and may process feedback, screenshots and browser or page details when its feedback tool is used. The Contact Us page embeds Google Maps; loading the map connects your browser to Google. These providers may process technical information under their own privacy notices.", "Automated enquiry email delivery and Google Sheets synchronisation are currently disabled pending setup. This draft does not describe them as active recipients of enquiries. Roofseal must confirm provider access, processing locations and any transfers outside Malaysia before publication or enabling additional integrations."] },
          { title: "Retention and handling", paragraphs: ["Retention periods, deletion procedures and access arrangements for enquiries and technical records remain subject to Roofseal’s confirmation for this draft. No fixed retention period is approved here. Contact Roofseal if you have a question about a submitted enquiry or its handling."] },
          { title: "Your choices and requests", paragraphs: ["You may contact enquiry@roofseal.com.my to request access to or correction of your personal information, withdraw consent, or raise a privacy concern. Identify the enquiry and the request without sending unnecessary personal documents. Withdrawing consent may affect Roofseal’s ability to continue responding to the request. Roofseal should confirm any applicable identity checks and legal requirements when handling your request."] },
          { title: "Review and changes", paragraphs: ["This English notice is generated draft copy for client review. Roofseal must approve the information and confirm operational details before publication. An approved notice should be updated when the website’s data handling changes."] },
        ],
      },
    ],
  },
};
