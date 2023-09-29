import React, { ChangeEvent, RefObject } from "react";

interface CustomInputProps {
  val: string;
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  textAreaRef: RefObject<HTMLTextAreaElement>;
  dividerVal: number;
  totalLines: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  val,
  handleChange,
  textAreaRef,
  dividerVal,
  totalLines,
}) => {
  const renderLineNo = (): JSX.Element[] => {
    let lines = [];
    for (let i = 1; i <= totalLines; i++) {
      lines.push(
        <p
          key={`k-${i}`}
          className="h-30px line-height-30px m-0 text-slate-400"
        >
          {i}
        </p>
      );
    }
    return lines;
  };

  return (
    <div className="text-neutral-200 bg-neutral-950 p-2 w-[50rem] rounded-lg flex flex-col space-y-2 ml-80 mt-3">
      <div className="flex justify-between rounded-lg w-5 absolute mt-3.5 ml-3">
        <div className="min-w-30px h-full text-right bg-black text-white">
          {renderLineNo()}
        </div>
        <div
          className={`inline-block h-[${dividerVal}] min-h-[13em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50`}
        ></div>
      </div>
      <textarea
        className="rounded-lg p-1 bg-neutral-950 active:outline-none focus:outline-none rounded ml-10 resize-none"
        value={val}
        onChange={handleChange}
        rows={10}
        ref={textAreaRef}
      ></textarea>
    </div>
  );
};
export default CustomInput;
