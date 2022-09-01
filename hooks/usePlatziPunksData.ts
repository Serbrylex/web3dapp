import { useState, useCallback, useEffect } from 'react'
import usePlatziPunks from './usePlatziPunks';

const punksTemplate = {
    tokenId: '',
    attributes: {
        accessoriesType: '',
        clotheColor: '',
        clotheType: '',
        eyeType: '',
        eyeBrowType: '',
        facialHairColor: '',
        facialHairType: '',
        hairColor: '',
        hatColor: '',
        graphicType: '',
        mouthType: '',
        skinColor: '',
        topType: ''
    },
    tokenURI: '',
    dna: 0,
    owner: '',
    metadata: {
        name: '',
        description: '',
        image: ''
    }
}

const useGetPunkData = async ({ platziPunks, tokenId } : { platziPunks: any, tokenId: number } )  => {
    const [
        tokenURI,
        dna,
        owner
    ] = await Promise.all([
        platziPunks.methods.tokenURI(tokenId).call(),
        platziPunks.methods.tokenDNA(tokenId).call(),
        platziPunks.methods.ownerOf(tokenId).call()
    ])
    const [
        accessoriesType,
        clotheColor,
        clotheType,
        eyeType,
        eyeBrowType,
        facialHairColor,
        facialHairType,
        hairColor,
        hatColor,
        graphicType,
        mouthType,
        skinColor,
        topType,
    ] = await Promise.all([        
        platziPunks.methods.getAccesoriesType(dna).call(),        
        platziPunks.methods.getClotheColor(dna).call(),
        platziPunks.methods.getClotheType(dna).call(),
        platziPunks.methods.getEyeType(dna).call(),
        platziPunks.methods.getEyeBrowType(dna).call(),
        platziPunks.methods.getFacialHairColor(dna).call(),
        platziPunks.methods.getFacialHairType(dna).call(),
        platziPunks.methods.getHairColor(dna).call(),
        platziPunks.methods.getHatColor(dna).call(),
        platziPunks.methods.getGraphicType(dna).call(),
        platziPunks.methods.getMouthType(dna).call(),
        platziPunks.methods.getSkinColor(dna).call(),
        platziPunks.methods.getTopType(dna).call(),
    ]);
    const responseMetaData = await fetch(tokenURI)
    const metadata = await responseMetaData.json()    

    return { 
        tokenId,
        attributes: {
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType
        },
        tokenURI,
        dna,
        owner,
        ...metadata
    }
}

const usePlatziPunksData = ({ owner }: {owner : string}) => {
    const [punks, setPunks] = useState<any>([punksTemplate]);
    const [loading, setLoading] = useState(true);
    const platziPunks = usePlatziPunks();

    const update = useCallback( async ()=>{
        if (platziPunks) {
            setLoading(true);

            let tokenIds: number[] = [];
            const totalSupply = await platziPunks.methods.totalSupply().call();
            for (let index = 0; index < totalSupply; index++) {
                tokenIds.push(index)                
            }                           
            
            const PunksPromise = await tokenIds.map((tokenId) => {
                const data = useGetPunkData({ platziPunks, tokenId })                
                return data
            })            

            let punks = await Promise.all(PunksPromise);  
            console.log(owner)          
            if (owner.length > 0) {
                punks = punks.filter((punk)=>{
                    if (punk.owner === owner) {
                        return punk
                    }
                })
            }   
            console.log(punks)      
            setPunks(punks)
            setLoading(false)
        }
    }, [platziPunks, owner])

    useEffect(()=>{
        update()
    }, [update])

    return {
        punks,
        loading,
        update
    }
}

const useSinglePlatziPunkData = ({ tokenId }: {tokenId: number}) => {
    const [punk, setPunk] = useState<any>(punksTemplate);
    const [loading, setLoading] = useState(true);
    const platziPunks = usePlatziPunks();

    const update = useCallback(async()=>{
        setLoading(true)
        const punkRes = await useGetPunkData({ platziPunks, tokenId })        
        setPunk(punkRes)
        setLoading(false)
    }, [platziPunks, tokenId])

    useEffect(()=>{
        update()
    }, [update])

    return {
        punk,
        loading,
        update
    }
}   

export { usePlatziPunksData, useSinglePlatziPunkData };
