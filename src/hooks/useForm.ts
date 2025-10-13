import { DataPsychologist } from "@/interfaces/psychologist";
import { useState } from "react";


export const useForm = ({}) => {
    const [values, setValues] = useState({} as DataPsychologist);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    

    return {
        values,
        handleChange,
        
        setValues
    };
}
