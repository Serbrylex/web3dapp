import { useRouter } from 'next/router'
import { useWeb3React } from "@web3-react/core";
import { useState } from 'react'

import { useSinglePlatziPunkData } from '../../hooks/usePlatziPunksData'
import usePlatziPunks from "../../hooks/usePlatziPunks";  
  

import{Stack,Heading,Text,Table,Thead,Tr,Th,Td,Tbody,Button,Tag, useToast}from "@chakra-ui/react";
import RequestAccess from "../../components/RequestAccess";
import PunkCard from "../../components/PunkCard";
import Loading from "../../components/Loading";


const Punk = () => {
    const router = useRouter() // router.query.id
    const platziPunks = usePlatziPunks();
    const toast = useToast();
    const {punk, loading, update} = useSinglePlatziPunkData({tokenId: parseInt(router.query.id as string)})
    const{ active , account, library  } = useWeb3React(); 
    const [transfering, setTransfering] = useState(false)

    const handleTransferToken = async (tokenId: string) => {
        const address = prompt("Ingresa la dirección: ");
        const isAddress = library.utils.isAddress(address);

        if (isAddress) {
            setTransfering(true)
            platziPunks.methods
                .safeTransferFrom(account, address, tokenId)
                .send({ from: account })
                .on('error', ()=>{
                    setTransfering(false)
                })
                .on('transactionHash', (txHash: string) => {
                    toast({
                        title: "Transacción enviada",
                        description: txHash,
                        status: "info",
                    });
                })
                .on('receipt', () => {
                    setTransfering(false)
                    toast({
                        title: "Transacción confirmada",
                        description: `El punk ahora pertenece a ${address}`,
                        status: "success",
                    });
                    update();
                })
        } else {
            toast({
                title: "Dirección inválida",
                description: "La dirección no es una dirección de Ethereum",
                status: "error",
            });
            setTransfering(false);
        }
    }  

    if(!active) return <RequestAccess/>;
    
    if(loading) return <Loading/>;

    return(
        <Stack
            spacing={{base:8,md:10}}
            py={{base:5}}
            direction={{base:"column",md:"row"}}>
            <Stack>
                <PunkCard
                    props={{
                        base: "auto",
                        md: 0,
                    }}
                    name={punk.name}
                    image={punk.image}
                />
                <Button disabled={account!==punk.owner}colorScheme="green" onClick={()=>handleTransferToken(punk.tokenId)}>
                    {account!==punk.owner?"No eres el dueño":"Transferir"}
                </Button>
            </Stack>
            <Stack width="100%"spacing={5}>
                <Heading>{punk.name}</Heading>
                <Text fontSize="xl">{punk.description}</Text>
                <Text fontWeight={600}>DNA:<Tag ml={2}colorScheme="green">{punk.dna}</Tag></Text>
                <Text fontWeight={600}>Owner:<Tag ml={2}colorScheme="green">{punk.owner}</Tag></Text>
                <Table size="sm"variant="simple">
                    <Thead><Tr><Th>Atributo</Th><Th>Valor</Th></Tr></Thead>
                    <Tbody>
                        {Object.entries(punk.attributes).map(([key, value])=>(
                            <Tr key={key}><Td>{key}</Td>
                            <Td><Tag>{value as (string | number)}</Tag></Td></Tr>
                        ))}
                    </Tbody>
                </Table>
            </Stack>
        </Stack>);
}

export default Punk