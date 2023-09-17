import express, { Request, Response } from 'express';
import { createCompanyRoute, getCompanyRoute, getAllCompaniesRoute, getConnectedCompaniesRoute, updateCompanyRoute, deleteCompanyRoute } from './company.routes';
import { addInvestmentRoute, addInvestmentRouteWithKYC, createFundingRoundRoute, getFundingRoundRoute, updateFundingRoundRoute, fileUploadRoute, getPaymentMethodsRoute } from './investment.routes';
import { followUserRoute, getSuggestedUsersRoute, getUserConnectionsRoute, getUserRoute, getLoggedInUserRoute, updateUserRoute, /* addkycdetails */ } from './user.routes';
import { callbackTest } from './webhook.routes';

import multer from 'multer';
const router = express.Router();

// health check route
router.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello World</h1> <hr> Express + TypeScript Server');
});

const storage = multer.memoryStorage(); // Store the file in memory.
const upload = multer({ storage: storage });


// user related routes
router.get('/user', getLoggedInUserRoute)
router.get('/user/:userId', getUserRoute)
router.get('/users/suggested', getSuggestedUsersRoute)
router.get('/users/connected', getUserConnectionsRoute)
router.put('/user', updateUserRoute)
router.post('/follow', followUserRoute)

// company related routes
router.get('/companies/all', getAllCompaniesRoute)
router.get('/companies/connected', getConnectedCompaniesRoute)
router.get('/company/:companyId', getCompanyRoute)
router.put('/company/:companyId', updateCompanyRoute)
router.post('/company', createCompanyRoute)
router.delete('/company/:companyId', deleteCompanyRoute)

// investment related routes
router.get('/fundinground/:roundId', getFundingRoundRoute)
router.put('/fundinground/:roundId', updateFundingRoundRoute)
router.post('/fundinground', createFundingRoundRoute)
router.post('/investment', addInvestmentRoute)
//NEW:
//router.post('/addkycdetails', addkycdetails)
router.post('/investmentwithkyc', addInvestmentRouteWithKYC)
router.get('/paymentmethods', getPaymentMethodsRoute)
router.post('/documents/:roundId', upload.single('document'), fileUploadRoute) //TODO: add routes for uploading documents to a funding round


// webhooks for transactAPI
router.post("/usercreated", callbackTest)
router.post("/kycstatuschanged", callbackTest)
//TODO: add routes for uploading documents
export default router;