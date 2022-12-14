import { Link as DefaultLink, useColorModeValue } from "@chakra-ui/react";
import Link from 'next/link'

const NavLink = ({ children, href }:{ children: string, href: string }) => (
  <DefaultLink
    px={2}
    py={1}
    as={Link}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={href}
  >
    {children}
  </DefaultLink>
);

export default NavLink;