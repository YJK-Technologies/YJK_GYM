// routes/dataRoutes.js
const express = require("express");
const dataController = require("../controllers/dataController");
const router = express.Router();
const path = require("path"); 
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  });


  const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload2 = multer({ storage });


router.get("/Companyno",dataController.getCompanyno)
router.post("/companysearchcriteria",dataController.getsearchdata)
router.post("/add", upload.fields([
  { name: 'company_logo', maxCount: 1 },
  { name: 'authorisedSignatur', maxCount: 1 }
]),dataController.addData)
router.post("/saveEditedData", dataController.saveEditedData);
router.post("/delete", dataController.deleteData);
router.post("/CompanyUpdate",upload.fields([
  { name: 'company_logo', maxCount: 1 },
  { name: 'authorisedSignatur', maxCount: 1 }
]),dataController.CompanyUpdate)
router.post("/UpdateCompanyImage",upload.single('company_logo'),dataController.UpdateCompanyImage)
router.post("/getCompanyData",dataController.getCompanyData)
router.get("/CompanyMappingData",dataController.getAllCompanyMappingData)
router.post("/addCompanyMappingData",dataController.addCompanyMappingData)
router.post("/companymappingsearchdata",dataController.getcompanymappingsearchdata)
router.post("/getusercompany",dataController.getusercompany)
router.post("/updcompanymapping",dataController.updcompanymapping)
router.post("/commappingdeleteData",dataController.commappingdeleteData)
router.post("/CompanyMappingUpdate", dataController.CompanyMappingUpdate)
router.post("/getCompanyMappingData",dataController.getCompanyMappingData)
router.get("/locationno",dataController.getLocationno)
router.post("/locationSearchdata",dataController.getlocationsearchdata)
router.post("/addlocationinfo",dataController.addlocationinfo)
router.post("/deletelocation",dataController.locationdeleteData)
router.post("/LocationUpdate", dataController.LocationUpdate)
router.post("/getLocationData",dataController.getLocationData)
router.post("/roleid", dataController.getroleid)
router.get("/RoleInfoData", dataController.getAllRoleInfoData)
router.post("/addRoleInfoData", dataController.AddRoleInfoData)
router.post("/Roleupdate", dataController.RolesaveEditedData)
router.post("/Rolesearchdata",dataController.getRolesearchdata)
router.post("/roledelete",dataController.roledeleteData)
router.post("/UserRole",dataController.getUserRole)
router.post("/RoleUpdates", dataController.RoleUpdate)
router.post("/getRoleData",dataController.getRoleData)
router.get("/UserRoleMappingData",dataController.getAllUserRoleMappingData)
router.post("/addUserRoleMappingData",dataController.addUserRoleMappingData)
router.post("/userrolsearchdata",dataController.getUserrolesearchdata)
router.post("/RollMappingDelete",dataController.RollMappingDelete)
router.post("/updateRoleMapping",dataController.updateRoleMapping)
router.post("/RoleMappingUpdate", dataController.RoleMappingUpdate)
router.post("/getRoleMappingData",dataController.getRoleMappingData)
router.get("/userscreenmap", dataController.getAlluserscreenmap)
router.post("/adduserscreenmap",dataController.adduserscreenmap)
router.post("/saveEditeduserscreenmap",dataController.saveEditeduserscreenmap)
router.post("/userscreenmapdeleteData",dataController.userscreenmapdeleteData)
router.post("/userscreensearchdata",dataController.getuserscreensearchdata)
router.post("/getUserPermission",dataController.getUserPermission)
router.post("/updateRoleRights",dataController.updateRoleRights)
router.post("/getRoleRightsData",dataController.getRoleRightsData)

router.post("/AttributeUpdate", dataController.AttributeUpdate)
router.post("/hdrcode", dataController.gethdrcode)

router.get("/attributedetData",dataController.getAllattributedetData)
router.post("/addattridetData",dataController.addattridetData)
router.post("/delattridetData",dataController.deleteAttriDetailData)
router.post("/updattridetData",dataController.updattridetData)
router.post("/attributeSearchdata",dataController.getattributeSearchdata)
router.post("/getGSTReport",dataController.getGSTReport)
router.post("/getDateFormat",dataController.getDateFormat)
router.post("/getAttributeData",dataController.getAttributeData)
router.post("/forgetPassword", dataController.forgetPassword)
router.post("/Passwords",dataController.Passwords)
router.post("/login", dataController.login)
router.get("/usercode",dataController.getUsercode)
router.get ("/userData", dataController.getAlluserData)
router.post("/useradd",upload.single('user_img'),dataController.userAddData)
router.post("/userupdate", dataController.UsersaveEditedData)
router.post("/userdelete", dataController.UserdeleteData)
router.post("/usersearchcriteria",dataController.getUsersearchdata)
router.post("/UpdateUserImage",upload.single('user_img'),dataController.UpdateUserImage)
router.post("/UserUpdates", upload.single('user_images'), dataController.UserUpdate)
router.post("/Userdropdown",dataController.Userdropdown)
router.post("/getUCN",dataController.getUCN)
router.post("/getUserData",dataController.getUserData)
router.post("/city", dataController.getCity)
router.post("/state", dataController.getState)
router.post("/country", dataController.getCountry)    
router.post("/status", dataController.getStatus)
router.post("/Screens",dataController.getScreens)
router.post("/Permissions",dataController.getPermissions)
router.post("/Loginorout", dataController.getLoginorout)
router.post("/gender", dataController.getGender)
router.post("/addattriData",dataController.addattrihdrData)
router.get("/Numberseries",dataController.getAllNumberseries)
router.get("/getAllNumberseries",dataController.getAllNumberseries)
router.post("/screentype",dataController.getscreentype)
router.post("/getBillFormat",dataController.getBillFormat)
router.post("/getboolean", dataController.getboolean)
router.post("/numberseriessearchdata",dataController.getnumberseriessearchdata)
router.post("/addNumberseries",dataController.addNumberseries)
router.post("/NumberSeriesUpdate",dataController.NumberSeriesUpdate)
router.post("/NumberSeriesdeleteData",dataController.numberseriesdeleteData)




module.exports = router;