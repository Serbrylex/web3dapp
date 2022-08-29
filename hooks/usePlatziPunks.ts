import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core';

import PlatziPunksArtifacts from '../config/artifacts/PlatziPunks'
const { address, abi } = PlatziPunksArtifacts;    

const usePlatziPunks = () => {
    const { active, library, chainId } = useWeb3React()

    const platziPunks = useMemo(()=>{
        if (active) {
            const key = chainId != undefined ? chainId : 4;
            return new library.eth.Contract(abi, address[key as keyof typeof address])
        }
    }, [active, chainId, library]);

    return platziPunks
}

export default usePlatziPunks;