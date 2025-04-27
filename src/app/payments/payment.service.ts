// @ts-nocheck

import csvParser from "csv-parser";
import { JwtPayload } from "jsonwebtoken";
import { Readable } from "stream";
import XLSX from "xlsx";
import globalController from "../../global/global.controller";
import { CustomJwtPayload } from "../../global/globalInterfaces";
import PaymentHistoryModel from "../paymentHistory/paymentHistory.model";
import PaymentModel from "./payment.model";

export function excelSerialToDate(serial: number): Date | undefined {
  console.log(serial);
  if (typeof serial !== "number" || isNaN(serial)) return undefined;

  const utcDays = serial - 25569;
  const utcSeconds = utcDays * 86400;
  const date = new Date(utcSeconds * 1000);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

// ! cvs is pending
const uploadCsvFile = async (file: Express.Multer.File, user: JwtPayload | CustomJwtPayload) => {
  const ext = file.originalname.split(".").pop()?.toLowerCase() || file.mimetype?.split("/")?.pop()?.toLowerCase();

  let results: any[] = [];

  if (ext === "csv") {
    results = await new Promise<any[]>((resolve, reject) => {
      const data: any[] = [];
      const stream = Readable.from(file.buffer);

      stream
        .pipe(csvParser())
        .on("data", (row) => data.push(row))
        .on("end", () => resolve(data))
        .on("error", (err) => reject(err));
    });
  } else if (ext === "xls" || ext === "xlsx") {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    results = [...jsonData];
  } else {
    throw new Error("File type is not supported");
  }

  const formatted: any[] = [];

  results.forEach((data) => {
    const trustAmount = Number(data[" Trust Amount (RM) "]) || 0;
    const interestDividendPayableToClient = data[" Interest/ Dividend payable to client (%) "] || 0;

    const income = (trustAmount * interestDividendPayableToClient) / 100;

    const fields = {
      product: data["Product "],
      donorName: data["Donor Name"],
      dateOfTrustDeed: excelSerialToDate(data["Date of Trust Deed"]),
      trustDeedExpiryDate: excelSerialToDate(data["Trust Deed Expiry Date"]),
      tenure: data["Tenure (Year)"],
      dividendFrequency: data["Dividend Frequency"],
      trustDeedNo: data["Trust Deed No."],
      reference: data["Reference"],
      trustAmount,
      interestDividendPayableToClient,
      income,
      payment: data["PAYMENT"],
      accountNumber: data["AccountNumber"],
      accountName: data["Account Name"],
      bank: data["Bank "],
      bankCode: data["Bank Code"],
      paymentMode: data["Payment Mode"],
      name: data["Name"],
      nricNo: data["NRICNO."],
      name1: data["Name_1"],
      nricPassportNo: data["NRIC/PassportNO."],
      mobileNo: data["Mobile No."],
      emailAddress: data["EmailAddress"],
    };
    // Only keep fields with valid values
    const removeNullValue = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );

    if (Object.entries(removeNullValue).length) {
      return formatted.push(removeNullValue);
    }
  });

  const insert = await PaymentModel.insertMany(formatted);
  const ids = insert.map((p) => p._id);
  const history = await PaymentHistoryModel.insertOne({ payments: ids, user: user._id, type: "manual" });

  return insert;
};

const paymentService = { uploadCsvFile };

export default paymentService;
