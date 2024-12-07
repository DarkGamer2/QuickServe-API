export interface UserInt{
    name:string,
    email:string,
    password:string,
    created_at:Date,
    updated_at:Date,
    skillSet:string[]
    role:string
}

export interface ReportInt{
    reportType:string,
    requestedInformation:{
        filters:{
            category:string
        },
        dateRange:{
            start:Date,
            end:Date
        },
        fields:string[]
    },
    status:string,
    generatedData:any
};