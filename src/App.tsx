import { useEffect, useRef, useState } from "react";
import data from "./assets/links.json";
import Fuse from "fuse.js";
import { Equal, MoveLeft, MoveRight, RefreshCw, Save, XCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {v4 as uuidv4} from 'uuid';

interface ItemCard {
  name: string;
  type: string;
  link: string;
  extraLinks?: Record<string, string>;
}

const colorMap: Record<string, string> = {
  github: " bg-slate-600",
  splunk: " bg-green-600",
  jira: " bg-blue-600",
  jenkins: "bg-orange-600",
  default: " border-4",
};

const jiraBaseLink = "https://amrp.atlassian.net/browse";

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [uuid,setUuid] = useState(uuidv4())
  const [epochTime, setEpochTime] = useState<string>()
  const [time, setTime] = useState<Date | null>(null)
  let linkData: ItemCard[] = data as ItemCard[];
  const itemStyle = " rounded-xl p-5 hover:scale-105 flex flex-col h-min";

  const fuse = new Fuse(linkData, {
    keys: ["name"],
    minMatchCharLength: 3,
    // includeMatches: true,
    includeScore: true,
  });

  useEffect(() => {
    console.log("Mounted");

    const handleKeyboardListner = (event: KeyboardEvent) => {
      if (inputRef && inputRef.current && event.code === "Escape") {
        // console.log("focus on the search bar")
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboardListner);

    return () => {
      window.removeEventListener("keydown", handleKeyboardListner);
    };
  }, []);

  const handleSearchWord = (event: any) => {
    setSearch(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key);
    if (search.startsWith("/") && event.key === "Enter") {
      const computeURL = jiraBaseLink + search.toUpperCase();
      console.log(computeURL);
      window.open(computeURL);
    } else if (event.key === "Enter") {
      window.open(fuse.search(search)[0].item.link);
    }

    if (event.key === "Escape") {
      setSearch("");
    }
  };

  const pickColorBasedOnType = (type: string) => {
    return type in colorMap ? colorMap[type] : colorMap.default;
  };

  function ButtonLinkLabel({ link, label }: { link: string; label: string }) {
    return (
      <a
        className="text-center hover:font-extrabold"
        target="_blank"
        href={link}
      >
        {label}
      </a>
    );
  }

  function ItemCard({ value, index }: { value: ItemCard; index: any }) {
    return (
      <div
        key={index}
        className={twMerge(itemStyle, pickColorBasedOnType(value.type))}
      >
        <ButtonLinkLabel link={value.link} label={value.name} />
        <div className="flex w-full justify-evenly space-x-4">
          {value.extraLinks &&
            Object.keys(value.extraLinks).map((label, index) => {
              if (value.extraLinks && value.extraLinks[label]) {
                return (
                  <ButtonLinkLabel
                    link={value.extraLinks[label]}
                    label={label}
                    key={index}
                  />
                );
              }
            })}
        </div>
      </div>
    );
  }

  function Utility() {
    return (
      <>
      <h2 className="text-2xl underline underline-offset-4">Utilities</h2>
      <div className="flex space-x-5 items-center">
        <h1>{uuid}</h1>
        <button onClick={() => setUuid(uuidv4())}>
          <RefreshCw size={30} />
        </button>
      </div>
      <h1>Current EPOCH time: {Date.now()}</h1>
      <div className="flex space-x-5 items-center">
      <input type="text" className="h-20 rounded-xl bg-stone-600 p-5 w-52" placeholder="Epoch Time" value={epochTime} onChange={(e) => setEpochTime(e.target.value)} />
      <div className="flex flex-col space-y-2">
        <button onClick={() => {
          const converTime = new Date(Number(epochTime))
          setTime(converTime)
        }}>
          <MoveRight size={30} />
        </button>
        {/* <button>
          <MoveLeft size={30} />
        </button> */}
      </div>
      <h1>{time?.toLocaleString()}</h1>
      {/* <input type="text" className="h-20 rounded-xl bg-stone-600 p-5 w-52" placeholder="EST Time" value={time} onChange={(e)=> setTime(e.target.value)}/> */}
      </div></>
    )
  }

  return (
    <div className="min-w-screen relative flex min-h-screen flex-col gap-5 bg-stone-700 p-10 font-mono text-slate-200">
      <div className="flex space-x-5">
        <input
          className="h-20 flex-1 rounded-xl bg-stone-600 p-5"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(event) => handleSearchWord(event)}
          onKeyDown={(event) => handleKeyDown(event)}
          ref={inputRef}
        />
        <button onClick={() => setSearch("")}>
          <XCircle size={30} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        {fuse.search(search).map((value, index) => (
          <ItemCard value={value.item} index={index} />
        ))}
      </div>

      <Utility />
      
      <h2 className="text-2xl underline underline-offset-4">All</h2>
      <div className="flex flex-wrap items-center gap-5">
        {linkData.map((value, index) => (
          <ItemCard value={value} index={index} />
        ))}
      </div>

      
      
    </div>
  );
}

export default App;
