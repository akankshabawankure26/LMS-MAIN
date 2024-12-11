import React, { useState, useEffect } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  VStack,
  Center,
  InputGroup,
  InputRightElement,
  Checkbox,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccessDenied from "./AccessDenied";
import { setDailyAccessTimes } from "../Home";

const Admin = ({ onLogin }) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  //mac authentication
  const [macAdd, setMacAdd] = useState(""); // State to store the fetched MAC address

  const fetchMacAddress = async () => {
    try {
      const response = await fetch('http://localhost/backend_lms/macfetching.php');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      const { macAddress } = result;
      setMacAdd(macAddress);  // Update state
      return macAddress;      // Return fetched MAC
    } catch (error) {
      console.error('Error fetching MAC address:', error);
      return null; // Return null on failure
    }
  };


  const checkMac = async (macAdd) => {
    try {
      const response = await fetch('http://localhost/backend_lms/macauthenticate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macAddress: macAdd }),
      });

      const result = await response.json(); // Parse response once
      console.log(result);

      if (result.status === 'success') {
        localStorage.setItem("MacAuthenticate", "true");
      } else {
        localStorage.setItem("MacAuthenticate", "false");
        throw new Error("MAC Address not valid");
      }
    } catch (error) {
      console.error("Error during MAC authentication:", error);
      toast({
        title: "Error",
        description: "An error occurred during MAC authentication.",
        status: "error",
        position: "top-right",
      });
      localStorage.setItem("MacAuthenticate", "false");
    }
  };

  useEffect(() => {
    const fetchAndCheckMac = async () => {
      const fetchedMac = await fetchMacAddress(); // Fetch MAC address
      if (fetchedMac) {
        checkMac(fetchedMac); // Check MAC address
      }
    };

    fetchAndCheckMac();
  }, []); // Empty dependency array to prevent infinite re-renders

  const handleClick = () => setShow(!show);

  const getUserRole = async () => {
    const url = "http://localhost/backend_lms/getUserRight.php";
    let fData = new FormData();
    fData.append("email", email);
    fData.append("password", password);

    try {
      const response = await axios.post(url, fData);
      const userRight = response.data["userRight"];
      localStorage.setItem("userRight", userRight);
    } catch (e) {
      console.log(e);
    }
  };

  const sendOtp = async () => {
    const otpEmail = localStorage.getItem("otpEmail");  // Retrieve the otpEmail from localStorage
    
    if (!otpEmail) {
        toast({
            title: "Error",
            description: "No email found. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        return;  // Stop execution if otpEmail is not available
    }

    try {
        // Send otpEmail in the request body using POST
        const response = await axios.post("http://localhost/backend_lms/sendOtp.php", {
            otpEmail: otpEmail  // Sending otpEmail in the request body
        });

        console.log("Response from backend:", response.data);

        if (response.data.success) {
            toast({
                title: "OTP Sent",
                description: "Check your email for the OTP.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            const otp = response.data.otp;
            localStorage.setItem("otp",otp);
        } else {
            toast({
                title: "Error",
                description: response.data.message || "Failed to send OTP. Try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    } catch (error) {
        console.error("Error calling backend:", error);
        toast({
            title: "Error",
            description: "An error occurred while sending OTP.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};


  const handleLogin = async () => {

    let fData = new FormData();
    fData.append("email", email);
    fData.append("password", password);

    try {
      const response = await axios.post("http://localhost/backend_lms/getOtpEmail.php", fData);
      console.log(response)
      console.log(response.data);
      const otpEmail = response.data['otp'];
      localStorage.setItem("otpEmail", otpEmail);
      // if (response.data === true) {
      //   console.log("getting otp");
      // }
    }
    catch (err) {
      console.log("Error");
    }

    sendOtp();

    const url = "http://localhost/backend_lms/loginhandler.php";
    try {
      const response = await axios.post(url, fData);
      if (response.data === true) {
        localStorage.setItem("email", email);
        localStorage.setItem("adminData", JSON.stringify({ email, password }));

        onLogin();
        navigate('/otppage');
        // toast({
        //   title: "Login Successful",
        //   description: "Welcome back!",
        //   status: "success",
        //   duration: 5000,
        //   isClosable: true,
        // });
        setDailyAccessTimes();
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your email and password and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Please check your connection and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleKeyPressFromEmail = (event) => {
    if (event.key === "Enter") {
      document.getElementById("password").focus();
    }
  };

  const handleKeyPressFromPass = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };



  const isMacAuthenticated = localStorage.getItem("MacAuthenticate") === "true";

  return (
    <>
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        {isMacAuthenticated ? (
          <Center>
            <Stack spacing={4}>
              <Heading fontSize="2xl" textAlign="center">
                Welcome to Layout Management System
                <br />
                Admin Login
              </Heading>

              <VStack
                as="form"
                boxSize={{ base: "xs", sm: "sm", md: "md" }}
                h="max-content !important"
                rounded="lg"
                boxShadow="lg"
                p={{ base: 5, sm: 10 }}
                spacing={8}
              >
                <VStack spacing={4} w="100%">
                  <FormControl id="email">
                    <FormLabel>Enter Your ID</FormLabel>
                    <Input
                      rounded="md"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyPressFromEmail}
                    />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        rounded="md"
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPressFromPass}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" rounded="md" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </VStack>
                <VStack w="100%">
                  <Stack direction="row" justifyContent="space-between" w="100%">
                    <Checkbox colorScheme="green" size="md">
                      Remember me
                    </Checkbox>
                    <Link fontSize={{ base: "md", sm: "md" }}>Forgot password?</Link>
                  </Stack>
                  <Button
                    bg="blue.300"
                    color="white"
                    _hover={{ bg: "blue.500" }}
                    rounded="md"
                    w="100%"
                    onClick={() => {
                      handleLogin();
                      getUserRole();
                    }}
                  >
                    Log in
                  </Button>
                </VStack>
              </VStack>
            </Stack>
          </Center>
        ) : (
          <Center>
            {/* <Heading fontSize="2xl" textAlign="center"> */}
            <AccessDenied />
            {/* </Heading> */}
          </Center>
        )
        }
      </Container>
    </>

  );
};

export default Admin;






