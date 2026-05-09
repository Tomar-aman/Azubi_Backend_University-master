public addApplication = async (req: Request, res: Response) => {
    console.log({ files: req.files });
    const attachments = req.files?.attachment;
    console.log({ attachments, v1: req.body.attachment });
    // const { attachment, ...body } = req.body;
    try {
      void this.jobService.addApplicationService(req.body, attachments);
      res.sendSuccess200Response("job applied successfully", null);
    } catch (error) {
      res.sendErrorResponse("error", error);
    }
  };

 public async addApplicationService(payload: Application, attachments: any) {
    const jobDetail = await jobModel.findById(payload.jobId);
    let files: any = [];
    if (attachments) {
      if (Array.isArray(attachments)) {
        files = attachments.map((file: any) => ({
          filename: file.name,
          content: file.data,
        }));

        /* base64 logic*/
        // attachments.forEach((base64Image, index) => {
        //   // Extract the extension from the base64 string (assuming it's a PNG image)
        //   const extension = base64Image.split(";")[0].split("/")[1];
        //   const filename = `image_${index + 1}.${extension}`;
        //   const buffer = Buffer.from(base64Image.split(",")[1], "base64");

        //   files.push({
        //     filename,
        //     content: buffer,
        //   });
        // });
        /* base64 logic*/
      } else {
        files.push({
          filename: attachments.name,
          content: attachments.data,
        });

        /* base64 logic*/
        // const extension = attachments.split(";")[0].split("/")[1];
        // const filename = `image_${1}.${extension}`;
        // const buffer = Buffer.from(attachments.split(",")[1], "base64");

        // files.push({
        //   filename,
        //   content: buffer,
        // });
        /* base64 logic*/
      }
    }
    const adminDetail = await userModel.findOne();
    const bcc: string[] = [];
    if (jobDetail) {
      bcc.push(jobDetail.email);
    }
    if (adminDetail) {
      bcc.push(adminDetail.email);
    }
    const htmlContent = await ejs.renderFile(
      path.join(path.resolve(path.dirname("")), "views", "application.ejs"),
      {
        jobTitle: jobDetail?.jobTitle,
        payload,
      },
    );
    await applicationModel.create(payload);
    emailService.sendEmail({
      bcc,
      subject: `Anwendung | ${payload.applicantName}`,
      html: htmlContent,
      attachments: files,
    });
  }