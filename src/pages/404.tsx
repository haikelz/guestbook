import FuzzyText from "@/components/react-bits/fuzzy-text";
import { Button, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <VStack justifyContent="center" alignItems="center" height="100vh">
      <VStack className="flex flex-col items-center">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
          fontSize="2rem"
        >
          404 Not Found
        </FuzzyText>
        <Button
          mt={4}
          onClick={() => router.back()}
          variant="subtle"
          fontWeight="bold"
        >
          Back to previous page
        </Button>
      </VStack>
    </VStack>
  );
}
