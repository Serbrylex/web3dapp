import { useWeb3React } from "@web3-react/core";
import { 
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import PunkCard from "../components/PunkCard";
import Loading from "../components/Loading";
import RequestAccess from "../components/RequestAccess";
import { usePlatziPunksData } from "../hooks/usePlatziPunksData";
import Link from 'next/link';

import { useState } from 'react';

const Punks = () => {
  const { active, library } = useWeb3React();

  const [submitted, setSubmitted] = useState(true);
  const [address, setAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState(true);

  const { punks, loading, update } = usePlatziPunksData({
    owner: submitted && validAddress ? address : ''
  });

  const submit = (e: any) => {
    e.preventDefault();    
    if (address) {
      const isValid = library.utils.isAddress(address)
      setValidAddress(isValid)
      setSubmitted(true)      
    } else {
      setAddress('')
      setSubmitted(false)
    }
  }

  if (!active) return <RequestAccess />;

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"              
            >
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              isInvalid={false}
              value={address ?? ""}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Dirección inválida</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId } : { name: string, image: string, tokenId: string }) => (
            <Link key={tokenId} href={`/punk/${tokenId}`}>
              <a>
                <PunkCard key={tokenId} image={image} name={name}/>
              </a>
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Punks;