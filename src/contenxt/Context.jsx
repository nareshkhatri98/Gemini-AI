import { createContext, useState }  from 'react';
import run from '../config/gemini'

export const Context = createContext()

const ContextProvider = (props) =>{
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompt, setPreviousPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("")

    const onSent = async (prompt) =>{
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
        const response = await run(input)
        setResultData(response);
        setLoading(false);
        setInput("");
    }
   
//    onSent("what is react js ") 

   const value = {
    input,
    setInput,
    onSent,
    recentPrompt,
    setRecentPrompt,
    previousPrompt,
    setPreviousPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,

    }

    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;

