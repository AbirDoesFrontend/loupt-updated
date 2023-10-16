"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_routes_1 = require("./company.routes");
const investment_routes_1 = require("./investment.routes");
const user_routes_1 = require("./user.routes");
const misc_routes_1 = require("./misc.routes");
const webhook_routes_1 = require("./webhook.routes");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// health check route
router.get('/', (req, res) => {
    res.send('<h1>Hello World</h1> <hr> Express + TypeScript Server');
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // The directory where uploaded files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Creating a unique filename
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// user related routes
router.get('/user', user_routes_1.getLoggedInUserRoute);
router.get('/user/:userId', user_routes_1.getUserRoute);
router.get('/users/suggested', user_routes_1.getSuggestedUsersRoute);
router.get('/users/connected', user_routes_1.getUserConnectionsRoute);
router.put('/user', user_routes_1.updateUserRoute);
router.post('/follow', user_routes_1.followUserRoute);
// company related routes
router.get('/companies/all', company_routes_1.getAllCompaniesRoute);
router.get('/companies/connected', company_routes_1.getConnectedCompaniesRoute);
router.get('/company/:companyId', company_routes_1.getCompanyRoute);
router.put('/company/:companyId', company_routes_1.updateCompanyRoute);
router.post('/company', company_routes_1.createCompanyRoute);
router.delete('/company/:companyId', company_routes_1.deleteCompanyRoute);
// investment related routes
router.get('/fundinground/:roundId', investment_routes_1.getFundingRoundRoute);
router.put('/fundinground/:roundId', investment_routes_1.updateFundingRoundRoute);
router.post('/fundinground', investment_routes_1.createFundingRoundRoute);
router.post('/investment', investment_routes_1.addInvestmentRoute);
//NEW:
//router.post('/addkycdetails', addkycdetails)
router.post('/investmentwithkyc', investment_routes_1.addInvestmentRouteWithKYC);
router.get('/paymentmethods', investment_routes_1.getPaymentMethodsRoute);
router.post('/documents/:roundId', upload.single('document'), investment_routes_1.fileUploadRoute);
router.get('/search', misc_routes_1.handleSearchRoute);
router.post('/executeInvestment', investment_routes_1.executeInvestmentRoute);
//AWS:
router.get('/generate-presigned-url', misc_routes_1.generatePresignedUrlRoute);
// webhooks for transactAPI
//router.post("/usercreated", callbackTest)
router.post("/kycstatus", webhook_routes_1.updateKycStatus);
//TODO: add routes for uploading documents
exports.default = router;
