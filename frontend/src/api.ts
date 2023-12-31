import axios, { AxiosResponse, AxiosError } from 'axios';
import { useAsyncError } from 'react-router-dom';
import auth0config from './auth0config.json';
import { useAuth0, User as auth0UserType } from "@auth0/auth0-react";


export interface FundingRoundCreationRequest {
  companyId: string;
  displayName: string;
  fundingGoal: number;
  deadline: any;
  minimumInvestmentAmount: number;
  maximumInvestmentAmount: number;
  discountPercentage: number;
}


export interface InvestmentCreationRequest {
  roundId: string;
  amount: number;
  shareCount: number;
}


export interface InvestmentData {
  roundId: string;
  amount: number;
  shareCount: number;
  domicile: boolean;
  firstName: string;
  lastName: string;
  dob: string;
  primCountry: string;
  primAddress1: string;
  primCity: string;
  primState: string;
  primZip: string;
  ssn: string;
  phone: string;
}

export interface PaymentMethod {
  hasCard: boolean;
  stripeURL?: string;
  details?: {
    accountId: string;
    creditCardNumber: string;
    cardType: string;
    createdDate: string;
  }
}

export interface Company {
  shareCount: number;
  amount: number;
  companyId: string;
  name: string;
  logo: string;
  banner: string;
  bio: string;
  shortBio: string;
  partners: string[];
  industry: string[];
  website: string;
  valuation: number;
  minimumInvestment: number;
  sharePrice: number;
  sharesOutstanding: number;
  location: string;
  fundingRounds: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FundingRoundUpdateRequest {
  roundId: string;
  displayName?: string;
  fundingGoal?: number;
  deadline?: string;
}

export interface CompanyCreationRequest {
  name: string;
  logo: string;
  bio: string;
  partners: string[];
  industry: string[];
  website: string;
  valuation: number;
  minimumInvestment: number;
  sharePrice: number;
  sharesOutstanding: number;
  location: string;
}

export interface CompanyUpdateRequest {
  name?: string;
  logo?: string;
  bio?: string;
  partners?: string[];
  industry?: string[];
  website?: string;
  valuation?: number;
  minimumInvestment?: number;
  sharePrice?: number;
  sharesOutstanding?: number;
  location?: string;
}

export interface UserUpdateRequest {
  legalName?: string;
  bio?: string;
  email?: string;
  profilePic?: string;
  phoneNumber?: number;
  companies?: string[];
  connections?: string[];
  investments?: string[];
  banner?: string;
  education?: string;
  location?: string;
  occupation?: string;
  followers?: string[];
}

export interface User {
  following: string[];
  userId: string;
  legalName: string;
  bio: string;
  email: string;
  secret: string;
  profilePic: string;
  banner: string;
  location: string;
  occupation: string;
  education: string;
  countryCode: string;
  phoneNumber: number;
  fundsBalance: number;
  companies: string[];
  connections: string[];
  followers: string[];
  investments: string[];
  visibility: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SignupResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ConnectResponse {
  operation: string;
  success: boolean;
}

interface presignedUrlResponse {
  presignedUrl: string;
  url: string;
}

const API_BASE_URL = 'https://api.investloupt.com/';

//DONE
const apiRequest = async<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any

): Promise<T> => {
  try {
    //TODO: add stricter typing to response
    console.log("fetching " + endpoint + " ...")
    console.log("jwt:" + localStorage.getItem("jwt"))
    
    let auth0Sub = localStorage.getItem('auth0Sub');
    if(auth0Sub) {
      auth0Sub = decodeURIComponent(auth0Sub);
      console.log("sub: " + auth0Sub);
    } else {
      console.log("sub: item not found in localStorage");
    }


    const response: AxiosResponse<T> = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        'X-Auth0-Sub': `${auth0Sub}`
      }
    });
    return response.data;

  } catch (error) {
    const axiosError = error as AxiosError<T>;

    if (axiosError.response) {
      console.log("Axios Error: " + axiosError + method + endpoint + data)
      throw new Error(axiosError.message);
    } else {
      throw new Error('An error occurred during the API request.');
    }
  }
};


//DONE
export const signupUser = async (legalName: string, email: string, phoneNumber: number, password: string) => {
  const response = await apiRequest<SignupResponse>('POST', 'signup', {
    legalName: legalName,
    email: email,
    phoneNumber: phoneNumber,
    pass: password,
  });
  return response;
}

