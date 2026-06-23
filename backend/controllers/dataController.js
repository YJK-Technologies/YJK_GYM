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
        .query(`EXEC sp_user_company_mapping 'D','','','','001','',0,@keyfiels,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
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
      try {
        await pool
          .request()
          .input("location_no", location_no)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(
            `EXEC sp_location_info 'D',@location_no, '', '', '', '', '', '', '', '', '', '','',  '', '',@modified_by, '', NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL`,
          );
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The location cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
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
  const {location_no } = req.body;

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
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC sp_attribute_Info 'TS','','', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
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
    .query(`EXEC sp_user_info_hdr_Pavun 'F','','user_code','','', '' ,'','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
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
      .query(`EXEC sp_user_info_hdr_Pavun @mode,'',@user_code,'','','','','','','',@email_id,'','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
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
      .query("EXEC sp_user_info_hdr_Pavun @mode,'',@user_code,'','','',@user_password,'','','',@email_id,'','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const login = async (req, res) => {
  const { user_code, user_password } = req.body;
  const secretKey = "yjk26012024";

  try {
    const decryptedUserCode = CryptoJS.AES.decrypt(
      user_code,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(
      user_password,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "LUC")
      .input("user_code", sql.NVarChar, decryptedUserCode)
      .input("user_password", sql.NVarChar, decryptedPassword)
      .query(`EXEC sp_user_info_hdr_Pavun 'LUC','',@user_code,'','','',@user_password,'','','','','','','','','','','','','','','','','','',''`);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAlluserData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql
    .query(`EXEC sp_user_info_hdr_Pavun 'A','','','','',' ','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

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
      .query(`EXEC sp_user_info_hdr_Pavun @mode,@company_code,@user_code,@user_name,@first_name,@last_name,@user_password,@user_status,@log_in_out,@user_type,
        @email_id,@dob,@gender,@role_id,@user_img,@super_admin,@created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4`);
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
        .query(`EXEC sp_user_info_hdr_Pavun @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,'',@super_admin,@created_by, @modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
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
        .query(`EXEC sp_user_info_hdr_Pavun 'D',@company_code,@user_code,'','','','', '', '', '','','', '','','','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    }

    res.status(200).json("user deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUsersearchdata = async (req, res) => {
  const { company_code,user_code,user_name,first_name,last_name,user_status,
    email_id,dob,gender,role_id,created_by } = req.body;

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
      .query(`EXEC sp_user_info_hdr_Pavun @mode,@company_code,@user_code,@user_name,@first_name,@last_name,'',@user_status,'','',@email_id,@dob,@gender,@role_id,
        '','',@created_by,'','','','','','','','',''`);

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
      .query(`EXEC sp_user_info_hdr_Pavun 'UI','',@user_code,'','','','','','','','','','','',@user_img,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

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
  const { company_code,user_code,user_name,first_name,last_name,user_password,
    user_status,log_in_out,user_type,email_id,dob,gender,role_id,super_admin,
    created_by,modified_by } = req.body;

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
      .query(`EXEC sp_user_info_hdr_Pavun @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,@user_images, @super_admin, @created_by, @modified_by, '', '', '', '', '', '', '', ''`);
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
      .query(`EXEC [sp_user_info_hdr_Pavun] @mode,'',@user_code,'','','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
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
      .query(`EXEC sp_user_info_hdr_Pavun 'UCN', @company_code, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL`);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUserData = async (req, res) => {
  const { company_code,user_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GUIH")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .query(`EXEC sp_user_info_hdr_Pavun @mode,@company_code,@user_code,'','','','','','','','','','','','','','','','','','','','','','',''`);

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
addattrihdrData




};