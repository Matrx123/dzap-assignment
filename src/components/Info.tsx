import React, { useEffect, useRef } from "react";
import { keepFirstAction } from "../utils/formatModel";

interface InfoProps {
  errors: any[];
  isDup: boolean;
  val: string;
  setVal: React.Dispatch<React.SetStateAction<string>>;
  setLines: React.Dispatch<React.SetStateAction<number>>;
}

const Info: React.FC<InfoProps> = ({
  errors,
  isDup,
  val,
  setVal,
  setLines,
}) => {
  const errorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (errorRef.current) {
      errorRef.current.style.height = "auto";
      errorRef.current.style.height = errorRef.current.scrollHeight + "px";
    }
  }, [errors]);

  const renderErrors = (): JSX.Element[] => {
    let _errors = [];
    //errors
    for (let i = 0; i < errors.length; i++) {
      const element = errors[i];
      const _type = typeof errors[i];
      if (_type === "object") {
        _errors.push(
          <p key={`d-${i}`}>
            {`Address ${element.address} duplicate in line: ${element.indices}`}
          </p>
        );
      } else {
        _errors.push(
          <p key={`e-${i}`} className="float-left">
            {element}
          </p>
        );
      }
    }

    return _errors;
  };

  const keepFirst = (): void => {
    keepFirstAction(val, setVal, errors, setLines, null);
  };

  const combineBalance = (): void => {
    keepFirstAction(val, setVal, errors, setLines, "combine");
  };

  return (
    <>
      <div className="min-w-30px h-full text-white ml-80 flex justify-space">
        <p className="text-lg h-30px line-height-30px mt-10">
          Separated by ',' or '' or '='
        </p>
        <p className="text-lg h-30px line-height-30px mt-10 ml-[29rem] text-gray-600">
          Show Example
        </p>
      </div>
      {isDup ? (
        <div className="min-w-30px h-full text-white ml-80 flex justify-space mt-5">
          <p className="text-lg h-30px line-height-30px mt-5">Duplicated</p>
          <button
            onClick={keepFirst}
            className="mt-5 ml-[22rem] bg-transparent text-red-700 font-semibold py-2 px-4 border border-red-500 rounded"
          >
            Keep the first one
          </button>
          <button
            onClick={combineBalance}
            className="mt-5 ml-[1rem] bg-transparent text-red-700 font-semibold py-2 px-4 border border-red-500 rounded"
          >
            Combine Balance
          </button>
        </div>
      ) : null}
      {errors.length ? (
        <div
          className="w-[50rem] h-[3rem] ml-80 mt-6 text-red-700 border border-red-500 rounded-lg flex"
          role="alert"
          ref={errorRef}
        >
          <span className="mt-1 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 ml-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="grid grid-cols-1 p-3">{renderErrors()}</div>
        </div>
      ) : null}
    </>
  );
};

export default Info;
