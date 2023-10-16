import { Request, Response } from 'express';
import { User } from '../models/user.schema';
import { addFollower, getConnectedUsers, getSuggestedUsers, getUserById, updateUser } from '../services/user.service';
import { authenticatedUserId } from '../utils/routeUtils';
import { deleteS3ItemByKey } from '../services/aws.service';

export async function getLoggedInUserRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const user = await getUserById(userId)
    if (!user) {
        return res.status(404).send("User does not exist")
    }
    return res.status(200).send(user)
}

export async function getUserRoute(req: Request, res: Response): Promise<void|Response> {
    const {userId} = req.params
    const user = await getUserById(encodeURIComponent(userId))
    if (!user) {
        return res.status(404).send("User does not exist")
    }
    return res.status(200).send(user)
}

export async function getUserConnectionsRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const connectedUsers = await getConnectedUsers(userId)
    return res.status(200).send(connectedUsers)
}

export async function getSuggestedUsersRoute(req: Request, res: Response): Promise<void|Response> {
    const excludedUserIds: string[] = []
    const userId = await authenticatedUserId(req)
    try {
        if (userId && userId.length > 1) {
            excludedUserIds.push(userId)
            const users = await getConnectedUsers(userId)
            users.forEach(user => {
                excludedUserIds.push(user.userId)
            })
        }
        const suggestedUsers = await getSuggestedUsers(10, excludedUserIds)
        return res.status(200).send(suggestedUsers)
    } catch (e) {
        return res.status(500).send(`Unable to process getSuggestedUsers request. ${e}`)
    }
}

export async function updateUserRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const {legalName, bio, email, profilePic, phoneNumber, companies, connections, investments, banner, education, location, occupation, followers, domicile, dob, primCountry, primAddress1, primCity, primState, primZip} = req.body
    const existingUser = await getUserById(userId)
    
    const updatedUser = new User({
        userId: existingUser?.userId,
        legalName: legalName || existingUser?.legalName,
        bio: bio || existingUser?.bio,
        email: email || existingUser?.email,
        profilePic: profilePic || existingUser?.profilePic,
        phoneNumber: phoneNumber || existingUser?.phoneNumber,
        companies: companies || existingUser?.companies,
        connections: connections || existingUser?.connections,
        investments: investments || existingUser?.investments,
        banner: banner || existingUser?.banner,
        education: education || existingUser?.education,
        location: location || existingUser?.location,
        occupation: occupation || existingUser?.occupation,
        followers: followers || existingUser?.followers,
        //new params for listing user as party
        domicile: domicile || existingUser?.domicile,
        dob: new Date(dob) || existingUser?.dob,
        primCountry: primCountry || existingUser?.primCountry,
        primAddress1: primAddress1 || existingUser?.primAddress1,
        primCity: primCity || existingUser?.primCity,
        primState: primState || existingUser?.primState,
        primZip: primZip || existingUser?.primZip
        
    })
    if(banner != undefined && existingUser?.banner) {
        deleteS3ItemByKey(existingUser.banner)
        //delete old images when updated
    }
    if(profilePic != undefined && existingUser?.profilePic) {
        deleteS3ItemByKey(existingUser.profilePic)
        //delete old images when updated
    }

    const success = await updateUser(updatedUser)
    if (!success) {
        return res.status(500).send("Error while updating user data")
    } else {
        return res.status(200).send(updatedUser)
    }
}

export async function followUserRoute(req: Request, res: Response): Promise<void|Response> {
    const loggedInUserId = await authenticatedUserId(req)
    if (!loggedInUserId) {
        return res.status(401).send("Unauthorized request")
    }
    if (!req.body.userId) {
        return res.status(404).send("UserId required to follow")
    }
    const userId1 = loggedInUserId
    const userId2 = req.body.userId
    if (userId1 == userId2) {
        return res.status(400).send("Users cannot follow themselves")
    }
    try {
        const success = await addFollower(userId1, userId2)
        return res.status(200).send({operation: "add connection", success: success})
    } catch (e) {
        return res.status(500).send(`Error following user. ${e}`)
    }
}