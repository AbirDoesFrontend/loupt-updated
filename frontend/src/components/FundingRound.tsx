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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "../containers/styles/CompanyStyles";
import { createFundingRound } from "../api";
import { Company, getCompany } from "../api";
import { useParams } from "react-router-dom";

function FundingRound() {
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
    companyId: "",
    displayName: "",
    fundingGoal: 0,
    deadline: "",
    minimumInvestmentAmount: 0,
    maximumInvestmentAmount: 0,
    discountPercentage: 0,
  });

  const dataAsArray = Object.values(formData);
  console.log(dataAsArray);
  for (const [key, value] of Object.entries(formData)) {
    console.log(`${key}: ${value}`);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    console.log(form);
    const companyId = form.companyId.value;
    const displayName = form.displayName.value;
    const fundingGoal = form.fundingGoal.value;
    const deadline = form.deadline.value;
    const minimumInvestmentAmount = form.minimumInvestmentAmount.value;
    const maximumInvestmentAmount = form.maximumInvestmentAmount.value;
    const discountPercentage = form.discountPercentage.value;

    const createdFundingRound = {
      companyId: companyId,
      displayName: displayName,
      fundingGoal: fundingGoal,
      deadline : deadline,
      minimumInvestmentAmount: minimumInvestmentAmount,
      maximumInvestmentAmount: maximumInvestmentAmount,
      discountPercentage: discountPercentage,
    };

    console.log(createdFundingRound);

    createFundingRound(createdFundingRound).then(response => {
      console.log('Funding round created' , response)
      if (response) {
        toast.success("Founding Round Has Been Created!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error('Something went wrong!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    })
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        sx={styles.button}
        backgroundColor={"gray.500"}
        disabled={!hasFundingRound}
      >
        START FUNDING ROUND
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {!hasFundingRound ? (
          <div>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Investment Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <FormControl mt={4}>
                    <FormLabel>Comapny ID</FormLabel>
                    <Input type="text" name="companyId" defaultValue={id} />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Comapny Name</FormLabel>
                    <Input
                      type="text"
                      name="displayName"
                      defaultValue={company.name}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Funding Goal</FormLabel>
                    <Input type="number" name="fundingGoal" />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Deadline</FormLabel>
                    <Input type="date" name="deadline" />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Minimum Investment</FormLabel>
                    <Input type="number" name="minimumInvestmentAmount" />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Maximum Investment</FormLabel>
                    <Input type="number" name="maximumInvestmentAmount" />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Discount Percentage</FormLabel>
                    <Input type="number" name="discountPercentage" />
                  </FormControl>

                  {/* <FormControl mt={4}>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      name="amount"
              
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Share Count</FormLabel>
                    <Input
                      name="shareCount"
                      
                    />
                  </FormControl> */}

                  {/* <FormControl mt={4}>
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
                  </FormControl> */}

                  {/* <FormControl mt={4}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </FormControl> */}

                  {/* <FormControl mt={4}>
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
                  </FormControl> */}

                  {/* <FormControl mt={4}>
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
                  </FormControl> */}

                  {/* <FormControl mt={4}>
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
                  </FormControl> */}

                  {/* <FormControl mt={4}>
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
                  </FormControl> */}
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} type="submit">
                      Submit
                    </Button>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
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
}

export default FundingRound;
