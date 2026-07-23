// controllers/dataController.js
const sql = require("mssql");
const connection = require("../connection/connection");
const transporter = require("../mailer");
const { generateOTP } = require("../utils");
const dbConfig = require("../config/dbConfig");
const multer = require("multer");
const CryptoJS = require("crypto-js");
const upload = multer({ storage: multer.memoryStorage() }); //add in top of the datacontroller page
const path = require("path");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const fs = require("fs");
const otpStorage = {};

const uploadImages = async (req, res) => {
  try {
    let fileUrl;

    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    else if (req.body && req.body.base64 && req.body.filename) {
      const { base64, filename } = req.body;

      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const savePath = path.join(__dirname, "../uploads", filename);
      fs.writeFileSync(savePath, buffer);

      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    } else {
      return res.status(400).json({ error: "No file or base64 data provided" });
    }

    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Code added by Dinesh Gokul 22-06-2026
const getCompanyno = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql
      .query(`EXEC sp_company_info 'F','', ' ', '', '', '', '', '',  '', '' , '', '', '','',  '','','','','',null,NULL, '',NULL,NULL,'',
      NULL,NULL,NULL,NULL,NULL,null,null,null`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getsearchdata = async (req, res) => {
  const {
    company_no,
    company_name,
    city,
    state,
    pincode,
    country,
    status,
    company_gst_no,
  } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("status", sql.NVarChar, status)
      .query(`EXEC sp_company_info @mode,@company_no,@company_name,'','','','',@city,@state,@pincode,@country,@company_gst_no,@status,'','','','','','','','','','','','','','','','','','','',''`);
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addData = async (req, res) => {
  const {
    company_no,
    company_name,
    short_name,
    address1,
    address2,
    address3,
    city,
    state,
    pincode,
    country,
    email_id,
    status,
    foundedDate,
    websiteURL,
    contact_no,
    annualReportURL,
    location_no,
    company_gst_no,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;

  let company_logo = req.files["company_logo"]
    ? req.files["company_logo"][0].buffer
    : null;
  let authorisedSignatur = req.files["authorisedSignatur"]
    ? req.files["authorisedSignatur"][0].buffer
    : null;

  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("foundedDate", sql.NVarChar, foundedDate)
      .input("websiteURL", sql.NVarChar, websiteURL)
      .input("company_logo", sql.VarBinary, company_logo)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("annualReportURL", sql.NVarChar, annualReportURL)
      .input("location_no", sql.NVarChar, location_no)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
        @status, @foundedDate, @websiteURL, @company_logo, @contact_no, @annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,'',@created_by,@modified_by,  
        '', @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const saveEditedData = async (req, res) => {
  const editedData = req.body.editedData;
  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase();
    for (const updatedRow of editedData) {
      const company_logo =
        updatedRow.company_logo && updatedRow.company_logo.type === "Buffer"
          ? Buffer.from(updatedRow.company_logo.data)
          : null;

      const authorisedSignatur =
        updatedRow.authorisedSignatur &&
          updatedRow.authorisedSignatur.type === "Buffer"
          ? Buffer.from(updatedRow.authorisedSignatur.data)
          : null;

      console.log(company_logo);
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_no", updatedRow.company_no)
        .input("company_name", updatedRow.company_name)
        .input("short_name", updatedRow.short_name)
        .input("address1", updatedRow.address1)
        .input("address2", updatedRow.address2)
        .input("address3", updatedRow.address3)
        .input("city", updatedRow.city)
        .input("state", updatedRow.state)
        .input("pincode", updatedRow.pincode)
        .input("country", updatedRow.country)
        .input("email_id", updatedRow.email_id)
        .input("status", updatedRow.status)
        .input("foundedDate", updatedRow.foundedDate)
        .input("websiteURL", updatedRow.websiteURL)
        .input("company_logo", sql.VarBinary, company_logo)
        .input("contact_no", updatedRow.contact_no)
        .input("annualReportURL", updatedRow.annualReportURL)
        .input("location_no", updatedRow.location_no)
        .input("company_gst_no", updatedRow.company_gst_no)
        .input("Currency_Code", updatedRow.Currency_Code)
        .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id,
          @status, @foundedDate, @websiteURL,@company_logo,@contact_no,@annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,@Currency_Code ,@created_by,@modified_by,'',
           @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteData = async (req, res) => {
  const company_nosToDelete = req.body.company_nos;

  if (!company_nosToDelete || !company_nosToDelete.length) {
    res.status(400).json("Invalid or empty company_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const company_no of company_nosToDelete) {
      await pool
        .request()
        .input("company_no", company_no)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(`EXEC sp_company_info 'D', @company_no,'','','','','','','','',
          '','','','','','','','','','','','','',@modified_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    }

    res.status(200).json("Companies deleted successfully");
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CompanyUpdate = async (req, res) => {
  const {
    company_no,
    company_name,
    short_name,
    address1,
    address2,
    address3,
    city,
    state,
    pincode,
    country,
    email_id,
    status,
    foundedDate,
    websiteURL,
    contact_no,
    annualReportURL,
    location_no,
    company_gst_no,
    modified_by,
  } = req.body;

  let company_logo = req.files["company_logo"]
    ? req.files["company_logo"][0].buffer
    : null;
  let authorisedSignatur = req.files["authorisedSignatur"]
    ? req.files["authorisedSignatur"][0].buffer
    : null;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("foundedDate", sql.NVarChar, foundedDate)
      .input("websiteURL", sql.NVarChar, websiteURL)
      .input("company_logo", sql.VarBinary, company_logo)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("annualReportURL", sql.NVarChar, annualReportURL)
      .input("location_no", sql.NVarChar, location_no)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
        @status, @foundedDate, @websiteURL, @company_logo, @contact_no, @annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,'','' ,@modified_by,
         '', '', '', '', '','', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UpdateCompanyImage = async (req, res) => {
  const { company_no } = req.body;

  let company_logo = null;

  if (req.file) {
    company_logo = req.file.buffer;
  }

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_no", sql.NVarChar, company_no)
      .input("company_logo", sql.VarBinary, company_logo)
      .query(`EXEC sp_company_info 'CIU',@company_no,'','','','','','','','','','','','','',@company_logo,'','','','','','','','', 
        NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,null`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getCompanyData = async (req, res) => {
  const { company_no } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GC")
      .input("company_no", sql.NVarChar, company_no)
      .query(`EXEC sp_company_info @mode,@company_no,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllCompanyMappingData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql
      .query(`EXEC sp_user_company_mapping 'I','','','','','',0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addCompanyMappingData = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status, order_no, created_by, modified_by,
    tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4 } = req.body;
  let pool;

  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.VarChar, location_no)
      .input("status", sql.VarChar, status)
      .input("order_no", sql.Int, order_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_user_company_mapping @mode,@company_code,@user_code,@company_no,@location_no,@status,@order_no,'',@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getcompanymappingsearchdata = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.NVarChar, location_no)
      .input("status", sql.NVarChar, status)
      .query(`EXEC sp_user_company_mapping @mode,@company_code,@user_code,@company_no,@location_no,@status,0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getusercompany = async (req, res) => {
  const { user_code } = req.body;
  let pool;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UCL") // Insert mode
      .input("user_code", sql.NVarChar, user_code)
      .query(`EXEC sp_user_company_mapping @mode,'',@user_code,'','','',0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updcompanymapping = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", updatedRow.user_code)
        .input("company_no", updatedRow.company_no)
        .input("location_no", updatedRow.location_no)
        .input("status", updatedRow.status)
        .input("order_no", updatedRow.order_no)
        .input("keyfiels", updatedRow.keyfiels)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_user_company_mapping @mode, @company_code, @user_code, @company_no, @location_no, @status, @order_no,@keyfiels,@created_by,@modified_by,
           @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const commappingdeleteData = async (req, res) => {
  const keyfielsToDelete = req.body.keyfiels;

  try {
    const pool = await connection.connectToDatabase();

    for (const keyfiels of keyfielsToDelete) {
      await pool
        .request()
        .input("keyfiels", keyfiels)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(`EXEC sp_user_company_mapping 'D','','','','001','',0,@keyfiels,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    }
    res.status(200).json("User and company mapping data deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CompanyMappingUpdate = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status, order_no, keyfiels, modified_by } = req.body;
  let pool;
  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.VarChar, location_no)
      .input("status", sql.VarChar, status)
      .input("order_no", sql.Int, order_no)
      .input("keyfiels", sql.NVarChar, keyfiels)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_user_company_mapping @mode, @company_code, @user_code, @company_no, @location_no, @status, @order_no,@keyfiels,'',@modified_by,'', '', '', '', '', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCompanyMappingData = async (req, res) => {
  const { company_code, keyfiels } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GCM")
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfiels", sql.NVarChar, keyfiels)
      .query(`EXEC sp_user_company_mapping @mode,@company_code,'','','','',0,@keyfiels,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getLocationno = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC sp_location_info 'F','', '', '', '', '', '', '','', '', '', '', '',  0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getlocationsearchdata = async (req, res) => {
  const {
    company_code,
    location_no,
    location_name,
    city,
    state,
    pincode,
    country,
    status,
  } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("status", sql.NVarChar, status)
      .query(` EXEC sp_location_info @mode,@location_no,@location_name, '', '', '', '', @city,@state, @pincode, @country, '', 
        @status, '', '','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addlocationinfo = async (req, res) => {
  const {
    location_no,
    location_name,
    short_name,
    address1,
    address2,
    address3,
    city,
    state,
    pincode,
    country,
    email_id,
    status,
    contact_no,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;

  let pool;
  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
      @status,  @contact_no, @created_by,@modified_by,'',@tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const locationsaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("location_no", updatedRow.location_no)
        .input("location_name", updatedRow.location_name)
        .input("short_name", updatedRow.short_name)
        .input("address1", updatedRow.address1)
        .input("address2", updatedRow.address2)
        .input("address3", updatedRow.address3)
        .input("city", updatedRow.city)
        .input("state", updatedRow.state)
        .input("pincode", updatedRow.pincode)
        .input("country", updatedRow.country)
        .input("email_id", updatedRow.email_id)
        .input("status", updatedRow.status)
        .input("contact_no", updatedRow.contact_no)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, 
          @address3, @city, @state, @pincode, @country, @email_id,  @status, @contact_no, @created_by, @modified_by , '',
         @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const locationdeleteData = async (req, res) => {
  const location_nosToDelete = req.body.location_nos;

  if (!location_nosToDelete || !location_nosToDelete.length) {
    res.status(400).json("Invalid or empty location no's array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const location_no of location_nosToDelete) {
        await pool
          .request()
          .input("location_no", location_no)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(
            `EXEC sp_location_info 'D',@location_no, '', '', '', '', '', '', '', '', '', '','',  '', '',@modified_by, '', NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL`,
          );
    }

    res.status(200).json("Companies deleted successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const LocationUpdate = async (req, res) => {
  const {
    location_no,
    location_name,
    short_name,
    address1,
    address2,
    address3,
    city,
    state,
    pincode,
    country,
    email_id,
    status,
    contact_no,
    created_by,
    modified_by,
  } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, 
          @address3, @city, @state, @pincode, @country, @email_id,  @status, @contact_no, @created_by, @modified_by , '',
         '', '', '', '','', '', '',''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLocationData = async (req, res) => {
  const { location_no } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GL")
      .input("location_no", sql.NVarChar, location_no)
      .query(` EXEC sp_location_info @mode,@location_no,'','','','','','','','','','', 
      '', '', '','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getroleid = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_role_info 'F',@company_code,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllRoleInfoData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_role_Info 'A','','','','','','','','','','','','','',''`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const AddRoleInfoData = async (req, res) => {
  const {
    company_code,
    role_id,
    role_name,
    description,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .input("description", sql.NVarChar, description)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_role_info @mode,@company_code, @role_id,
        @role_name,@description,
        @created_by,@modified_by,
        @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "Role already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const RolesaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("role_id", sql.NVarChar, updatedRow.role_id)
        .input("role_name", sql.NVarChar, updatedRow.role_name)
        .input("description", sql.NVarChar, updatedRow.description)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(
          `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,@description,@created_by,@modified_by,@tempstr1,@tempstr2,
          @tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4
          `,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getRolesearchdata = async (req, res) => {
  const { company_code, role_id, role_name } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .query(
        `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const roledeleteData = async (req, res) => {
  const role_idsToDelete = req.body.role_ids;

  if (!role_idsToDelete || !role_idsToDelete.length) {
    res.status(400).json("Invalid or empty RoleID array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const role_id of role_idsToDelete) {
      try {
        await pool
          .request()
          .input("role_id", role_id)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(`
          EXEC sp_Role_Info 'D',@company_code,@role_id,'','','',@modified_by,
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL
          `);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The role cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User deleted successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getUserRole = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_role_info 'UR',@company_code,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const RoleUpdate = async (req, res) => {
  const {
    company_code,
    role_id,
    role_name,
    description,
    created_by,
    modified_by,
  } = req.body;
  let pool;
  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .input("description", sql.NVarChar, description)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,@description,@created_by,@modified_by,'','',
          '','','','','',''`,
      );

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getRoleData = async (req, res) => {
  const { company_code, role_id } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GR")
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .query(`EXEC sp_Role_Info @mode,@company_code,@role_id,'','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getAllUserRoleMappingData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_user_rolemapping 'A','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addUserRoleMappingData = async (req, res) => {
  const {
    company_code,
    user_code,
    role_id,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_user_rolemapping @mode,@company_code, @user_code,'',@role_id,'','',@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ message: err.message || "Internal Server Error" });

  }
};

const getUserrolesearchdata = async (req, res) => {
  const { company_code, user_code, user_name, role_id, role_name } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .query(`EXEC sp_user_rolemapping @mode,@company_code,@user_code,@user_name,@role_id,@role_name,'','','',
      null,null,null,null,null,null,null,null `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const RollMappingDelete = async (req, res) => {
  const keyfieldToDelete = req.body.keyfield;

  try {
    const pool = await connection.connectToDatabase();
    for (const keyfield of keyfieldToDelete) {
      try {
        await pool
          .request()
          .input("keyfield", keyfield)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(` EXEC sp_user_rolemapping 'D','','','','','',@keyfield,'', @modified_by,null,null,null,null,null,null,null,null
            `);
      } catch (error) {
        if (error.number === 547) {
          // Foreign key constraint violation
          res.status(400).json("First Delete the RoleMapping header");
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }
    res.status(200).json("RoleMapping Deleted Successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateRoleMapping = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", updatedRow.user_code)
        .input("role_id", updatedRow.role_id)
        .input("keyfield", updatedRow.keyfield)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(
          `EXEC sp_user_rolemapping @mode,@company_code,@user_code,'',@role_id,'',@keyfield,@created_by,@modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const RoleMappingUpdate = async (req, res) => {
  const { company_code, user_code, role_id, keyfield, modified_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("role_id", sql.VarChar, role_id)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.VarChar, modified_by)
      .query(
        `EXEC sp_user_rolemapping @mode,@company_code,@user_code,'',@role_id,'',@keyfield,'',@modified_by,'','','','','','','',''`,
      );

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getRoleMappingData = async (req, res) => {
  const { company_code, keyfield } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GRM")
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .query(`EXEC sp_user_rolemapping @mode,@company_code,'','','','',@keyfield,'','',null,null,null,null,null,null,null,null`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getAlluserscreenmap = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_rolescreen_mapping 'A','','','','','','','',
                                      null,null,null,null,null,null,null,null `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const adduserscreenmap = async (req, res) => {
  const {
    company_code,
    role_id,
    screen_type,
    permission_type,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.VarChar, permission_type)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_rolescreen_mapping @mode, @company_code,@role_id, @screen_type,@permission_type,'',@created_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const saveEditeduserscreenmap = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", updatedRow.company_code)
        .input("role_id", updatedRow.role_id)
        .input("screen_type", updatedRow.screen_type)
        .input("permission_type", updatedRow.permission_type)
        .input("keyfield", updatedRow.keyfield)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_rolescreen_mapping @mode,@company_code, @role_id, @screen_type, @permission_type, @keyfield,'', @modified_by,  
               @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
              @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const userscreenmapdeleteData = async (req, res) => {
  const keyfieldsToDelete = req.body.keyfield;

  // if (!keyfieldsToDelete || !keyfieldsToDelete.length) {
  //   res.status(400).json("Invalid or empty company_nos array.");
  //   return;
  // }

  try {
    const pool = await connection.connectToDatabase();

    for (const keyfield of keyfieldsToDelete) {
      try {
        await pool
          .request()
          .input("keyfield", keyfield)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(
            `EXEC sp_rolescreen_mapping 'D','','','','',@keyfield,'',@modified_by,null,null,null,null,null,null,null,null`,
          );
      } catch (error) {
        if (error.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The user rights cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User screen mapping deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getuserscreensearchdata = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.VarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.NVarChar, permission_type)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code,@role_id,@screen_type,@permission_type,'','','',
null,null,null,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUserPermission = async (req, res) => {
  const { role_id } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("role_id", sql.NVarChar, role_id)
      .query(`EXEC sp_rolescreen_mapping @mode,'',@role_id,'','','','','',null,null,null,null,null,null,null,null
  `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateRoleRights = async (req, res) => {
  const {
    company_code,
    role_id,
    screen_type,
    permission_type,
    keyfield,
    modified_by,
  } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.VarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.VarChar, permission_type)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code, @role_id, @screen_type, @permission_type, @keyfield,'', @modified_by,  
               NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getRoleRightsData = async (req, res) => {
  const { company_code, keyfield } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GRSM")
      .input("company_code", sql.VarChar, company_code)
      .input("keyfield", sql.VarChar, keyfield)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code,'','','',@keyfield,'','',null,null,null,null,null,null,null,null`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code added by Dinesh Gokul 22-06-2026


// Code added by Ramya 22-06-2026
const AttributeUpdate = async (req, res) => {
  const {
    company_code,
    attributeheader_code,
    attributedetails_code,
    attributedetails_name,
    descriptions,
    created_by,
    modified_by,
  } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_attribute_Info @mode,@company_code, @attributeheader_code, @attributedetails_code, @attributedetails_name, @descriptions, @created_by,@modified_by, '', '', '', '', '', '', '', ''`,
      );
    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const gethdrcode = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'TS',@company_code,'', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUsercode = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql
      .query(`EXEC sp_user_info_hdr 'F','','user_code','','', '' ,'','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getAllattributedetData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_attribute_info 'A','','', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const addattridetData = async (req, res) => {
  const {
    company_code,
    attributeheader_code,
    attributedetails_code,
    attributedetails_name,
    descriptions,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;

  try {
    // Input validation
    if (!attributeheader_code) {
      return res
        .status(400)
        .json({ error: "Attribute Header Code cannot be blank" });
    }

    // Establish connection to the database
    const pool = await sql.connect(dbConfig);

    // Execute the stored procedure
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_attribute_Info @mode,@company_code,@attributeheader_code, @attributedetails_code,@attributedetails_name,@descriptions,@created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`,
      );
    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};
const deleteAttriDetailData = async (req, res) => {
  const { attributeheader_codesToDelete, attributedetails_codeToDelete } =
    req.body;

  if (
    !attributeheader_codesToDelete ||
    !attributeheader_codesToDelete.length ||
    !attributedetails_codeToDelete ||
    !attributedetails_codeToDelete.length
  ) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_attribute_Info 'D',@company_code,@attributeheader_code, @attributedetails_code,'','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
    `;
    for (let i = 0; i < attributeheader_codesToDelete.length; i++) {
      try {
        await pool
          .request()
          .input("attributeheader_code", attributeheader_codesToDelete[i])
          .input("attributedetails_code", attributedetails_codeToDelete[i])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(deleteQuery);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The attribute cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Attribute data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const updattridetData = async (req, res) => {
  const {
    attributeheader_codesToUpdate,
    attributedetails_codesToUpdate,
    updatedData,
  } = req.body;

  if (
    !attributeheader_codesToUpdate ||
    !attributeheader_codesToUpdate.length ||
    !attributedetails_codesToUpdate ||
    !attributedetails_codesToUpdate.length ||
    !updatedData ||
    !updatedData.length
  ) {
    res.status(400).json("Invalid or empty input data.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (let i = 0; i < attributeheader_codesToUpdate.length; i++) {
      const updatedRow = updatedData[i]; // Assuming updatedData is an array of objects with updated values

      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("attributeheader_code", attributeheader_codesToUpdate[i])
        .input("attributedetails_code", attributedetails_codesToUpdate[i])
        .input(
          "attributedetails_name",
          sql.NVarChar,
          updatedRow.attributedetails_name,
        )
        .input("descriptions", sql.NVarChar, updatedRow.descriptions)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(
          `EXEC sp_attribute_Info @mode,@company_code, @attributeheader_code, @attributedetails_code, @attributedetails_name, @descriptions, @created_by,@modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
        );
    }

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getattributeSearchdata = async (req, res) => {
  const {
    company_code,
    attributeheader_code,
    attributedetails_code,
    attributedetails_name,
    descriptions,
  } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .query(`EXEC sp_attribute_Info 'SC',@company_code,@attributeheader_code,@attributedetails_code,@attributedetails_name,@descriptions,'','','','','','','','','',''
                `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getGSTReport = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'GF',@company_code,'GSTReport','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getDateFormat = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'FD',@company_code,'DateFormat','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getAttributeData = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GAI")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .query(`EXEC sp_attribute_Info @mode,@company_code,@attributeheader_code,@attributedetails_code,'','','','','','','','','','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const forgetPassword = async (req, res) => {
  const { user_code, email_id } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "VE")
      .input("user_code", sql.NVarChar, user_code)
      .input("email_id", sql.NVarChar, email_id)
      .query(`EXEC sp_user_info_hdr @mode,'',@user_code,'','','','','','','',@email_id,'','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    if (result.recordset.length > 0) {
      const otp = generateOTP();
      await sendOTP(email_id, otp);

      otpStorage[email_id] = otp;

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
const Passwords = async (req, res) => {
  const { user_code, email_id, user_password } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("user_code", sql.NVarChar, user_code)
      .input("email_id", sql.NVarChar, email_id)
      .input("user_password", sql.NVarChar, user_password)
      .query("EXEC sp_user_info_hdr @mode,'',@user_code,'','','',@user_password,'','','',@email_id,'','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email_id, user_password, loginType } = req.body;
  const secretKey = "yjk26012024";

  try {
    const decryptedEmail = CryptoJS.AES.decrypt(
      email_id,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const decryptedPassword = CryptoJS.AES.decrypt(
      user_password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const decryptedLoginType = CryptoJS.AES.decrypt(
      loginType,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "LUC")
      .input("email_id", sql.NVarChar, decryptedEmail)
      .input("user_password", sql.NVarChar, decryptedPassword)
      .input("loginType", sql.NVarChar, decryptedLoginType)
      .query(` EXEC sp_user_info_hdr 'LUC', '', '', '', '', '', @user_password, '', '', '', @email_id,
         '', '', '', '', '', @loginType, '', '', '', '', '', '', '', '', '', '' `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ message: "Data not found" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
  };

const getAlluserData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql
      .query(`EXEC sp_user_info_hdr 'A','','','','',' ','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const userAddData = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_password, user_status, log_in_out, user_type,
    email_id, dob, gender, role_id, super_admin, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4 } = req.body;

  let user_img = null;

  if (req.file) {
    user_img = req.file.buffer; // Buffer containing the uploaded image
  }

  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_password", sql.NVarChar, user_password)
      .input("user_status", sql.NVarChar, user_status)
      .input("log_in_out", sql.NVarChar, log_in_out)
      .input("user_type", sql.NVarChar, user_type)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_img", sql.VarBinary, user_img)
      .input("super_admin", sql.NVarChar, super_admin)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_user_info_hdr @mode,@company_code,@user_code,@user_name,@first_name,@last_name,@user_password,@user_status,@log_in_out,@user_type,
        @email_id,@dob,@gender,@role_id,@user_img,@super_admin,'',@created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4`);
    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const UsersaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", sql.NVarChar, updatedRow.user_code)
        .input("user_name", sql.NVarChar, updatedRow.user_name)
        .input("first_name", sql.NVarChar, updatedRow.first_name)
        .input("last_name", sql.NVarChar, updatedRow.last_name)
        .input("user_password", sql.NVarChar, updatedRow.user_password)
        .input("user_status", sql.NVarChar, updatedRow.user_status)
        .input("log_in_out", sql.NVarChar, updatedRow.log_in_out)
        .input("user_type", sql.NVarChar, updatedRow.user_type)
        .input("email_id", sql.NVarChar, updatedRow.email_id)
        .input("dob", sql.NVarChar, updatedRow.dob)
        .input("gender", sql.NVarChar, updatedRow.gender)
        .input("role_id", sql.NVarChar, updatedRow.role_id)
        .input("super_admin", sql.NVarChar, updatedRow.super_admin)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_user_info_hdr @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,'',@super_admin,'',@created_by, @modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const UserdeleteData = async (req, res) => {
  const user_codesToDelete = req.body.user_codes;

  if (!user_codesToDelete || !user_codesToDelete.length) {
    res.status(400).json("Invalid or empty user_codes array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const user_code of user_codesToDelete) {
      await pool
        .request()
        .input("user_code", user_code)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(`EXEC sp_user_info_hdr 'D',@company_code,@user_code,'','','','', '', '', '','','', '','','','','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    }

    res.status(200).json("user deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUsersearchdata = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_status,
    email_id, dob, gender, role_id, created_by } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_status", sql.NVarChar, user_status)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_user_info_hdr @mode,@company_code,@user_code,@user_name,@first_name,@last_name,'',@user_status,'','',@email_id,@dob,@gender,@role_id,
        '','','',@created_by,'','','','','','','','',''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
const UpdateUserImage = async (req, res) => {
  const { user_code } = req.body;

  let user_img = null;

  if (req.file) {
    user_img = req.file.buffer; // Buffer containing the uploaded image
  }
  try {
    // Check if the user exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("user_code", sql.NVarChar, user_code)
      .input("user_img", sql.VarBinary, user_img)
      .query(`EXEC sp_user_info_hdr 'UI','',@user_code,'','','','','','','','','','','',@user_img,'','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const UserUpdate = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_password,
    user_status, log_in_out, user_type, email_id, dob, gender, role_id, super_admin,
    created_by, modified_by } = req.body;

  let user_images = null;

  if (req.file) {
    user_images = req.file.buffer;
  }

  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_password", sql.NVarChar, user_password)
      .input("user_status", sql.NVarChar, user_status)
      .input("log_in_out", sql.NVarChar, log_in_out)
      .input("user_type", sql.NVarChar, user_type)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_images", sql.VarBinary, user_images)
      .input("super_admin", sql.NVarChar, super_admin)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_user_info_hdr @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,@user_images, @super_admin, '', @created_by, @modified_by, '', '', '', '', '', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const Userdropdown = async (req, res) => {
  const { user_code } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MG")
      .input("user_code", sql.NVarChar, user_code)
      .query(`EXEC [sp_user_info_hdr] @mode,'',@user_code,'','','','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUCN = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_user_info_hdr 'UCN', @company_code, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL`);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUserData = async (req, res) => {
  const { company_code, user_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GUIH")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .query(`EXEC sp_user_info_hdr @mode,@company_code,@user_code,'','','','','','','','','','','','','','','','','','','','','','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
// Code added by Ramya 22-06-2026

// Code added by Dinesh Gokul 22-06-2026
const getCity = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'city','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getState = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'state','',' ', ' ' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCountry = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'country','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'status','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getScreens = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Screens','',' ', ' ','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPermissions = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Permissions','',' ', ' ' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLoginorout = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Log IN/OUT','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDisType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Discount Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code ended by Dinesh Gokul 22-06-2026

// Code added by Dinesh Gokul 23-06-2026
const addattrihdrData = async (req, res) => {
  const {
    company_code,
    attributeheader_code,
    attributeheader_name,
    status,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributeheader_name", sql.NVarChar, attributeheader_name)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_attribute_hdr @mode,@company_code,@attributeheader_code,@attributeheader_name,@status,@created_by,@modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};
// Code ended by Dinesh Gokul 23-06-2026

//code by Ramya 26/06/2026
const getAllNumberseries = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(`EXEC sp_numberseries_test 'A','','','','',0,0,0,'','','','','','',null,null,null,null,null,null,null,null,''`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const addNumberseries = async (req, res) => {
  const {
    company_code,
    Screen_Type,
    Start_Year,
    End_Year,
    Start_No,
    Running_No,
    End_No,
    text,
    number_prefix,
    Status,
    bill_format,
    created_by,
    modified_by,
    tempstr1,
    tempstr2,
    tempstr3,
    tempstr4,
    datetime1,
    datetime2,
    datetime3,
    datetime4,
  } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("Screen_Type", sql.NVarChar, Screen_Type)
      .input("Start_Year", sql.Date, Start_Year)
      .input("End_Year", sql.Date, End_Year)
      .input("Start_No", sql.Int, Start_No)
      .input("Running_No", sql.Int, Running_No)
      .input("End_No", sql.Int, End_No)
      .input("text", sql.NVarChar, text)
      .input("number_prefix", sql.NVarChar, number_prefix)
      .input("Status", sql.NVarChar, Status)
      .input("bill_format", sql.NVarChar, bill_format)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_numberseries_test @mode,@company_code,@Screen_Type,@Start_Year,@End_Year,@Start_No,@Running_No,@End_No,@text,@number_prefix,@Status,@bill_format,
      @created_by,@modified_by, @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4,''`);

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};



const saveEditedNumberseriesData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", updatedRow.company_code)
        .input("Screen_Type", updatedRow.Screen_Type)
        .input("Start_Year", updatedRow.Start_Year)
        .input("End_Year", updatedRow.End_Year)
        .input("Start_No", updatedRow.Start_No)
        .input("Running_No", updatedRow.Running_No)
        .input("End_No", updatedRow.End_No)
        .input("comtext", updatedRow.comtext)
        .input("number_prefix", updatedRow.number_prefix)
        .input("Status", updatedRow.Status)
        .input("bill_format", updatedRow.bill_format)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers['modified-by'])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_numberseries_test @mode, @company_code,@Screen_Type, @Start_Year, @End_Year, @Start_No, @Running_No, @End_No,@text,@number_prefix,@Status,@bill_format,
        @created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4,''`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
const numberseriesdeleteData = async (req, res) => {
  const Screen_TypesToDelete = req.body.Screen_TypesToDelete;

  if (!Screen_TypesToDelete || !Screen_TypesToDelete.length) {
    res.status(400).json("Invalid or empty company_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of Screen_TypesToDelete) {
      try {
        const result = await pool.request()
          .input("Screen_Type", updatedRow.Screen_Type)
          .input("Start_Year", updatedRow.Start_Year)
          .input("End_Year", updatedRow.End_Year)
          .input("modified_by", sql.NVarChar, req.headers['modified-by'])
          .input("company_code", sql.NVarChar, req.headers['company_code'])
          .query(`EXEC sp_numberseries_test 'D',@company_code,@Screen_Type,@Start_Year,@End_Year,0,0,0,'','','','','',@modified_by, null,null,null,null,null,null,null,null,''`);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res.status(400).json("The number series cannot be deleted due to a link with another record");
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Number series deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const NumberSeriesUpdate = async (req, res) => {
  const { company_code, Screen_Type, Start_Year, End_Year, Start_No, Running_No, End_No, text, number_prefix, Status, created_by, modified_by, bill_format } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("Screen_Type", sql.NVarChar, Screen_Type)
      .input("Start_Year", sql.NVarChar, Start_Year)
      .input("End_Year", sql.NVarChar, End_Year)
      .input("Start_No", sql.Int, Start_No)
      .input("Running_No", sql.Int, Running_No)
      .input("End_No", sql.Int, End_No)
      .input("text", sql.NVarChar, text)
      .input("number_prefix", sql.NVarChar, number_prefix)
      .input("Status", sql.NVarChar, Status)
      .input("bill_format", sql.NVarChar, bill_format)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_numberseries_test @mode, @company_code,@Screen_Type, @Start_Year, @End_Year, @Start_No, @Running_No,@End_No,@text,@number_prefix,
      @Status,@bill_format,@created_by,@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,''`);

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
const getNumberseries = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_numberseries_test 'F','','','','',0,0,0,'','','','','','',null,null,null,null,null,null,null,null,''`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getscreentype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Sc type', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};



//Code Added by Ramya on 27-06-2026
const getBillFormat = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Bill Format','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL"
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const getboolean = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'boolean','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getnumberseriessearchdata = async (req, res) => {
  const { company_code, Screen_Type } = req.body; // Extract Screen_Type from req.body

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("Screen_Type", sql.NVarChar, Screen_Type) // Correct parameter name
      .query(`EXEC sp_numberseries_test @mode,@company_code,@Screen_Type,'','',0,0,0,'','','','','','',
                         null,null,null,null,null,null,null,null,''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Ended by Ramya on 27-06-2026

// Code added by Dinesh Gokul 29-06-2026
const GYM_TrainerInsert = async (req, res) => {
  const {
    TrainerID, FullName, Email, Password, Gender, Mobile, Certifications, Specializations, Experience, WorkingSchedule, DOB, Biography, Is_Active, Location_Code, KeyField,
    created_date,
    modified_date,
    created_by,
    modified_by,
    company_code
  } = req.body;
  let Photo = null;
  if (req.file) Photo = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "I")
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.NVarChar, Email)
      .input("Password", sql.NVarChar, Password)
      .input("Gender", sql.NVarChar, Gender)
      .input("Mobile", sql.NVarChar, Mobile)
      .input("Photo", sql.VarBinary, Photo)
      .input("Certifications", sql.NVarChar, Certifications)
      .input("Specializations", sql.NVarChar, Specializations)
      .input("Experience", sql.Int, Experience)
      .input("WorkingSchedule", sql.NVarChar, WorkingSchedule)
      .input("DOB", sql.DateTime, DOB)
      .input("Biography", sql.NVarChar, Biography)
      .input("Is_Active", sql.NVarChar, Is_Active)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.DateTime, created_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.DateTime, modified_date)
      .query(`EXEC sp_GYM_Trainer @mode, @TrainerID, @FullName, @Email, @Password, @Gender, @Mobile, @Photo, @Certifications, @Specializations, @Experience, @WorkingSchedule, @DOB, @Biography, @Is_Active, @Location_Code, @KeyField, @company_code, 0, 0, '', '',@created_by, @created_date, @modified_by, @modified_date`);

    res.status(200).json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error("Error during GYM_Trainer insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GYM_TrainerUpdate = async (req, res) => {
  const {
    TrainerID, FullName, Email, Password, Gender, Mobile, Certifications, Specializations, Experience, WorkingSchedule, DOB, Biography, Is_Active, Location_Code, KeyField,
    created_date,
    modified_date,
    created_by,
    modified_by,
    company_code
  } = req.body;
  let Photo = null;
  if (req.file) Photo = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "U")
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.NVarChar, Email)
      .input("Password", sql.NVarChar, Password)
      .input("Gender", sql.NVarChar, Gender)
      .input("Mobile", sql.NVarChar, Mobile)
      .input("Photo", sql.VarBinary, Photo)
      .input("Certifications", sql.NVarChar, Certifications)
      .input("Specializations", sql.NVarChar, Specializations)
      .input("Experience", sql.Int, Experience)
      .input("WorkingSchedule", sql.NVarChar, WorkingSchedule)
      .input("DOB", sql.DateTime, DOB)
      .input("Biography", sql.NVarChar, Biography)
      .input("Is_Active", sql.NVarChar, Is_Active)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.DateTime, created_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.DateTime, modified_date)
      .query(`EXEC sp_GYM_Trainer @mode, @TrainerID, @FullName, @Email, @Password, @Gender, @Mobile, @Photo, @Certifications, @Specializations, @Experience, @WorkingSchedule, @DOB, @Biography, @Is_Active, @Location_Code, @KeyField, @company_code,   0, 0, 0, 0,@created_by, @created_date, @modified_by, @modified_date`);

    res.status(200).json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during GYM_Trainer update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GYM_TrainerDelete = async (req, res) => {
  const {
    TrainerID, Location_Code, KeyField, modified_by, company_code } = req.body;
  let Photo = null;
  if (req.file) Photo = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "D")
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_GYM_Trainer @mode, @TrainerID, '', '', '', '', '', Null, '', '', '', '', '', '', '', @Location_Code, @KeyField, @company_code,  0, 0, '', '', '' ,'', '', ''`);

    res.status(200).json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during GYM_Trainer delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code ended by Dinesh Gokul 29-06-2026

// Code added by Dinesh Gokul 30-06-2026
const getTrainerSC = async (req, res) => {
  const { company_code, Location_Code, TrainerID, FullName, Email, Gender, Mobile,
    Specializations, Experience, WorkingSchedule, DOB, Is_Active, age_from, age_to, experience_from, experience_to } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("FullName", sql.NVarChar, FullName)
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("Email", sql.NVarChar, Email)
      .input("Gender", sql.NVarChar, Gender)
      .input("Mobile", sql.NVarChar, Mobile)
      .input("Specializations", sql.NVarChar, Specializations)
      .input("Experience", sql.NVarChar, Experience)
      .input("WorkingSchedule", sql.NVarChar, WorkingSchedule)
      .input("DOB", sql.NVarChar, DOB)
      .input("Is_Active", sql.NVarChar, Is_Active)
      .input("age_from", sql.Int, age_from)
      .input("age_to", sql.Int, age_to)
      .input("experience_from", sql.Int, experience_from)
      .input("experience_to", sql.Int, experience_to)
      .query(`EXEC sp_GYM_Trainer @mode, @TrainerID, @FullName, @Email, '', @Gender, @Mobile, Null, 
        '', @Specializations, @Experience, @WorkingSchedule, @DOB, '', @Is_Active, 
        @Location_Code, '', @company_code,  @age_from, @age_to, @experience_from, @experience_to, '', '', '', ''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
// Code ended by Dinesh Gokul 30-06-2026


//Code added by ramya on 30-06-2026
const memberAddData = async (req, res) => {
  const {
    Identity_No,
    Full_name,
    DOB,
    Gender,
    Mobile,
    WhatsApp_Number,
    Email,
    Password,
    Address,
    Emergency_contact_name,
    Emergency_contact_phone,
    Emergency_contact_relation,
    Receive_promotions,
    Receive_notifications,
    Joined_date,
    Plan_expiry_date,
    Membership_type,
    is_active,
    DietPlanID,
    Company_code,
    Location_code,
    created_by
  } = req.body;

  let Photo = null;

  if (req.file) {
    Photo = req.file.buffer;
  }

  try {
    pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Identity_No", sql.NVarChar, Identity_No)
      .input("Full_name", sql.NVarChar, Full_name)
      .input("DOB", sql.Date, DOB)
      .input("Gender", sql.NVarChar, Gender)
      .input("Mobile", sql.NVarChar, Mobile)
      .input("WhatsApp_Number", sql.NVarChar, WhatsApp_Number)
      .input("Email", sql.NVarChar, Email)
      .input("Password", sql.NVarChar, Password)
      .input("Address", sql.NVarChar, Address)
      .input("Emergency_contact_name", sql.NVarChar, Emergency_contact_name)
      .input("Emergency_contact_phone", sql.NVarChar, Emergency_contact_phone)
      .input("Emergency_contact_relation", sql.NVarChar, Emergency_contact_relation)
      .input("Receive_promotions", sql.VarChar, Receive_promotions)
      .input("Receive_notifications", sql.VarChar, Receive_notifications)
      .input("Photo", sql.VarBinary, Photo)
      .input("Joined_date", sql.Date, Joined_date)
      .input("Plan_expiry_date", sql.DateTime, Plan_expiry_date)
      .input("Membership_type", sql.NVarChar, Membership_type)
      .input("is_active", sql.VarChar, is_active)
      .input("DietPlanID", sql.VarChar, DietPlanID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_Member_Hdr_test2 @mode,'',@Identity_No,@Full_name,@DOB,@Gender,@Mobile,@WhatsApp_Number,@Email,@Password,@Address,@Emergency_contact_name,@Emergency_contact_phone,@Emergency_contact_relation,
        @Receive_promotions,@Receive_notifications,@Photo,@Joined_date,@Plan_expiry_date,@Membership_type,@is_active,@DietPlanID,@Company_code,@Location_code,'',0,0,'','','','',@created_by,''`);

    res.status(200).json({ success: true, message: "Data inserted successfully" });

  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const memberUpdate = async (req, res) => {
  const {
    MemberID, Identity_No, Full_name, DOB, Gender, Mobile, WhatsApp_Number, Email, Password, Address, Emergency_contact_name, Emergency_contact_phone, Emergency_contact_relation,
    Receive_promotions, Receive_notifications, Joined_date, Plan_expiry_date, Membership_type, is_active, DietPlanID, Company_code, Location_code, modified_by, Keyfield } = req.body;

  let Photo = null;


  if (req.file) {
    Photo = req.file.buffer; // Image Buffer
  }

  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("MemberID", sql.NVarChar, MemberID)
      .input("Identity_No", sql.NVarChar, Identity_No)
      .input("Full_name", sql.NVarChar, Full_name)
      .input("DOB", sql.Date, DOB)
      .input("Gender", sql.NVarChar, Gender)
      .input("Mobile", sql.NVarChar, Mobile)
      .input("WhatsApp_Number", sql.NVarChar, WhatsApp_Number)
      .input("Email", sql.NVarChar, Email)
      .input("Password", sql.NVarChar, Password)
      .input("Address", sql.NVarChar, Address)
      .input("Emergency_contact_name", sql.NVarChar, Emergency_contact_name)
      .input("Emergency_contact_phone", sql.NVarChar, Emergency_contact_phone)
      .input("Emergency_contact_relation", sql.NVarChar, Emergency_contact_relation)
      .input("Receive_promotions", sql.VarChar, Receive_promotions)
      .input("Receive_notifications", sql.VarChar, Receive_notifications)
      .input("Photo", sql.VarBinary, Photo)
      .input("Joined_date", sql.Date, Joined_date)
      .input("Plan_expiry_date", sql.DateTime, Plan_expiry_date)
      .input("Membership_type", sql.NVarChar, Membership_type)
      .input("is_active", sql.VarChar, is_active)
      .input("DietPlanID", sql.VarChar, DietPlanID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_Member_Hdr_test2 @mode,@MemberID,@Identity_No,@Full_name,@DOB,@Gender,@Mobile,@WhatsApp_Number,@Email,@Password,@Address,
          @Emergency_contact_name,@Emergency_contact_phone,@Emergency_contact_relation,@Receive_promotions,@Receive_notifications,
          @Photo,@Joined_date,@Plan_expiry_date,@Membership_type,@is_active,@DietPlanID,@Company_code,@Location_code,@Keyfield,0,0,'','','','','',@modified_by`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const memberDeleteData = async (req, res) => {
  const memberIDsToDelete = req.body.MemberIDs;

  if (!memberIDsToDelete || !memberIDsToDelete.length) {
    res.status(400).json("Invalid or empty members array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const MemberID of memberIDsToDelete) {
      await pool
        .request()
        .input("MemberID", sql.NVarChar, MemberID)
        .input("Company_code", sql.NVarChar, req.headers["company_code"])
        .input("Location_code", sql.NVarChar, req.headers["location_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(`EXEC sp_Member_Hdr_test2 'D',@MemberID,'','','','','','','','','','','','','','',NULL,'','','','','',@Company_code,@Location_code,'',0,0,'','','','','',@modified_by`);
    }

    res.status(200).json("member deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllmemberData = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Member_Hdr_test2 'A','','','','','','','','','','','','','','','',NULL,'','','','','',@Company_code,@Location_code,'',0,0,'','','','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
//Code ended by ramya on 30-06-2026

//Code Added by pavun on 30-06-2026
const getMembershipType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Membership Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getRelationship = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Relationship','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Ended by pavun on 30-06-2026

//Code Added by Pavun on 01-07-2026
const searchMemberData = async (req, res) => {
  const { MemberID, Identity_No, Full_name, age_from, age_to, Gender, Mobile, WhatsApp_Number, Email, Membership_type, is_active, Joined_date_from,
    Joined_date_to, expiry_date_from, expiry_date_to, DietPlanID, Company_code, Location_code } = req.body;


  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("MemberID", sql.NVarChar, MemberID)
      .input("Identity_No", sql.NVarChar, Identity_No)
      .input("Full_name", sql.NVarChar, Full_name)
      .input("age_from", sql.Int, age_from)
      .input("age_to", sql.Int, age_to)
      .input("Gender", sql.NVarChar, Gender)
      .input("Mobile", sql.NVarChar, Mobile)
      .input("WhatsApp_Number", sql.NVarChar, WhatsApp_Number)
      .input("Email", sql.NVarChar, Email)
      .input("Membership_type", sql.NVarChar, Membership_type)
      .input("is_active", sql.VarChar, is_active)
      .input("DietPlanID", sql.VarChar, DietPlanID)
      .input("Joined_date_from", sql.NVarChar, Joined_date_from)
      .input("Joined_date_to", sql.NVarChar, Joined_date_to)
      .input("expiry_date_from", sql.NVarChar, expiry_date_from)
      .input("expiry_date_to", sql.NVarChar, expiry_date_to)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Member_Hdr_test2 @mode,@MemberID,@Identity_No,@Full_name,'',@Gender,@Mobile,@WhatsApp_Number,@Email,'','','','','',
        '','',NULL,'','',@Membership_type,@is_active,@DietPlanID,@Company_code,@Location_code,'',@age_from,@age_to,@Joined_date_from,@Joined_date_to,@expiry_date_from,@expiry_date_to,'',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }

  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Ended by Pavun on 01-07-2026

//Code Added by Pavun on 04-07-2026
const getCategory = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'FD',@company_code,'Category','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDifficultyLevel = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'FD',@company_code,'Difficulty Level','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getTrainers = async (req, res) => {
  const { company_code, Location_Code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool

      .request()
      .input("mode", sql.NVarChar, "FT")
      .input("company_code", sql.NVarChar, company_code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .query(`EXEC sp_GYM_Trainer @mode, '', '', '', '', '', '', Null, 
        '', '', '', '', '', '', '', @Location_Code, '', @company_code,  0, 0, 0, 0, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programInsertData = async (req, res) => {
  const { ProgramName, Description, Category, Difficulty_level, Goals, Exercises, Duration_per_session, Sessions_per_week, Working_hours, is_active, Company_code,
    Location_code, created_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("ProgramName", sql.NVarChar, ProgramName)
      .input("Description", sql.NVarChar, Description)
      .input("Category", sql.NVarChar, Category)
      .input("Difficulty_level", sql.NVarChar, Difficulty_level)
      .input("Goals", sql.NVarChar, Goals)
      .input("Exercises", sql.NVarChar, Exercises)
      .input("Duration_per_session", sql.NVarChar, Duration_per_session)
      .input("Sessions_per_week", sql.NVarChar, Sessions_per_week)
      .input("Working_hours", sql.NVarChar, Working_hours)
      .input("is_active", sql.NVarChar, is_active)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_Program_Hdr_Test @mode,'',@ProgramName,@Description,@Category,@Difficulty_level,@Goals,@Exercises,@Duration_per_session,@Sessions_per_week,@Working_hours,@is_active,'','',0,0,@Company_code,@Location_code,'',@created_by,''`);

    res.status(200).json({
      message: "program data saved successfully",
      ProgramID: result.recordset[0].ProgramID,
      Keyfield: result.recordset[0].Keyfield,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programUpdateData = async (req, res) => {
  const { ProgramID, ProgramName, Description, Category, Difficulty_level, Goals, Exercises, Duration_per_session, Sessions_per_week, Working_hours, is_active, Company_code,
    Location_code, Keyfield, modified_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool

      .request()
      .input("mode", sql.NVarChar, "U")
      .input("ProgramID", sql.NVarChar, ProgramID)
      .input("ProgramName", sql.NVarChar, ProgramName)
      .input("Description", sql.NVarChar, Description)
      .input("Category", sql.NVarChar, Category)
      .input("Difficulty_level", sql.NVarChar, Difficulty_level)
      .input("Goals", sql.NVarChar, Goals)
      .input("Exercises", sql.NVarChar, Exercises)
      .input("Duration_per_session", sql.NVarChar, Duration_per_session)
      .input("Sessions_per_week", sql.NVarChar, Sessions_per_week)
      .input("Working_hours", sql.NVarChar, Working_hours)
      .input("is_active", sql.NVarChar, is_active)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_Program_Hdr_Test @mode,@ProgramID,@ProgramName,@Description,@Category,@Difficulty_level,@Goals,@Exercises,
@Duration_per_session,@Sessions_per_week,@Working_hours,@is_active,'','',0,0,@Company_code,@Location_code,@Keyfield,'',@modified_by`);

    res.status(200).json("program data updated successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programDeleteData = async (req, res) => {
  const programIDsToDelete = req.body.ProgramIDs;

  if (!programIDsToDelete || !programIDsToDelete.length) {
    res.status(400).json("Invalid or empty programs array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const Keyfield of programIDsToDelete) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("Keyfield", sql.NVarChar, Keyfield)
        .input("ProgramID", sql.NVarChar, req.headers["programid"])
        .input("Company_code", sql.NVarChar, req.headers["company_code"])
        .input("Location_code", sql.NVarChar, req.headers["location_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified_by"])
        .query(`EXEC sp_Program_Hdr_Test @mode,@ProgramID,'','','','','','','','','','','','',0,0,@Company_code,@Location_code,@Keyfield,'',@modified_by`);
    }

    res.status(200).json("program deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const programFacultyInsertData = async (req, res) => {
  const { Assigned_FacultyID, is_active, ProgramID, Company_code, Location_code, created_by, Keyfield_header ,UpdateMode} = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool

      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Assigned_FacultyID", sql.NVarChar, Assigned_FacultyID)
      .input("is_active", sql.NVarChar, is_active)
      .input("ProgramID", sql.NVarChar, ProgramID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("Keyfield_header", sql.NVarChar, Keyfield_header)
      .input("created_by", sql.NVarChar, created_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(`EXEC sp_Program_Faculty_Assignment @mode,@Assigned_FacultyID,@is_active,@Company_code,@Location_code,@ProgramID,@Keyfield_header,
'',@created_by,'',@UpdateMode`);

    res.status(200).json("program faculty data saved successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programFacultyUpdateData = async (req, res) => {
  const { Assigned_FacultyID, is_active, Company_code, Location_code, created_by, ProgramID } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Assigned_FacultyID", sql.NVarChar, Assigned_FacultyID)
      .input("is_active", sql.NVarChar, is_active)
      .input("ProgramID", sql.NVarChar, ProgramID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_Program_Faculty_Assignment @mode,@Assigned_FacultyID,@is_active,@Company_code,@Location_code,@ProgramID,'','',@created_by,'',''`);

    res.status(200).json("program faculty data saved successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programFacultyDeleteData = async (req, res) => {
  const programFacultysToDelete = req.body.ProgramFacultys;

  if (!programFacultysToDelete || !programFacultysToDelete.length) {
    res.status(400).json("Invalid or empty programs array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const Keyfield_header of programFacultysToDelete) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("Keyfield_header", sql.NVarChar, Keyfield_header)
        .input("ProgramID", sql.NVarChar, req.headers["programid"])
        .input("Company_code", sql.NVarChar, req.headers["company_code"])
        .input("Location_code", sql.NVarChar, req.headers["location_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified_by"])
        .input("UpdateMode", sql.NVarChar, req.headers["updatemode"])
        .query(`EXEC sp_Program_Faculty_Assignment @mode,'','',@Company_code,@Location_code,@ProgramID,@Keyfield_header,'','',@modified_by,@UpdateMode`);
    }

    res.status(200).json("program deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const programExerciseInsertData = async (req, res) => {
  const { ProgramID, ExercisesID, Exercises_Name, Exercises_Count, Exercises_Repetitions, is_active, Company_code, Location_code, created_by,UpdateMode } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool

      .request()
      .input("mode", sql.NVarChar, "I")
      .input("ProgramID", sql.NVarChar, ProgramID)
      .input("ExercisesID", sql.Int, ExercisesID)
      .input("Exercises_Name", sql.NVarChar, Exercises_Name)
      .input("Exercises_Count", sql.Int, Exercises_Count)
      .input("Exercises_Repetitions", sql.Int, Exercises_Repetitions)
      .input("is_active", sql.NVarChar, is_active)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(`EXEC sp_Program_Exercises @mode,@ProgramID,@ExercisesID,@Exercises_Name,@Exercises_Count,@Exercises_Repetitions,@is_active,@Company_code,
@Location_code,'','',@created_by,'',@UpdateMode`);

    res.status(200).json("program exercise data saved successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programExerciseUpdateData = async (req, res) => {
  const { ProgramID, ExercisesID, Exercises_Name, Exercises_Count, Exercises_Repetitions, is_active, Company_code, Location_code, created_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool

      .request()
      .input("mode", sql.NVarChar, "U")
      .input("ProgramID", sql.NVarChar, ProgramID)
      .input("ExercisesID", sql.Int, ExercisesID)
      .input("Exercises_Name", sql.NVarChar, Exercises_Name)
      .input("Exercises_Count", sql.Int, Exercises_Count)
      .input("Exercises_Repetitions", sql.Int, Exercises_Repetitions)
      .input("is_active", sql.NVarChar, is_active)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_Program_Exercises @mode,@ProgramID,@ExercisesID,@Exercises_Name,@Exercises_Count,@Exercises_Repetitions,@is_active,@Company_code,
@Location_code,'','',@created_by,'',''`);

    res.status(200).json("program exercise data saved successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const programExerciseDeleteData = async (req, res) => {
  const programExercisesToDelete = req.body.ProgramExercises;

  if (!programExercisesToDelete || !programExercisesToDelete.length) {
    res.status(400).json("Invalid or empty programs array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const Keyfield_header of programExercisesToDelete) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("Keyfield_header", sql.NVarChar, Keyfield_header)
        .input("ProgramID", sql.NVarChar, req.headers["programid"])
        .input("Company_code", sql.NVarChar, req.headers["company_code"])
        .input("Location_code", sql.NVarChar, req.headers["location_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified_by"])
        .input("UpdateMode", sql.NVarChar, req.headers["updatemode"])
        .query(`EXEC sp_Program_Exercises @mode,@ProgramID,0,'',0,0,'',@Company_code,@Location_code,@keyfield_header,'','',@modified_by,@UpdateMode`);
    }

    res.status(200).json("program deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getMemberCardData = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "ST")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Member_Hdr_test2 @mode,'','','','','','','','','','','','','','','',NULL,'','','','','',@Company_code,@Location_code,'',0,0,'','','','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
//Code Ended by Pavun on 04-07-2026

//Code Added by Pavun on 07-07-2026
const programSearchData = async (req, res) => {
  const { ProgramID, ProgramName, Description, Category, Difficulty_level, Goals, Exercises, Duration_per_session, Sessions_per_week, Working_hours, is_active, Company_code,
    Location_code, Assigned_Faculty, Exercises_Name, Exercises_Count, Exercises_Repetitions } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("ProgramID", sql.NVarChar, ProgramID)
      .input("ProgramName", sql.NVarChar, ProgramName)
      .input("Description", sql.NVarChar, Description)
      .input("Category", sql.NVarChar, Category)
      .input("Difficulty_level", sql.NVarChar, Difficulty_level)
      .input("Goals", sql.NVarChar, Goals)
      .input("Duration_per_session", sql.NVarChar, Duration_per_session)
      .input("Sessions_per_week", sql.NVarChar, Sessions_per_week)
      .input("Working_hours", sql.NVarChar, Working_hours)
      .input("is_active", sql.NVarChar, is_active)
      .input("Assigned_Faculty", sql.NVarChar, Assigned_Faculty)
      .input("Exercises_Name", sql.NVarChar, Exercises_Name)
      .input("Exercises_Count", sql.NVarChar, Exercises_Count)
      .input("Exercises_Repetitions", sql.NVarChar, Exercises_Repetitions)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Program_Hdr_Test @mode,@ProgramID,@ProgramName,@Description,@Category,@Difficulty_level,@Goals,'',
@Duration_per_session,@Sessions_per_week,@Working_hours,@is_active,@Assigned_Faculty,@Exercises_Name,@Exercises_Count,@Exercises_Repetitions,@Company_code,@Location_code,'','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
//Code Ended by Pavun on 07-07-2026

//Code Added by Ramya on 08-07-2026
const settingSaveData = async (req, res) => {
  const { NumberGeneration, MemberExpiredSoon, companyCode, locationCode, created_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("NumberGeneration", sql.NVarChar, NumberGeneration)
      .input("MemberExpiredSoon", sql.Int, MemberExpiredSoon)
      .input("Company_code", sql.NVarChar, companyCode)
      .input("Location_code", sql.NVarChar, locationCode)
      .input("keyfield_header", sql.NVarChar, "")
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, created_by)
      .query(`EXEC sp_Setting @mode, @NumberGeneration, @MemberExpiredSoon, @Company_code, @Location_code, @keyfield_header, @created_by, @modified_by`);

    res.status(200).json({
      message: result.recordset[0].Message,
      status: result.recordset[0].Status
    });

  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};
//Code Ended by Ramya on 08-07-2026

//Code Added by Dinesh Gokul on 08-07-2026
const getSettingScreenData = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SS")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Setting @mode, '', '', @Company_code, @Location_code, '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
//Code Ended by Dinesh Gokul on 08-07-2026

//Code Added by Pavun on 08-07-2026
const programCardData = async (req, res) => {
  const { Company_code, Location_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "ST")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Program_Hdr_Test @mode,'','','','','','','','','','','','','',0,0,@Company_code,@Location_code,'','',''`);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

//Code Ended by Pavun on 08-07-2026

//Code Added by Dinesh Gokul on 10-07-2026
const getTrainerCardData = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "ST")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_GYM_Trainer @mode, '', '', '', '', '', '', Null, 
        '', '', '', '', '', '', '', @Location_Code, '', @company_code,  0, 0, 0, 0, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
//Code Ended by Dinesh Gokul on 10-07-2026

//code added by SakthiGanesh on 07-14-26
const couponInsertData = async (req, res) => {
  const { Coupon_Code, Description, Discount_Type, Discount_Value, Minimum_Purchase, Valid_From, Valid_Until, Max_Uses, 
    Current_Uses, Applicable_Packages, Status, Company_Code, Location_Code, created_by } = req.body;  

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Coupon_Code", sql.NVarChar, Coupon_Code)
      .input("Description", sql.NVarChar, Description)
      .input("Discount_Type", sql.NVarChar, Discount_Type)
      .input("Discount_Value", sql.Decimal(18,2), Discount_Value)
      .input("Minimum_Purchase", sql.Decimal(18,2), Minimum_Purchase)
      .input("Valid_From", sql.Date, Valid_From)
      .input("Valid_Until", sql.Date, Valid_Until)
      .input("Max_Uses", sql.Int, Max_Uses)
      .input("Current_Uses", sql.Int, Current_Uses)
      .input("Applicable_Packages", sql.NVarChar, Applicable_Packages)
      .input("Status", sql.NVarChar, Status)
      .input("Company_Code", sql.NVarChar, Company_Code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC Sp_Coupon @mode,'',@Coupon_Code,@Description,@Discount_Type,@Discount_Value,@Minimum_Purchase,
      @Valid_From,@Valid_Until,@Max_Uses,@Current_Uses,@Applicable_Packages,@Status,
      @Company_Code,@Location_Code,'',@created_by,''`);

    res.status(200).json({
      message: "Coupon created successfully",
      CouponID: result.recordset[0].CouponID,
      KeyField: result.recordset[0].KeyField,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const couponUpdateData = async (req, res) => {

  const { CouponID, Coupon_Code, Description, Discount_Type, Discount_Value, Minimum_Purchase, Valid_From, 
    Valid_Until, Max_Uses, Current_Uses, Applicable_Packages, Status, Company_Code, Location_Code, KeyField, modified_by } = req.body;

  try {

    const pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("CouponID", sql.NVarChar, CouponID)
      .input("Coupon_Code", sql.NVarChar, Coupon_Code)
      .input("Description", sql.NVarChar, Description)
      .input("Discount_Type", sql.NVarChar, Discount_Type)
      .input("Discount_Value", sql.Decimal(18,2), Discount_Value)
      .input("Minimum_Purchase", sql.Decimal(18,2), Minimum_Purchase)
      .input("Valid_From", sql.Date, Valid_From)
      .input("Valid_Until", sql.Date, Valid_Until)
      .input("Max_Uses", sql.Int, Max_Uses)
      .input("Current_Uses", sql.Int, Current_Uses)
      .input("Applicable_Packages", sql.NVarChar, Applicable_Packages)
      .input("Status", sql.NVarChar, Status)
      .input("Company_Code", sql.NVarChar, Company_Code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC Sp_Coupon @mode,@CouponID,@Coupon_Code,@Description,@Discount_Type,@Discount_Value,@Minimum_Purchase,
      @Valid_From,@Valid_Until,@Max_Uses,@Current_Uses,@Applicable_Packages,@Status,
      @Company_Code,@Location_Code,@KeyField,'',@modified_by`);

    res.status(200).json("Coupon updated successfully");

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }

};

const couponDeleteData = async (req, res) => {

  const couponIDsToDelete = req.body.CouponIDs;

  if (!couponIDsToDelete || !couponIDsToDelete.length) {
    return res.status(400).json("Invalid or empty Coupon array.");
  }

  try {

    const pool = await connection.connectToDatabase();

    for (const KeyField of couponIDsToDelete) {

      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("KeyField", sql.NVarChar, KeyField)
        .input("CouponID", sql.NVarChar, req.headers["couponid"])
        .input("Company_Code", sql.NVarChar, req.headers["company_code"])
        .input("Location_Code", sql.NVarChar, req.headers["location_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified_by"])
        .query(`EXEC Sp_Coupon @mode,@CouponID,'','','',0,0,NULL,NULL,0,0,'','',
        @Company_Code,@Location_Code,@KeyField,'',@modified_by`);

    }

    res.status(200).json("Coupon deleted successfully");

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }

};

const couponSearchData = async (req, res) => {

  const { CouponID, Coupon_Code, Description, Discount_Type, Status, Valid_From, Valid_Until, Company_Code, 
    Discount_Value, Applicable_Packages, Location_Code } = req.body;

  try {

    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("CouponID", sql.NVarChar, CouponID)
      .input("Coupon_Code", sql.NVarChar, Coupon_Code)
      .input("Description", sql.NVarChar, Description)
      .input("Discount_Type", sql.NVarChar, Discount_Type)
      .input("Status", sql.NVarChar, Status)
      .input("Valid_From", sql.NVarChar, Valid_From)
      .input("Valid_Until", sql.NVarChar, Valid_Until)
      .input("Company_Code", sql.NVarChar, Company_Code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("Discount_Value", sql.Decimal(18,2), Discount_Value)
      .input("Applicable_Packages", sql.NVarChar, Applicable_Packages)
      .query(`EXEC Sp_Coupon @mode, @CouponID, @Coupon_Code, @Description, @Discount_Type, @Discount_Value, 0, @Valid_From, @Valid_Until, 0, 0, @Applicable_Packages, @Status, @Company_Code, @Location_Code, '', '', ''`); 

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }

  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }

};
//code ended by SakthiGanesh on 07-14-26

//code added by SakthiGanesh on 07-15-26
const getGender = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Gender','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const couponDashboard = async (req, res) => {

  const { Company_Code, Location_Code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "DS")
      .input("Company_Code", sql.NVarChar, Company_Code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .query(`EXEC Sp_Coupon @mode, '', '', '', '', 0, 0,  NULL, NULL, 0, 0, '', '', @Company_Code, @Location_Code, '', '', '' `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({
        message: "Dashboard data not found",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }

};
//code ended by SakthiGanesh on 07-15-26

//Code added by Dinesh Gokul on 14-07-2026
const Diet_Plans_hdrInsert = async (req, res) => {
  const {
  DietPlanID, Diet_Name, Category, Description, Goals, Restrictions, TrainerID, Is_Active, KeyField, Location_Code,
  created_date,
  modified_date,
  created_by,
  modified_by,
  company_code
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("mode", sql.NVarChar, "I")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Diet_Name", sql.NVarChar, Diet_Name)
      .input("Category", sql.NVarChar, Category)
      .input("Description", sql.NVarChar, Description)
      .input("Goals", sql.NVarChar, Goals)
      .input("Restrictions", sql.NVarChar, Restrictions)
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("Is_Active", sql.NVarChar, Is_Active)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.DateTime, created_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.DateTime, modified_date)
      .query(`EXEC sp_Diet_Plans_hdr @mode, @DietPlanID, @Diet_Name, @Category, @Description, @Goals, @Restrictions, @TrainerID, @Is_Active, @KeyField, @Location_Code, @company_code, @created_by, @created_date, @modified_by, @modified_date`);
    const generatedDietPlanID = result.recordset[0].DietPlanID;
    res.status(200).json({ success: true, message: "Diet_Plans_hdr insertd successfully", DietPlanID: generatedDietPlanID });
  } catch (err) {
    console.error("Error during Diet_Plans_hdr insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_hdrUpdate = async (req, res) => {
  const {
  DietPlanID, Diet_Name, Category, Description, Goals, Restrictions, TrainerID, Is_Active, KeyField, Location_Code,
  modified_by,
  company_code
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "U")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Diet_Name", sql.NVarChar, Diet_Name)
      .input("Category", sql.NVarChar, Category)
      .input("Description", sql.NVarChar, Description)
      .input("Goals", sql.NVarChar, Goals)
      .input("Restrictions", sql.NVarChar, Restrictions)
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("Is_Active", sql.NVarChar, Is_Active)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_Diet_Plans_hdr @mode, @DietPlanID, @Diet_Name, @Category, @Description, @Goals, @Restrictions, @TrainerID, @Is_Active, @KeyField, @Location_Code, @company_code, '', '', @modified_by, ''`);

    res.status(200).json({ success: true, message: "Diet_Plans_hdr updated successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_hdr update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_hdrDelete = async (req, res) => {
  const {DietPlanID, KeyField, Location_Code, modified_by, company_code
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "D")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_Diet_Plans_hdr @mode, @DietPlanID, '', '', '', '', '', '', '', @KeyField, @Location_Code, @company_code, '', '', @modified_by, ''`);

    res.status(200).json({ success: true, message: "Diet_Plans_hdr deleted successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_hdr delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_MealsInsert = async (req, res) => {
  const { DietPlanID, Meal_Type, Meal_Name, Quantity, Calories, Protein, Carbs, Fats, Time_Slot, KeyField, Location_Code, created_date, modified_date, created_by, modified_by, company_code, UpdateMode
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "I")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Meal_Type", sql.NVarChar, Meal_Type)
      .input("Meal_Name", sql.NVarChar, Meal_Name)
      .input("Quantity", sql.NVarChar, Quantity)
      .input("Calories", sql.NVarChar, Calories)
      .input("Protein", sql.NVarChar, Protein)
      .input("Carbs", sql.NVarChar, Carbs)
      .input("Fats", sql.NVarChar, Fats)
      .input("Time_Slot", sql.NVarChar, Time_Slot)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.DateTime, created_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.DateTime, modified_date)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(`EXEC sp_Diet_Plans_Meals @mode, 0, @DietPlanID, @Meal_Type, @Meal_Name, @Quantity, @Calories, @Protein, @Carbs, @Fats, @Time_Slot, @KeyField, @Location_Code, @company_code, @created_by, @created_date, @modified_by, @modified_date, @UpdateMode`);

    res.status(200).json({ success: true, message: "Diet_Plans_Meals insertd successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_Meals insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_MealsUpdate = async (req, res) => {
  const {
  Sno, DietPlanID, Meal_Type, Meal_Name, Quantity, Calories, Protein, Carbs, Fats, Time_Slot, KeyField, Location_Code,
  created_date,
  modified_date,
  created_by,
  modified_by,
  company_code
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "U")
      .input("Sno", sql.Int, Sno)
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Meal_Type", sql.NVarChar, Meal_Type)
      .input("Meal_Name", sql.NVarChar, Meal_Name)
      .input("Quantity", sql.NVarChar, Quantity)
      .input("Calories", sql.NVarChar, Calories)
      .input("Protein", sql.NVarChar, Protein)
      .input("Carbs", sql.NVarChar, Carbs)
      .input("Fats", sql.NVarChar, Fats)
      .input("Time_Slot", sql.NVarChar, Time_Slot)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.DateTime, created_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.DateTime, modified_date)
      .query(`EXEC sp_Diet_Plans_Meals @mode, @Sno, @DietPlanID, @Meal_Type, @Meal_Name, @Quantity, @Calories, @Protein, @Carbs, @Fats, @Time_Slot, @KeyField, @Location_Code, @company_code, @created_by, @created_date, @modified_by, @modified_date, ''`);

    res.status(200).json({ success: true, message: "Diet_Plans_Meals updated successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_Meals update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_MealsDelete = async (req, res) => {
  const { Sno, DietPlanID, KeyField, Location_Code, modified_by, company_code, UpdateMode } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "D")
      .input("Sno", sql.Int, Sno)
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(`EXEC sp_Diet_Plans_Meals @mode, @Sno, @DietPlanID, '', '', '', '', '', '', '', '', @KeyField, @Location_Code, @company_code, '', '', @modified_by, '', @UpdateMode`);

    res.status(200).json({ success: true, message: "Diet_Plans_Meals deleted successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_Meals delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_DetailsInsert = async (req, res) => {
  const { DietPlanID, Essentials, Daily_Calories_Target, Duration, KeyField, Location_Code, created_by, company_code, UpdateMode
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "I")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Essentials", sql.NVarChar, Essentials)
      .input("Daily_Calories_Target", sql.NVarChar, Daily_Calories_Target)
      .input("Duration", sql.NVarChar, Duration)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(`EXEC sp_Diet_Plans_Details @mode, 0, @DietPlanID, @Essentials, @Daily_Calories_Target, @Duration, @KeyField, @Location_Code, @company_code, @created_by, '', '', '', @UpdateMode`);

    res.status(200).json({ success: true, message: "Diet_Plans_Details insertd successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_Details insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_DetailsUpdate = async (req, res) => {
  const {
  Sno, DietPlanID, Essentials, Daily_Calories_Target, Duration, KeyField, Location_Code,
  created_date,
  modified_date,
  created_by,
  modified_by,
  company_code
} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "U")
      .input("Sno", sql.Int, Sno)
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Essentials", sql.NVarChar, Essentials)
      .input("Daily_Calories_Target", sql.NVarChar, Daily_Calories_Target)
      .input("Duration", sql.NVarChar, Duration)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.DateTime, created_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.DateTime, modified_date)
      .query(`EXEC sp_Diet_Plans_Details @mode, @Sno, @DietPlanID, @Essentials, @Daily_Calories_Target, @Duration, @KeyField, @Location_Code, @company_code, @created_by, @created_date, @modified_by, @modified_date, ''`);

    res.status(200).json({ success: true, message: "Diet_Plans_Details updated successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_Details update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Diet_Plans_DetailsDelete = async (req, res) => {
  const { Sno, DietPlanID, KeyField, Location_Code, modified_by, company_code, UpdateMode } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("mode", sql.NVarChar, "D")
      .input("Sno", sql.Int, Sno)
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("KeyField", sql.NVarChar, KeyField)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(`EXEC sp_Diet_Plans_Details @mode, @Sno, @DietPlanID, '', '', '', @KeyField, @Location_Code, @company_code, '', '', @modified_by, '', @UpdateMode`);

    res.status(200).json({ success: true, message: "Diet_Plans_Details deleted successfully" });
  } catch (err) {
    console.error("Error during Diet_Plans_Details delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by Dinesh Gokul on 14-07-2026

//Code added by Dinesh Gokul on 15-07-2026
const getMealType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'FD',@company_code,'Meal Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getEssentials = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'FD',@company_code,'Essentials','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDuration = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'FD',@company_code,'Duration','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const dietPlanSearchData = async (req, res) => {
  const { DietPlanID, Diet_Name, Category, Description, Goals, Restrictions, TrainerID, Is_Active, Company_code,
    Location_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Diet_Name", sql.NVarChar, Diet_Name)
      .input("Description", sql.NVarChar, Description)
      .input("Category", sql.NVarChar, Category)
      .input("Goals", sql.NVarChar, Goals)
      .input("Restrictions", sql.NVarChar, Restrictions)
      .input("TrainerID", sql.NVarChar, TrainerID)
      .input("Is_Active", sql.NVarChar, Is_Active)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Diet_Plans_hdr @mode, @DietPlanID, @Diet_Name, @Category, @Description, @Goals, @Restrictions, @TrainerID, @Is_Active, '', @Location_Code, @company_code, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by Dinesh Gokul on 15-07-2026

//Code added by Ramya on 20-07-2026

const adminDashboardCardData = async (req, res) => {
  const { Company_code, Location_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "S")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`
        EXEC SP_AdminDashboard
            @mode,
            @Company_code,
            @Location_code
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

  
//Code ended by Ramya on 20-07-2026



//code added by SakthiGanesh J 16-07-26
const getPackageTypes = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Package Types','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPrograms = async (req, res) => {
  const { company_code, Location_Code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "PAD")
      .input("company_code", sql.NVarChar, company_code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .query(`EXEC sp_Program_Hdr_Test @mode,'','','','','','','','','','','','','',0,0,@Company_code,@Location_code,'','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
//code ended by SakthiGanesh J 16-07-26

//Code added by Ramya on 16-07-2026

const PackageInsertData = async (req, res) => {
  const { package_Name, package_type, duration_days, price, features, discount_percentage,is_active, Company_code,
    Location_code, created_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Mode", sql.NVarChar, "I")
      .input("package_Name", sql.NVarChar, package_Name)
      .input("package_type", sql.NVarChar, package_type)
      .input("duration_days", sql.Int, duration_days)
      .input("price", sql.Decimal, price)
      .input("features", sql.NVarChar, features)
      .input("discount_percentage", sql.Decimal, discount_percentage)
      .input("is_active", sql.NVarChar, is_active)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_Package_hdr_test @Mode,'',@package_Name,@package_type,@duration_days,@price,@features,@discount_percentage,@is_active,@Company_code,@Location_code,'',@created_by,''`);

    res.status(200).json({
      message: "pakage data saved successfully",
      PackageID: result.recordset[0].PackageID,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const PackageUpdateData = async (req, res) => {

    const { package_ID,package_Name,package_type,duration_days,price,features,discount_percentage,is_active,Company_Code,Location_Code,modified_by
    } = req.body;


    try {

        const pool = await connection.connectToDatabase();
        await pool
            .request()

            .input("Mode", sql.NVarChar, "U")
            .input("package_ID", sql.NVarChar, package_ID)
            .input("package_Name", sql.NVarChar, package_Name)
            .input("package_type", sql.NVarChar, package_type)
            .input("duration_days", sql.Int, duration_days)
            .input("price", sql.Decimal, price)
            .input("features", sql.NVarChar, features)
            .input("discount_percentage", sql.Decimal, discount_percentage)
            .input("is_active", sql.NVarChar, is_active)
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .input("modified_by", sql.NVarChar, modified_by)
            .query(`EXEC sp_Package_hdr_test @Mode,@package_ID,@package_Name,@package_type,@duration_days,@price,@features,@discount_percentage,@is_active,@Company_Code,@Location_Code,'','',@modified_by`);
        res.status(200).json({
            message: "Package data updated successfully"
        });
    } catch (err) {
        console.error("Error", err.message);
        return res
            .status(500)
            .json({
                message: err.message || "Internal Server Error"
            });
    }
};
const PackageDeleteData = async (req, res) => {
    const {package_ID,Company_Code,Location_Code, KeyField } = req.body;
    try {
        const pool = await connection.connectToDatabase();
        await pool
            .request()
            .input("Mode", sql.NVarChar, "D")
            .input("package_ID", sql.NVarChar, package_ID)
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .input("KeyField", sql.NVarChar, KeyField)
            .query(` EXEC sp_Package_hdr_test @Mode, @package_ID, '', '', 0, 0, '', 0, '', @Company_Code, @Location_Code, @KeyField, '', ''`);
        res.status(200).json({
            message: "Package data deleted successfully"
        });
    } catch (err) {
        console.error("Error", err.message);
        return res
            .status(500)
            .json({
                message: err.message || "Internal Server Error"
            });
    }
};
const PackageSelectData = async (req, res) => {
    const {package_ID,Company_Code,Location_Code} = req.body;
    try {
        const pool = await connection.connectToDatabase();
        const result = await pool
            .request()
            .input("Mode", sql.NVarChar, "S")
            .input("package_ID", sql.NVarChar, package_ID)
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .query(`EXEC sp_Package_hdr_test @Mode, @package_ID, '', '', 0, 0, '', 0, '', @Company_Code, @Location_Code, '', '', ''`);
      res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error", err.message);
        return res
            .status(500)
            .json({
                message: err.message || "Internal Server Error"
            });
    }
};
const PackageViewAllData = async (req, res) => {
    const {
        Company_Code,Location_Code } = req.body;
    try {
        const pool = await connection.connectToDatabase();
        const result = await pool
            .request()
            .input("Mode", sql.NVarChar, "A")
            .input("package_Name", sql.NVarChar, "")
            .input("package_type", sql.NVarChar, "")
            .input("duration_days", sql.NVarChar, 0)
            .input("price", sql.NVarChar, 0)
            .input("features", sql.NVarChar, "")
            .input("discount_percentage", sql.NVarChar, 0)
            .input("is_active", sql.NVarChar, "")
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .input("created_by", sql.NVarChar, "")
            .input("modified_by", sql.NVarChar, "")
            .query(`EXEC sp_Package_hdr_test @Mode,@package_ID,@package_Name,@package_type,@duration_days,@price,@features,@discount_percentage,@is_active,@Company_Code,@Location_Code, '',@created_by,@modified_by`);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error", err.message);
        return res
            .status(500)
            .json({
                message: err.message || "Internal Server Error"
            });
    }
};
const PackageSearchData = async (req, res) => {
    const { package_ID, package_Name, package_type, duration_days, price, features, discount_percentage,
       is_active, program_id, Company_Code, Location_Code } = req.body;

    try {
        const pool = await connection.connectToDatabase();

        const result = await pool
            .request()
            .input("Mode", sql.NVarChar, "SC")
            .input("package_ID", sql.NVarChar, package_ID)
            .input("package_Name", sql.NVarChar, package_Name)
            .input("package_type", sql.NVarChar, package_type)
            .input("duration_days", sql.Int, duration_days)
            .input("price", sql.Decimal(18, 2), price)
            .input("features", sql.NVarChar, features)
            .input("discount_percentage", sql.Decimal(18, 2), discount_percentage)
            .input("is_active", sql.NVarChar, is_active)
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .input("program_id", sql.NVarChar, program_id)
            .query(` EXEC sp_Package_hdr_test @Mode, @package_ID, @package_Name, @package_type, @duration_days, @price, @features, @discount_percentage, @is_active, @Company_Code, @Location_Code, '', '', '' `);

            if (result.recordset.length > 0) {
                res.status(200).json(result.recordset);
            } else {
                res.status(404).json("Data not found");
            }
          
        } catch (err) {
            console.error("Error", err.message);
            return res.status(500).json({
                message: err.message || "Internal Server Error"
            });
        }
    };

  const PackageDetailsInsertData = async (req, res) => {

    const { Sno, package_ID, Program_ID, Company_Code, Location_Code, created_by } = req.body;

    try {

        const pool = await connection.connectToDatabase();

        await pool
            .request()
            .input("mode", sql.NVarChar, "I")
            .input("Sno", sql.Int, Sno)
            .input("package_ID", sql.NVarChar, package_ID)
            .input("Program_ID", sql.NVarChar, Program_ID)
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .input("created_by", sql.NVarChar, created_by)
            .query(`EXEC sp_Package_Details @mode,@Sno,@package_ID, '',@Program_ID,'',@Company_Code,@Location_Code,@created_by,'',''`);

        res.status(200).json("Package Details saved successfully");

    } catch (err) {

        console.error("Error", err.message);

        return res
            .status(500)
            .json({ message: err.message || "Internal Server Error" });
    }
  };

const PackageDetailsUpdateData = async (req, res) => {

    const { Sno, KeyFieldHeader, Program_ID, Company_Code, Location_Code, created_by, modified_by, UpdateMode } = req.body;

    try {

        const pool = await connection.connectToDatabase();

        await pool
            .request()
            .input("mode", sql.NVarChar, "U")
            .input("Sno", sql.Int, Sno)
            .input("KeyFieldHeader", sql.NVarChar, KeyFieldHeader)
            .input("Program_ID", sql.NVarChar, Program_ID)
            .input("KeyField", sql.NVarChar, "")
            .input("Company_Code", sql.NVarChar, Company_Code)
            .input("Location_Code", sql.NVarChar, Location_Code)
            .input("created_by", sql.NVarChar, created_by)
            .input("modified_by", sql.NVarChar, modified_by)
            .input("UpdateMode", sql.NVarChar, UpdateMode)
            .query(`EXEC sp_Package_Details @mode,@Sno,@KeyFieldHeader,@Program_ID,@KeyField,@Company_Code,@Location_Code,@created_by,@modified_by,@UpdateMode`);

        res.status(200).json("Package Details updated successfully");

    } catch (err) {

        console.error("Error", err.message);

        return res
            .status(500)
            .json({ message: err.message || "Internal Server Error" });
    }
};

const PackageDetailsDeleteData = async (req, res) => {

    const KeyFieldHeaders = req.body.KeyFieldHeaders;

    if (!KeyFieldHeaders || !KeyFieldHeaders.length) {
        return res.status(400).json("Invalid or empty package array.");
    }

    try {

        const pool = await connection.connectToDatabase();

        for (const KeyFieldHeader of KeyFieldHeaders) {

            await pool
                .request()
                .input("mode", sql.NVarChar, "D")
                .input("KeyFieldHeader", sql.NVarChar, KeyFieldHeader)
                .input("Company_Code", sql.NVarChar, req.headers["company_code"])
                .input("Location_Code", sql.NVarChar, req.headers["location_code"])
                .input("modified_by", sql.NVarChar, req.headers["modified_by"])
                .input("UpdateMode", sql.NVarChar, req.headers["updatemode"])
                .query(` EXEC sp_Package_Details @mode, 0, '', @KeyFieldHeader, '', '', @Company_Code, @Location_Code, '', @modified_by, @UpdateMode `);
        }

        res.status(200).json("Package Details deleted successfully");

    } catch (err) {

        console.error("Error", err);

        return res.status(500).json({
            message: err.message || "Internal Server Error",
        });
    }
};
//Code ended by Ramya on 16-07-2026

//Code Added by SakthiGanesh on 17-07-26
const getAppPackages = async (req, res) => {
  const { Company_Code, Location_Code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "P")
      .input("Company_Code", sql.NVarChar, Company_Code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .query(`EXEC sp_Package_hdr_test @mode,'', '', '', 0,  0,  '', 0,  '', @Company_Code,@Location_Code,'', '', ''  `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({
        message: "Package data not found",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
//Code Ended by SakthiGanesh on 17-07-26

//Code added by Dinesh Gokul on 16-07-2026
const Diet_Plans_DetailsSearch = async (req, res) => {
  const {
    DietPlanID,
    Location_Code,
    company_code,
  } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("mode", sql.NVarChar, "A")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)
      .query(`  EXEC sp_Diet_Plans_Details  @mode,  '',  @DietPlanID,  '',  '',  '',  '',  @Location_Code,  @company_code,  '',  '',  '',  '', ''`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const Diet_Plans_MealsSearch = async (req, res) => {

  const {
    DietPlanID,
    Location_Code,
    company_code,
  } = req.body;

  try {

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()

      .input("mode", sql.NVarChar, "A")
      .input("DietPlanID", sql.NVarChar, DietPlanID)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("company_code", sql.NVarChar, company_code)

      .query(`
        EXEC sp_Diet_Plans_Meals @mode, '', @DietPlanID, '', '', '', '', '', '', '', '', '', 
        @Location_Code, @company_code, '', '', '', '', '' `);

    res.status(200).json(result.recordset);

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};
//Code ended by Dinesh Gokul on 16-07-2026

//Code added by Dinesh Gokul on 17-07-2026
const getDietPlanCardData = async (req, res) => {
  const { Company_code, Location_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CD")
      .input("company_code", sql.NVarChar, Company_code)
      .input("Location_Code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Diet_Plans_hdr @mode, '', '', '', '', '', '', '', '', '', @Location_Code, @company_code, '', '', '', ''`);

    res.status(200).json({
      success: true,
      data: result.recordset[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//Code ended by Dinesh Gokul on 17-07-2026

//Code added by Dinesh Gokul on 18-07-2026
const MemberShipTypeHdrInsert = async (req, res) => {
  const { MemberShipType_id, MemberShipType_Name, Status, Company_code, Location_code, Keyfield, created_by } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("mode", sql.NVarChar, "I")
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("MemberShipType_Name", sql.NVarChar, MemberShipType_Name)
      .input("Status", sql.NVarChar, Status)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(` EXEC sp_MemberShipType_Hdr @mode, @MemberShipType_id, @MemberShipType_Name, @Status, @Company_code, @Location_code, '', '', @created_by, ''
      `);

    const generatedMemberShipTypeID = result.recordset[0].MemberShipType_id;

    res.status(200).json({
      success: true,
      message: "Membership Type inserted successfully",
      MemberShipType_id: generatedMemberShipTypeID
    });

  } catch (err) {
    console.error("Error during Membership Type insert:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

const MemberShipTypeHdrUpdate = async (req, res) => {
  const { MemberShipType_id, MemberShipType_Name, Status, Company_code, Location_code, Keyfield, modified_by } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("mode", sql.NVarChar, "U")
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("MemberShipType_Name", sql.NVarChar, MemberShipType_Name)
      .input("Status", sql.NVarChar, Status)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("created_by", sql.NVarChar, "")
      .input("modified_by", sql.NVarChar, modified_by)
      .query(` EXEC sp_MemberShipType_Hdr @mode, @MemberShipType_id, @MemberShipType_Name, @Status, @Company_code, @Location_code, @Keyfield, '', @created_by, @modified_by
      `);

    res.status(200).json({
      success: true,
      message: "Membership Type updated successfully"
    });

  } catch (err) {
    console.error("Error during Membership Type update:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

const MemberShipTypeHdrDelete = async (req, res) => {
  const { MemberShipType_id, Company_code, Location_code, Keyfield, modified_by } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("mode", sql.NVarChar, "D")
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("MemberShipType_Name", sql.NVarChar, "")
      .input("Status", sql.NVarChar, "")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("created_by", sql.NVarChar, "")
      .input("modified_by", sql.NVarChar, modified_by)
      .query(` EXEC sp_MemberShipType_Hdr @mode, @MemberShipType_id, @MemberShipType_Name, @Status, @Company_code, @Location_code, @Keyfield, '', @created_by, @modified_by
      `);

    res.status(200).json({
      success: true,
      message: "Membership Type deleted successfully"
    });

  } catch (err) {
    console.error("Error during Membership Type delete:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

const MemberShipTypeDetailsInsert = async (req, res) => {
  const { package_ID, Company_code, Location_code, MemberShipType_id, Keyfield_header, Keyfield, created_by, UpdateMode
  } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("mode", sql.NVarChar, "I")
      .input("Sno", sql.Int, 0)
      .input("package_ID", sql.NVarChar, package_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("Keyfield_header", sql.NVarChar, Keyfield_header)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("created_by", sql.NVarChar, created_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(` EXEC sp_MemberShipType_Details @mode, @Sno, @package_ID, @Company_code, @Location_code, @MemberShipType_id, @Keyfield_header, @Keyfield, @created_by, '', @UpdateMode
      `);

    res.status(200).json({
      success: true,
      message: "Membership Type Details inserted successfully"
    });

  } catch (err) {
    console.error("Error during Membership Type Details insert:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

const MemberShipTypeDetailsUpdate = async (req, res) => {
  const { Sno, package_ID, Company_code, Location_code, MemberShipType_id, Keyfield_header, Keyfield, modified_by
  } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("mode", sql.NVarChar, "U")
      .input("Sno", sql.Int, Sno)
      .input("package_ID", sql.NVarChar, package_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("Keyfield_header", sql.NVarChar, Keyfield_header)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("created_by", sql.NVarChar, "")
      .input("modified_by", sql.NVarChar, modified_by)
      .input("UpdateMode", sql.NVarChar, "")
      .query(` EXEC sp_MemberShipType_Details @mode, @Sno, @package_ID, @Company_code, @Location_code, @MemberShipType_id, @Keyfield_header, @Keyfield, @created_by, @modified_by, @UpdateMode
      `);

    res.status(200).json({
      success: true,
      message: "Membership Type Details updated successfully"
    });

  } catch (err) {
    console.error("Error during Membership Type Details update:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

const MemberShipTypeDetailsDelete = async (req, res) => {
  const { Sno, Company_code, Location_code, MemberShipType_id, Keyfield_header, Keyfield, modified_by, UpdateMode
  } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("mode", sql.NVarChar, "D")
      .input("Sno", sql.Int, Sno)
      .input("package_ID", sql.NVarChar, "")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("Keyfield_header", sql.NVarChar, Keyfield_header)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("created_by", sql.NVarChar, "")
      .input("modified_by", sql.NVarChar, modified_by)
      .input("UpdateMode", sql.NVarChar, UpdateMode)
      .query(` EXEC sp_MemberShipType_Details @mode, @Sno, @package_ID, @Company_code, @Location_code, @MemberShipType_id, @Keyfield_header, @Keyfield, @created_by, @modified_by, @UpdateMode
      `);

    res.status(200).json({
      success: true,
      message: "Membership Type Details deleted successfully"
    });

  } catch (err) {
    console.error("Error during Membership Type Details delete:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

const getMeberShipPackages = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "PIN")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_MemberShipType_Hdr @mode, '', '', '', @Company_code, @Location_code, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const membershipSearchData = async (req, res) => {
  const { MemberShipType_id, MemberShipType_Name, Status, package_ID, Company_code, Location_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("MemberShipType_id", sql.NVarChar, MemberShipType_id)
      .input("MemberShipType_Name", sql.NVarChar, MemberShipType_Name)
      .input("Status", sql.NVarChar, Status)
      .input("package_ID", sql.NVarChar, package_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_MemberShipType_Hdr @mode, @MemberShipType_id, @MemberShipType_Name, @Status, @Company_code, @Location_code, '', @package_ID, '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by Dinesh Gokul on 18-07-2026

//Code added by Dinesh Gokul on 20-07-2026
const getMeberShipTypeName = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MT")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_MemberShipType_Hdr @mode, '', '', '', @Company_code, @Location_code, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
//Code ended by Dinesh Gokul on 20-07-2026

//Code added by Dinesh Gokul on 22-07-2026
const getDietPlanNameId = async (req, res) => {
  const { Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "DP")
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Diet_Plans_hdr @mode, '', '', '', '', '', '', '', '', '', @Location_Code, @company_code, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const getMemberProgarmDetails = async (req, res) => {
  const { MemberID, Company_code, Location_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MPD")
      .input("MemberID", sql.NVarChar, MemberID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Location_code", sql.NVarChar, Location_code)
      .query(`EXEC sp_Member_Hdr_test2 @mode,@MemberID,'','','','','','','','','','','','','','',NULL,'','','','','',@Company_code,@Location_code,'',0,0,'','','','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
//Code ended by Dinesh Gokul on 22-07-2026

module.exports = {
  getCompanyno,
  getsearchdata,
  addData,
  saveEditedData,
  deleteData,
  CompanyUpdate,
  UpdateCompanyImage,
  getCompanyData,
  getAllCompanyMappingData,
  addCompanyMappingData,
  getcompanymappingsearchdata,
  getusercompany,
  updcompanymapping,
  commappingdeleteData,
  CompanyMappingUpdate,
  getCompanyMappingData,
  getLocationno,
  getlocationsearchdata,
  addlocationinfo,
  locationsaveEditedData,
  locationdeleteData,
  LocationUpdate,
  getLocationData,
  getroleid,
  getAllRoleInfoData,
  AddRoleInfoData,
  RolesaveEditedData,
  getRolesearchdata,
  roledeleteData,
  getUserRole,
  RoleUpdate,
  getRoleData,
  getAllUserRoleMappingData,
  addUserRoleMappingData,
  getUserrolesearchdata,
  RollMappingDelete,
  updateRoleMapping,
  RoleMappingUpdate,
  getRoleMappingData,
  getAlluserscreenmap,
  adduserscreenmap,
  saveEditeduserscreenmap,
  userscreenmapdeleteData,
  getuserscreensearchdata,
  getUserPermission,
  updateRoleRights,
  getRoleRightsData,

  AttributeUpdate,
  gethdrcode,

  getAllattributedetData,
  addattridetData,
  deleteAttriDetailData,
  updattridetData,
  getattributeSearchdata,
  getGSTReport,
  getDateFormat,
  getAttributeData,
  forgetPassword,
  Passwords,
  login,
  getUsercode,
  getAlluserData,
  userAddData,
  UsersaveEditedData,
  UserdeleteData,
  getUsersearchdata,
  UpdateUserImage,
  UserUpdate,
  Userdropdown,
  getUCN,
  getUserData,
  getCity,
  getState,
  getCountry,
  getStatus,
  getScreens,
  getPermissions,
  getLoginorout,
  getGender,
  addattrihdrData,
  getAllNumberseries,
  getNumberseries,
  getscreentype,
  getBillFormat,
  getboolean,
  getnumberseriessearchdata,
  addNumberseries,
  NumberSeriesUpdate,
  numberseriesdeleteData,
  memberAddData,
  memberUpdate,
  memberDeleteData,
  getMembershipType,
  getRelationship,
  getAllmemberData,
  GYM_TrainerInsert,
  GYM_TrainerUpdate,
  GYM_TrainerDelete,
  getTrainerSC,
  searchMemberData,
  getCategory,
  getDifficultyLevel,
  getTrainers,
  programInsertData,
  programUpdateData,
  programDeleteData,
  programFacultyInsertData,
  programFacultyUpdateData,
  programFacultyDeleteData,
  programExerciseInsertData,
  programExerciseUpdateData,
  programExerciseDeleteData,
  getMemberCardData,
  programSearchData,
  settingSaveData,
  getSettingScreenData,
  programCardData,
  getTrainerCardData,
  Diet_Plans_hdrInsert, 
  Diet_Plans_hdrUpdate, 
  Diet_Plans_hdrDelete,
  Diet_Plans_MealsInsert, 
  Diet_Plans_MealsUpdate, 
  Diet_Plans_MealsDelete,
  Diet_Plans_DetailsInsert, 
  Diet_Plans_DetailsUpdate, 
  Diet_Plans_DetailsDelete,
  getMealType,
  getEssentials,
  getDuration,
  dietPlanSearchData,
  couponInsertData,
  couponUpdateData,
  couponDeleteData,
  couponSearchData,
  getDisType,
  couponDashboard,
  getPackageTypes,
  getPrograms,
  PackageInsertData,
  PackageUpdateData,
  PackageDeleteData,
  PackageSelectData,
  PackageViewAllData,
  PackageSearchData,
  PackageDetailsInsertData,
  PackageDetailsUpdateData,
  PackageDetailsDeleteData,
  getAppPackages,
  Diet_Plans_DetailsSearch,
  Diet_Plans_MealsSearch,
  getDietPlanCardData,
  MemberShipTypeHdrInsert,
  MemberShipTypeHdrUpdate,
  MemberShipTypeHdrDelete,
  MemberShipTypeDetailsInsert,
  MemberShipTypeDetailsUpdate,
  MemberShipTypeDetailsDelete,
  getMeberShipPackages,
  membershipSearchData,
  getMeberShipTypeName,
  adminDashboardCardData,
  getDietPlanNameId,
  getMemberProgarmDetails

};