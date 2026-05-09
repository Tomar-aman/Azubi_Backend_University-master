// import fetch  from "node-fetch"
import { Request, Response } from "express";
import Footer from "../../models/footerContent";
import { filePathToObject } from "../../utils/constant";
class FooterController {
  // GET: Retrieve footer data
  public async getFooter(_: Request, res: Response): Promise<void> {
    try {
      const footer = await Footer.findOne(); // Retrieve the first footer document
      if (!footer) {
        res.status(404).json({ message: "Footer not found" });
      } else {
        res.status(200).json(footer);
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving footer", error });
    }
  }

  // POST: Create a new footer
  public async createFooter(req: Request, res: Response): Promise<void> {
    try {
      const {
        section1Title,
        section1Address,
        section1Phone,
        section1Email,
        section1WorkingHours,
        section2Title,
        section2Address,
        section2Phone,
        section2Email,
        section2WorkingHours,
        section3Title,
        section3Links,
        backgroundColor,
        textColor,
        linkColor,
        borderColor,
      } = req.body;

      const newFooter = new Footer({
        section1Title,
        section1Address,
        section1Phone,
        section1Email,
        section1WorkingHours,
        section2Title,
        section2Address,
        section2Phone,
        section2Email,
        section2WorkingHours,
        section3Title,
        section3Links,
        backgroundColor,
        textColor,
        linkColor,
        borderColor,
      });

      const footer = await newFooter.save();
      res.status(201).json(footer);
    } catch (error) {
      res.status(500).json({ message: "Error creating footer", error });
    }
  }

  // PUT: Update footer data
  public async updateFooter(req: Request, res: Response): Promise<void> {
    try {
      const updatedFooterData = req.body;
      delete updatedFooterData._id;
      const updatedFooter = await Footer.findOneAndUpdate(
        {},
        updatedFooterData,
        { new: true, upsert: true },
      );

      if (!updatedFooter) {
        res.status(404).json({ message: "Footer not found" });
      } else {
        res.status(200).json(updatedFooter);
      }
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: "Error updating footer", error });
    }
  }
  public async fetchImages(req, res) {
    const { imageUrl } = req.body; // Get the image URL from the request body
    try {
      const file = await filePathToObject(imageUrl);
      return res.send(file);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new FooterController();
