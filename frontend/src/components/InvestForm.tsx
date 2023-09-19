import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import styles from "../containers/styles/CompanyStyles";
import { submitInvestmentData } from "../api";
import { Company, getCompany } from "../api";
import { useParams } from "react-router-dom";
function InvestForm() {
  const [company, setCompany] = useState({} as Company);
  const [hasFundingRound, setHasFundingRound] = useState(false);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    getCompany(id).then((response) => {
      console.log("Single Company : ", response.fundingRounds.length);
      setCompany(response);
      if (response.fundingRounds.length > 0) {
        setHasFundingRound(true);
        const fundingRoundID = response.fundingRounds[0];
        console.log("RoundID: ", fundingRoundID);
      } else {
        console.log("No funding rounds");
      }
    });
  }, [id]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    roundId: "",
    amount: 0,
    shareCount: 0,
    domicile: false,
    firstName: "",
    lastName: "",
    dob: "",
    primCountry: "",
    primAddress1: "",
    primCity: "",
    primState: "",
    primZip: "",
    ssn: "",
    phone: "",
  });

  const dataAsArray = Object.values(formData);
  console.log(dataAsArray);
  for (const [key, value] of Object.entries(formData)) {
    console.log(`${key}: ${value}`);
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await submitInvestmentData(formData);
      console.log(formData);
      if (response === 200) {
        console.log("Data submitted successfully:", response);
      } else {
        console.error("Error in submission:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Logging data as a list
    console.log("Data as List:");
    for (const [key, value] of Object.entries(formData)) {
      console.log(`${key}: ${value}`);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        sx={styles.button}
        disabled={!hasFundingRound}
      >
        INVEST NOW
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {hasFundingRound ? (
          <div>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Investment Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <FormControl mt={4}>
                    <FormLabel>Round ID</FormLabel>
                    <Input
                      name="roundId"
                      value={formData.roundId}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Share Count</FormLabel>
                    <Input
                      name="shareCount"
                      value={formData.shareCount}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Domicile (from USA)</FormLabel>
                    <input
                      type="checkbox"
                      name="domicile"
                      checked={formData.domicile}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          domicile: e.target.checked,
                        }))
                      }
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Primary Country</FormLabel>
                    <Input
                      name="primCountry"
                      value={formData.primCountry}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Primary Address</FormLabel>
                    <Input
                      name="primAddress1"
                      value={formData.primAddress1}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Primary City</FormLabel>
                    <Input
                      name="primCity"
                      value={formData.primCity}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Primary State</FormLabel>
                    <Input
                      name="primState"
                      value={formData.primState}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Primary Zip</FormLabel>
                    <Input
                      name="primZip"
                      value={formData.primZip}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>SSN</FormLabel>
                    <Input
                      name="ssn"
                      value={formData.ssn}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </FormControl>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                  Submit
                </Button>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </div>
        ) : (
          <div>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Investment Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  Sorry, this company does not have any active funding rounds.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </div>
        )}
      </Modal>
    </>
  );
}

export default InvestForm;
