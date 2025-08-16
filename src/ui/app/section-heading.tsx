import { Box, Flex, Heading, Separator, Text } from "@chakra-ui/react";

export function SectionHeading({ title, description }: { title: React.ReactNode; description?: React.ReactNode }) {
  return (
    <Flex direction="column" justifyContent="center">
      <Box p={3}>
        <Heading size="md">{title}</Heading>
        {description && (
          <Text color="gray.500" fontSize="sm" truncate _dark={{ color: "gray.400" }}>
            {description}
          </Text>
        )}
      </Box>
      <Separator />
    </Flex>
  );
}
