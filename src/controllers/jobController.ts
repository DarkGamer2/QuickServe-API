import { Request, Response } from "express";
import Job from "../models/Job"; // Adjust the path as necessary

class JobController {
    public async getJobs(req: Request, res: Response) {
        try {
            const jobs = await Job.find();
            res.json(jobs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getJob(req: Request, res: Response) {
        try {
            const job = await Job.findById(req.params.id);
            res.json(job);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async createJob(req: Request, res: Response) {
        try {
            const newJob = new Job({
                jobRequester: req.body.jobRequester,
                jobDescription: req.body.jobDescription,
                jobRequestDate: req.body.jobRequestDate,
                assignedBy: req.body.assignedBy,
                jobLocation: req.body.jobLocation,
                jobType: req.body.jobType,
                jobStatus: req.body.jobStatus,
                jobIcon: req.body.jobIcon,
                productInformation: {
                    productManufacturer: req.body.productInformation.productManufacturer,
                    productModelNumber: req.body.productInformation.productModelNumber,
                    productSerialNumber: req.body.productInformation.productSerialNumber,
                },
                successMessage: req.body.successMessage,
            });
            await newJob.save();
            res.status(201).json(newJob);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new JobController();