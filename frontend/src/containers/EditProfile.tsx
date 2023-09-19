import { useEffect, useState } from "react";
import { getUser, User, updateUser } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Input,
  FormLabel,
  Text,
  VStack,
  Select,
  Center,
  Heading,
  Textarea,
  Button,
  FormControl,
} from "@chakra-ui/react";
import styles from "./styles/EditProfileStyle";
import Logo from "../assets/Loupt app logo 4.png";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [user, setUser] = useState({} as User);
  const navigate = useNavigate();

  useEffect(() => {
    getUser()
      .then((response) => {
        if (response) {
          console.log("User:");
          console.log(response);
          setUser(response);
        } else {
          // handle the scenario when user is not returned
          console.error("No user returned");
          //setUser({} as User); this is default value anyways
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        //setUser({}); this is default value anyways
      });
  }, []);

  const handleUpdateUser = (event: any) => {
    event.preventDefault();
    //   legalName?: string;
    // bio?: string;
    // email?: string;
    // profilePic?: string;
    // phoneNumber?: number;
    // companies?: string[];
    // connections?: string[];
    // investments?: string[];
    // banner?: string;
    // education?: string;
    // location?: string;
    // occupation?: string;
    // followers?: string[];

    const form = event.target;
    const legalName = form.name.value;
    const phoneNumber = form.phoneNumber.value;
    const bio = form.bio.value;
    const occupation = form.occupation.value;
    const education = form.education.value;
    const location = form.location.value;

    updateUser({
      legalName: legalName,
      phoneNumber: phoneNumber,
      bio: bio,
      occupation: occupation,
      education: education,
      location: location,
    }).then((response) => {
      console.log("User has been updated:");
      // console.log(response);
      setUser(response);
      toast.success("User has been updated!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // setTimeout(() => {
      //   navigate("/profile");
      // }, 3000);
    });
  };
  return (
    <>
      <Box margin={"20px"}>
        <Box sx={styles.container} shadow={"md"}>
          <Center mt={2}>
            <VStack>
              <Heading>Edit User Profile</Heading>
              <Text color={"gray"} mb={"40px"}>
                Don't forget to hit update!
              </Text>
            </VStack>
          </Center>
          <form onSubmit={handleUpdateUser}>
            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Legal Name</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Enter Your Name"
                name="name"
                defaultValue={user.legalName}
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Phone Number</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Enter your phone number"
                name="phoneNumber"
                defaultValue={user.phoneNumber}
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Bio</FormLabel>
              <Textarea
                sx={styles.input}
                placeholder="Tell something about yourself"
                name="bio"
                defaultValue={user.bio}
              />
            </Box>

            {/* <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Company Bio</FormLabel>
              <Textarea
                sx={styles.input}
                placeholder="Tell something about your company"
                name="companyBio"
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Gender</FormLabel>
              <Select sx={styles.input}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </Box> */}

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Working At</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Your workplace"
                name="occupation"
                defaultValue={user.occupation}
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Location</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Where do you live?"
                name="location"
                defaultValue={user.location}
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Studied At</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Your alma mater"
                name="education"
                defaultValue={user.education}
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>$ Fund Balance</FormLabel>
              <Input
                type="number"
                sx={styles.input}
                placeholder="$"
                name="fund"
                defaultValue={user.fundsBalance}
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Change Profile Pic</FormLabel>
              <Input type="file" sx={styles.input} />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Change Banner</FormLabel>
              <Input type="file" sx={styles.input} />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Date of Birth</FormLabel>
              <Input type="date" sx={styles.input} />
            </Box>
            <Button bg={"brand.100"} color="white" type="submit">
              Update Profile
            </Button>
          </form>
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </>
  );
};
export default EditProfilePage;
