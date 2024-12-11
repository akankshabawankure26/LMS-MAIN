import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function OtpPage() {
  const [enterOtp, setEnterOtp] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  // Handle verifying OTP
  const verifyOtp = async () => {
    const otp = localStorage.getItem("otp");
    try {
      const response = await axios.post("http://localhost/backend_lms/verifyOtp.php", {
        enterOtp,
        otp    
      });
      
      console.log(response.data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "OTP verified successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate('/');

      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while verifying OTP.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="50px"
      p="6"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="lg" textAlign="center">
          OTP Verification
        </Heading>

        <>
          <Input
            placeholder="Enter OTP"
            value={enterOtp}
            onChange={(e) => setEnterOtp(e.target.value)}
            type="text"
            size="md"
          />
          <Button
            colorScheme="green"
            onClick={verifyOtp}
            isDisabled={!enterOtp.trim()}
          >
            Verify OTP
          </Button>
        </>

      </VStack>
    </Box>
  );
}

export default OtpPage;
