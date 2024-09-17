import { Copy, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function EpochTime() {
  const [epochTime, setEpochTime] = useState<string>();
  const [convertedTime, setConvertedTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const settingTime = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(settingTime);
    };
  }, []);

  return (
    <>
      <h1 className="inline-flex">
        Current EPOCH time: {currentTime}{" "}
        <span className="ml-2">
          <button onClick={()=> navigator.clipboard.writeText(currentTime.toString())}>
            <Copy size={20} />
          </button>
        </span>
      </h1>
      <div className="flex items-center space-x-5">
        <input
          type="text"
          className="h-20 w-52 rounded-xl bg-stone-600 p-5"
          placeholder="Epoch Time"
          value={epochTime}
          onChange={(e) => setEpochTime(e.target.value)}
        />
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              const converTime = new Date(Number(epochTime));
              setConvertedTime(converTime);
            }}
          >
            <MoveRight size={30} />
          </button>
        </div>
        <h1>{convertedTime?.toLocaleString()}</h1>
        {/* <input type="text" className="h-20 rounded-xl bg-stone-600 p-5 w-52" placeholder="EST Time" value={time} onChange={(e)=> setTime(e.target.value)}/> */}
      </div>
    </>
  );
}
