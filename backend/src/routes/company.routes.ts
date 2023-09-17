import { Request, Response } from 'express';
import { Company } from '../models/company.schema';
import { createCompany, getCompanyById, getConnectedCompanies, listCompanies, updateCompany, deleteCompany } from '../services/company.service';
import { getUserById, updateUser } from '../services/user.service';
import { authenticatedUserId, CreateCompanyRequest } from "../utils/routeUtils"

export async function getCompanyRoute(req: Request, res: Response): Promise<void|Response> {
    const {companyId} = req.params
    const company = await getCompanyById(companyId)
    if (!company) {
        return res.status(404).send("Company does not exist")
    }
    return res.status(200).send(company)
}

export async function getAllCompaniesRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        const companies = await listCompanies()
        return res.status(200).send(companies)
    } catch (e) {
        return res.status(500).send(`Error processing getAllCompanies request ${e}`)
    }
}

export async function getConnectedCompaniesRoute(req: Request, res: Response): Promise<void|Response> {
    // return connected companies for logged-in users
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const connectedCompanies = await getConnectedCompanies(userId)
    return res.status(200).send(connectedCompanies)
}

export async function updateCompanyRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const {companyId} = req.params
    const {name, logo, bio, partners, industry, website, valuation, minimumInvestment, sharePrice, sharesOutstanding, location, banner, shortBio} = req.body
    const existingUser = await getUserById(userId)
    if (!existingUser?.companies.includes(companyId)) {
        return res.status(401).send("User doesn't have permission to edit this company")
    }

    const existingCompany = await getCompanyById(companyId)
    const updatedCompany = new Company({
        companyId: existingCompany?.companyId,
        name: name || existingCompany?.name,
        bio: bio || existingCompany?.bio,
        logo: logo || existingCompany?.logo,
        partners: partners || existingCompany?.partners,
        industry: industry || existingCompany?.industry,
        website: website || existingCompany?.website,
        valuation: valuation || existingCompany?.valuation,
        minimumInvestment: minimumInvestment || existingCompany?.minimumInvestment,
        sharePrice: sharePrice || existingCompany?.sharePrice,
        sharesOutstanding: sharesOutstanding || existingCompany?.sharesOutstanding,
        location: location || existingCompany?.location,
        banner: banner || existingCompany?.banner,
        shortBio: shortBio || existingCompany?.shortBio
    })
    const success = await updateCompany(updatedCompany)
    if (!success) {
        return res.status(500).send("Error while updating company data")
    } else {
        return res.status(200).send(updatedCompany)
    }
}

export async function deleteCompanyRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const {companyId} = req.params

    const existing = await Company.findOne({companyId: companyId})
    if (!existing) {
        return res.status(404).send("Company does not exist")
    }
    const existingUser = await getUserById(userId)
    if (!existingUser?.companies.includes(companyId)) {
        return res.status(401).send("User doesn't have permission to delete this company")
    }
    const success = await deleteCompany(existing)
    if (!success) {
        return res.status(500).send("Error while deleting company")
    } else {
        const index = existingUser.companies.indexOf(companyId)
        if (index > -1) {
            existingUser.companies.splice(index, 1)
        }
        const success = updateUser(existingUser)
        return res.status(200).send("Company deleted successfully")
    }
}

export async function createCompanyRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const createCompanyRequest : CreateCompanyRequest = req.body as CreateCompanyRequest
    if (!createCompanyRequest) {
        return res.status(500).send("Invalid format for creating company")
    }
    const loggedInUserId = userId

    const existingUser = await getUserById(loggedInUserId)
    if(!existingUser) {
        return res.status(404).send("User does not exist")
    }
    if(existingUser.domicile == null || existingUser.dob.getFullYear() === 1900 || existingUser.primCountry == '' || existingUser.primAddress1 == '' || existingUser.primCity == '' || existingUser.primState == '' || existingUser.primZip == "none") {
        return res.status(422).send("User must complete full details before creating a company")
    }
    createCompany

    const company = await createCompany(createCompanyRequest, loggedInUserId)
    if (!company) {
        return res.status(500).send("Error while creating company")
    } else {
        return res.status(200).send(company)
    }
}