//DONE
export const loginUser = async (email: string, password: string) => {
  const response = await apiRequest<LoginResponse>('POST', 'login', {
    email: email,
    pass: password,
  });
  return response;
}

//DONE
//if no user_id is passed, it will use the user_id stored in local storage (the logged in user)
export const getUser = async (user_id?: string) => {
  const userId = user_id || localStorage.getItem('userId')
  var url = 'user'
  if (userId && userId.length > 2) {
    url += '/' + userId
  }
  try {
    const response = await apiRequest<User>('GET', url)
    return response
  } catch (e) {
    console.log('error in getUser')
    console.log(e)
  }
}

//DONE
export const getConnectedUsers = async () => {
  const response = await apiRequest<User[]>('GET', 'users/connected')
  return response
}

//DONE
export const getSuggestedUsers = async () => {
  const response = await apiRequest<User[]>('GET', 'users/suggested')
  return response
}

//DONE
export const updateUser = async (requestPayload: UserUpdateRequest) => {
  const response = await apiRequest<User>('PUT', `user`, requestPayload)
  return response
}

//DONE
export const addConnection = async (userId: any) => {
  const response = await apiRequest<ConnectResponse>('POST', `follow`, {
    userId: userId
  })
  return response
}

//DONE
export const getCompany = async (companyId: any) => {
  const response = await apiRequest<Company>('GET', `company/${companyId}`)
  return response
}

//DONE
export const getAllCompanies = async () => {
  const response = await apiRequest<Company[]>('GET', 'companies/all')
  return response
}

//DONE
export const getConnectedCompanies = async () => {
  const response = await apiRequest<Company[]>('GET', 'companies/connected')
  return response
}

//DONE
export const createCompany = async (requestPayload: CompanyCreationRequest): Promise<Company> => {
  const response = await apiRequest<Company>('POST', 'company', requestPayload);
  return response;
}

//DONE
export const updateCompany = async (companyId: string, requestPayload: CompanyUpdateRequest) => {
  const response = await apiRequest<Company>('PUT', `company/${companyId}`, requestPayload)
  return response
}

//DONE
export const createFundingRound = async (requestPayload: FundingRoundCreationRequest) => {
  const response = await apiRequest<Company>('POST', `fundinground`, requestPayload)
  return response
}

/*  CURRENTLY NOT FUNCTIONAL IN BACKEND
const getFundingRound = async(companyId: string, requestPayload: FundingRoundCreationRequest) => {
   */
const updateFundingRound = async (companyId: string, requestPayload: FundingRoundUpdateRequest) => {
  const response = await apiRequest<Company>('PUT', `fundinground/${companyId}`, requestPayload)
  return response
}

//incomplete, but functional
//expects companyId in both the URL an the body of the request.
//TODO: add typing
export const getFundingRound = async (companyId: string) => {
  const response = await apiRequest<{}>('GET', `fundinground/${companyId}`)
  return response
}

//non-functional
//TODO: add typing
const makeInvestment = async (requestPayload: InvestmentCreationRequest) => {
  const response = await apiRequest<{}>('POST', `investment`, requestPayload)
  return response
}

//TODO: add typing
export const submitInvestmentData = async (requestPayload: InvestmentData) => {
  const response = await apiRequest<any>('POST', `investmentwithkyc`, requestPayload);
  return response;
};


export const getPaymentMethod = async (/* requestPayload: PaymentMethod */): Promise<PaymentMethod> => {
  const response = await apiRequest<PaymentMethod>('GET', `paymentmethods`);
  return response;
}

//TODO: add typing
export const executeTrade = async (investmentId: string) => {
  const response = await apiRequest<{}>('POST', `executeTrade`, 
  {
    investmentId: investmentId
  }
  );
  return response;
}

function getFileTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    case 'webp':
      return 'image/webp';
    default:
      throw new Error('Unsupported file extension.');
  }
}

export const uploadImage = async (file: File | Blob, fileName: string, fileType?: string) : Promise<string | undefined> => {
  try{
    if (!fileType) {
      fileType = getFileTypeFromExtension(fileName);
    }
    
    const urlResponse = await apiRequest<presignedUrlResponse>('GET', `generate-presigned-url?filetype=${fileType}`);
    
    await axios.put(urlResponse.presignedUrl, file, {
      headers: {
        'Content-Type': fileType,
      },
    });
    
    return urlResponse.url;
  } catch (e) {
    console.error(e);
    return undefined
  }
}