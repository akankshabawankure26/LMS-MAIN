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

function OtpPage() {
  const [otp, setOtp] = useState("");
  const toast = useToast();

  // Handle verifying OTP
  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost/backend_lsm/verifyOtp.php", {
        otp,
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
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            size="md"
          />
          <Button
            colorScheme="green"
            onClick={verifyOtp}
            isDisabled={!otp.trim()}
          >
            Verify OTP
          </Button>
        </>

      </VStack>
    </Box>
  );
}

export default OtpPage;
