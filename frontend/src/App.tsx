import LoginPage from "./containers/LoginPage";
import HomePage from "./containers/HomePage";
import ProfilePage from "./containers/ProfilePage";
import InvestPage from "./containers/InvestPage";
import AboutUsPage from "./containers/AboutUsPage";
import EditProfilePage from "./containers/EditProfile";
import EditCompanyPage from "./containers/EditCompany";
import { Route, Routes } from "react-router-dom";
import Route404 from "./containers/Route404";
import SignUpModal from "./containers/SignUpModal";
import SignupPage from "./containers/SignupPage";
import CompanyDetailPage from "./containers/CompanyDetailPage";
import RaiseCapital from "./containers/RaiseCapital";
import UserConnectedCompany from "./containers/UserConnectedCompany";
import ResultsPage from "./components/Results";
import Checkout from "./containers/Checkout";
import UserProfile from "./containers/UserProfile";
import Investments from "./containers/Investments";

function App() {
  return (
    <Routes>
      <Route path="/my-investments" element={<Investments />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/user-profile/:id" element={<UserProfile />} />
      <Route path="/invest" element={<InvestPage />} />
      <Route path="/raise-capital" element={<RaiseCapital />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/connected-companies" element={<UserConnectedCompany />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/edit-company/:id" element={<EditCompanyPage />} />
      <Route path="/company/:id" element={<CompanyDetailPage />} />
      <Route path="/signup-modal" element={<SignUpModal />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Route404 />} />
    </Routes>
  );
}

export default App;
