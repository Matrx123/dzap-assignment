import React, { useEffect, useRef, useState } from "react";
// tailwindcss
import "../css/style.css";
import Info from "./Info";
import CustomInput from "./CustomInput";
import { processInputTexts } from "../utils/formatModel";

function Disperse() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [val, setVal] = useState<string>("");
  const [dividerVal, setDividerVal] = useState<number>(0);
  const [isDup, setDup] = useState<boolean>(false);
  const [lines, setLines] = useState<number>(1);
  const [errors, setErrors] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const lineNo = (e.target.value.match(/\n/g) || []).length + 1;
    setDup(false);
    setErrors([]);
    setLines(lineNo);
    setVal(e.target.value);
  };

  useEffect(() => {
    setErrors([]);
    setDup(false);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
      setDividerVal(textAreaRef.current.scrollHeight);
    }
  }, [val]);

  const handleSubmit = () => {
    processInputTexts(val, setErrors, setDup);
  };

  return (
    <>
      <div className="min-w-30px h-full text-white ml-80 flex justify-space">
        <p className="text-lg h-30px line-height-30px mt-10 ml-2">
          Addresses with Amounts
        </p>
        <p className="text-lg h-30px line-height-30px mt-10 ml-[31rem]">
          Upload File
        </p>
      </div>
      <CustomInput
        dividerVal={dividerVal}
        val={val}
        handleChange={handleChange}
        textAreaRef={textAreaRef}
        totalLines={lines}
      />
      <Info
        errors={errors}
        isDup={isDup}
        val={val}
        setVal={setVal}
        setLines={setLines}
      />
      <button
        onClick={handleSubmit}
        className="text-lg rounded-full w-[50rem] ml-20 mr-80 mt-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-md"
      >
        Next
      </button>
    </>
  );
}

export default Disperse;
