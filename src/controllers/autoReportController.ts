import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Report from "../models/Report";  // Ensure this path is correct

dotenv.config();

class AutoReportController {
  // Generate a new report
  public generateReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {  // Return type is Promise<void>
    try {
      const { reportType, category, email, startDate, endDate, fields, status,reportName,dataType,informationRequired,employee} = req.body;

      // Validate required fields
      if (!reportType || !category || !email || !startDate || !endDate || !fields) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Create and save the initial report
      const report = new Report({
        reportName,
        dataType,
        category,
        informationRequired,
        employee,
        reportType,
        requestedInformation: {
          filters: { category },
          dateRange: { start: new Date(startDate), end: new Date(endDate) },
          fields,
        },
        status: status || "Pending",
      });

      await report.save();

      // Fetch data and update report
      const generatedData = await this.fetchData(category, new Date(startDate), new Date(endDate), fields);
      report.generatedData = generatedData;
      report.status = "Completed";
      await report.save();

      // Send an email if the report is automatic
      if (reportType === "Automatic") {
        await this.sendEmail(email, report);
      }

      // Send response
      res.status(201).json({ message: "Report generated successfully", report });
    } catch (error) {
      console.error("Error generating report:", error);
      next(error);
    }
  };

  // Fetch data from the database based on filters and date range
  private fetchData = async (
    category: string,
    startDate: Date,
    endDate: Date,
    fields: string[]
  ): Promise<any[]> => {
    // Find reports that match the criteria
    const data = await Report.find({
      category,
      "requestedInformation.dateRange.start": { $gte: startDate },
      "requestedInformation.dateRange.end": { $lte: endDate },
    }).select(fields.join(" "));  // Only select the requested fields

    // Return selected data
    return data.map((item: any) => {
      const selectedFields: Record<string, any> = {};
      fields.forEach((field) => {
        selectedFields[field] = item[field];
      });
      return selectedFields;
    });
  };

  // Send an email with the generated report data
  private sendEmail = async (to: string, report: any): Promise<void> => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Automatic Report",
      text: `Here is your automatic report:\n\n${JSON.stringify(report.generatedData, null, 2)}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };

  // Get a list of all reports
  public getReports = async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {  // Return type is Promise<void>
    try {
      const reports = await Report.find().select("-__v");  // Exclude the version key
      res.status(200).json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      next(error);
    }
  };

  // Get a specific report by ID
  public getReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {  // Return type is Promise<void>
    try {
      const reportId = req.params.id;

      // Validate ObjectId
      if (!reportId) {
        res.status(400).json({ message: "Report ID is required" });
        return;
      }

      const report = await Report.findById(reportId);
      if (!report) {
        res.status(404).json({ message: "Report not found" });
        return;
      }

      res.status(200).json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      next(error);
    }
  };
}

export default new AutoReportController();
