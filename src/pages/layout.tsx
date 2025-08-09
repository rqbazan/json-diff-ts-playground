import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router";
import { AnimatedBox } from "../ui/components/animated-box";
import { ColorModeButton } from "../ui/components/color-mode";

function NavLinkText({ isActive, children }: { isActive: boolean; children: React.ReactNode }) {
  return (
    <Flex direction="column">
      <Text as="span" fontWeight={isActive ? "bold" : "normal"}>
        {children}
      </Text>
      {isActive && <AnimatedBox layoutId="nav-indicator" bg="black" height="2px" w="full" _dark={{ bg: "white" }} />}
    </Flex>
  );
}

export function Layout() {
  return (
    <Flex direction="column" height="dvh">
      <Flex p={4} bg="green.400" alignItems="center" _dark={{ bg: "blue.700" }}>
        <Heading>
          JSON Diff TS
          <Box as="sup" ml={2} fontStyle="italic">
            Playground
          </Box>
        </Heading>

        <Flex as="nav" ml="auto" gap={4} alignItems="center">
          <NavLink to="/">{({ isActive }) => <NavLinkText isActive={isActive}>Diff</NavLinkText>}</NavLink>
          <NavLink to="/sync">{({ isActive }) => <NavLinkText isActive={isActive}>Sync</NavLinkText>}</NavLink>

          <ColorModeButton />
        </Flex>
      </Flex>

      <Outlet />
    </Flex>
  );
}
