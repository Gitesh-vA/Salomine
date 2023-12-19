export class EmailModel {
    public contactFormName: string;
    public contactFormEmail: string;
    public contactFormSubjects: string;
    public contactFormMessage: string;
    public contactFormCopy: boolean;

    constructor(public cFormName: string, public cFormEmail: string, public cFormSubjects: string, public cFormMessage: string, public cFormCopy: boolean) {

        this.contactFormName =  cFormName;
        this.contactFormEmail = cFormEmail;
        this.contactFormSubjects = cFormSubjects;
        this.contactFormMessage = cFormMessage;
        this.contactFormCopy = cFormCopy;
     }
}
