import mongoose, { Schema, Document } from "mongoose";

interface IReport extends Document {
  reportName: string;
  reportType: string;
  dataType: string;
  category: string;
  employee: string;
  informmationRequired: string;
  generationDate: Date;
  status: string;
  requestedInformation: {
    filters: Record<string, any>;
    dateRange: {
      start: Date;
      end: Date;
    };
    fields: string[];
  };
  generatedData: any[];
}

const reportSchema = new Schema<IReport>({
  reportName:{
    type: String,
    required: true
  },
  reportType: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  employee: {
    type: String,
    required: true,
  },
  informmationRequired: {
    type: String,
    required: true,
  },
  generationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Failed"],
    default: "Pending",
  },
  requestedInformation: {
    filters: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    dateRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    fields: {
      type: [String],
      required: true,
    },
  },
  generatedData: {
    default: [],
  },
});

// Define the model based on the schema
const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
