import { useEffect, useState } from "react";
import { getUser, User , updateUser } from "../api";
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
  FormControl
} from "@chakra-ui/react";
import styles from "./styles/EditProfileStyle";
import Logo from "../assets/Loupt app logo 4.png";

const EditProfilePage = () => {
  const [user, setUser] = useState({} as User);

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
  
    const handleUpdateUser = (event : any) => {
      event.preventDefault();
  
      const form = event.target;
      const phoneNumber = form.phoneNumber.value;
      const bio = form.bio.value;
      const occupation = form.occupation.value;
      localStorage.setItem('occupation' , occupation)
      const education = form.education.value;
      localStorage.setItem('education' , education)
      const location = form.location.value;
      localStorage.setItem('location' , location)

      console.log(localStorage.getItem('occupation'))

      updateUser({
        phoneNumber: phoneNumber,
        bio: bio,
        occupation: occupation,
        education: education,
        location: location
      }).then((response) => {
        console.log("User has been updated:");
        console.log(response);
      });
    }
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
              <FormLabel sx={styles.label}>Phone</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Enter your phone number"
                name="phoneNumber"
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Bio</FormLabel>
              <Textarea
                sx={styles.input}
                placeholder="Tell something about yourself"
                name="bio"
              />
            </Box>

            <Box sx={styles.formGroup}>
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
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Working At</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Your workplace"
                name="occupation"
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Location</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Where do you live?"
                name="location"
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Studied At</FormLabel>
              <Input
                type="text"
                sx={styles.input}
                placeholder="Your alma mater"
                name="education"
              />
            </Box>

            <Box sx={styles.formGroup}>
              <FormLabel sx={styles.label}>Change Image</FormLabel>
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
    </>
  );
};
export default EditProfilePage;
